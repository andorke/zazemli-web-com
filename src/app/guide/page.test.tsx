import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { render, screen } from "@testing-library/react";
import type { Metadata } from "next";
import { describe, expect, it } from "vitest";

import GuidePage, { metadata } from "@/app/guide/page";
import GuidePerevalkaPage, {
  metadata as perevalkaMetadata,
} from "@/app/guide/perevalka/page";
import GuidePolnayaZamenaPage, {
  metadata as polnayaZamenaMetadata,
} from "@/app/guide/polnaya-zamena/page";
import { guideEntry } from "@/content/guide";

/* Вход гайда v4.0: hero → флоу → инвентарь → стадии 00–01 → развилка → Ozon */
describe("/guide: вход", () => {
  it("один h1 канона", () => {
    render(<GuidePage />);
    const h1 = screen.getAllByRole("heading", { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveTextContent(guideEntry.hero.title);
  });

  it("стадии 00 и 01, шагов маршрутов на входе нет", () => {
    const { container } = render(<GuidePage />);
    const ids = Array.from(container.querySelectorAll("li[id^='step-']")).map(
      (el) => el.id,
    );
    expect(ids).toEqual(["step-0", "step-1"]);
    for (const title of ["Дренаж", "Грунт и посадка", "Дневник"]) {
      expect(
        screen.queryByRole("heading", { level: 2, name: title }),
      ).not.toBeInTheDocument();
    }
  });

  it("инвентарь: все пункты и легенда ● в боксе / ○ своё", () => {
    render(<GuidePage />);
    for (const item of guideEntry.kit.items) {
      expect(screen.getByText(item.text, { exact: false })).toBeInTheDocument();
    }
    expect(screen.getByText(guideEntry.kit.time)).toBeInTheDocument();
    expect(screen.getByText("в боксе")).toBeInTheDocument();
    expect(screen.getByText("своё")).toBeInTheDocument();
  });

  it("развилка стоит после осмотра кома и ведёт на оба маршрута", () => {
    const { container } = render(<GuidePage />);
    const fork = container.querySelector("#fork");
    expect(fork).toBeInTheDocument();
    expect(
      container.querySelector("#step-1")!.compareDocumentPosition(fork!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    for (const path of guideEntry.fork.paths) {
      expect(
        screen.getByRole("link", { name: new RegExp(path.button.label) }),
      ).toHaveAttribute("href", path.button.href);
    }
  });

  it("HowTo на входе нет (design 3)", () => {
    const { container } = render(<GuidePage />);
    expect(
      container.querySelector('script[type="application/ld+json"]'),
    ).not.toBeInTheDocument();
  });

  /* Вход собирает вес обеих веток: canonical на себя, noindex тут не ставим */
  it("canonical на себя, без noindex", () => {
    expect(metadata.alternates?.canonical).toBe("/guide");
    expect(metadata.robots).toBeUndefined();
  });

  it("возврат на главную", () => {
    render(<GuidePage />);
    expect(screen.getByRole("link", { name: "← На главную" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});

/*
 * Снятое решениями 30.07 (FIX-62 · FIX-64): блоки «Готово, когда» и лид-строки
 * под заголовками шагов сняты как описание перед инструкцией; анимации сверх
 * существующего `.reveal` нет; раскрывашки — нативные, без JS. Держим сразу на
 * трёх страницах: вернуть их проще всего в общий рендер стадий.
 */
const guidePages: [string, () => React.ReactElement][] = [
  ["/guide", GuidePage],
  ["/guide/perevalka", GuidePerevalkaPage],
  ["/guide/polnaya-zamena", GuidePolnayaZamenaPage],
];

describe.each(guidePages)("%s: снятые элементы", (_url, Page) => {
  it("блоков «Готово, когда» нет", () => {
    const { container } = render(<Page />);
    expect(container.textContent).not.toContain("Готово, когда");
  });

  it("между заголовком стадии и микрошагами нет лид-строки", () => {
    const { container } = render(<Page />);
    const stages = Array.from(container.querySelectorAll("li[id^='step-']"));
    expect(stages.length).toBeGreaterThan(0);
    for (const stage of stages) {
      const heading = stage.querySelector("h2");
      expect(heading?.nextElementSibling?.firstElementChild?.tagName).toBe("OL");
    }
  });

  it("подсказки раскрываются без JS: закрытый details несёт тело в разметке", () => {
    const { container } = render(<Page />);
    const tips = Array.from(container.querySelectorAll("details"));
    expect(tips.length).toBeGreaterThan(0);
    for (const tip of tips) {
      const summary = tip.querySelector("summary");
      expect(summary).not.toBeNull();
      expect(tip.open).toBe(false);
      expect(tip.textContent!.length).toBeGreaterThan(
        summary!.textContent!.length,
      );
    }
  });

  it("анимации сверх `.reveal` нет", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll("[class*='animate-']")).toHaveLength(0);
  });
});

/*
 * Приёмка PATCH-1 §7.2: три URL гайда открываются и связаны между собой —
 * вход ведёт на обе ветки, каждая ветка на соседнюю (обратной ссылки ветка →
 * вход канон не требует). src/content/guide.test.ts держит те же пути на
 * уровне данных, здесь — что рендер их действительно выводит.
 */
describe("гайд: карта переходов", () => {
  const pageByUrl = new Map(guidePages);

  const linksOf = (Page: () => React.ReactElement) => {
    const { container } = render(<Page />);
    return Array.from(container.querySelectorAll("a[href]")).map(
      (a) => a.getAttribute("href")!,
    );
  };

  const expectedTargets: Record<string, string[]> = {
    "/guide": ["/guide/perevalka", "/guide/polnaya-zamena"],
    "/guide/perevalka": ["/guide/polnaya-zamena"],
    "/guide/polnaya-zamena": ["/guide/perevalka"],
  };

  it.each(guidePages)("%s ведёт на свои страницы гайда", (url, Page) => {
    const targets = linksOf(Page).filter(
      (href) => pageByUrl.has(href) && href !== url,
    );
    expect([...new Set(targets)].sort()).toEqual(expectedTargets[url]);
  });

  it.each(guidePages)("%s: внутренние ссылки ведут на маршруты", (url, Page) => {
    /* Ozon-блок ведёт на якорь главной (`/#collectio`) — сверяем путь без хеша */
    const internal = linksOf(Page)
      .filter((href) => href.startsWith("/"))
      .map((href) => href.split("#")[0]);
    expect(internal.length).toBeGreaterThan(0);
    for (const href of internal) {
      const page = resolve(process.cwd(), "src/app", href.slice(1), "page.tsx");
      expect(existsSync(page), `${url}: нет страницы для ${href}`).toBe(true);
    }
  });
});

/*
 * Приёмка PATCH-1 §7.2: контракт canonical/noindex целиком, а не по странице.
 * Смысл контракта — весь вес трёх страниц уходит на один URL /guide, ветки при
 * этом вне индекса. Пер-страничные тесты держат метаданные каждой страницы,
 * здесь — что вместе они складываются в это, и canonical резолвится в
 * абсолютный вид (Next достраивает его metadataBase из layout.tsx).
 */
describe("гайд: canonical/noindex-контракт", () => {
  const site = "https://zazemli.com";
  const guideMeta: [string, Metadata][] = [
    ["/guide", metadata],
    ["/guide/perevalka", perevalkaMetadata],
    ["/guide/polnaya-zamena", polnayaZamenaMetadata],
  ];

  it.each(guideMeta)("%s: canonical ведёт на вход гайда", (_url, meta) => {
    const canonical = meta.alternates?.canonical;
    expect(canonical).toBeTruthy();
    expect(new URL(String(canonical), site).href).toBe(`${site}/guide`);
  });

  it("вне индекса ровно две ветки, вход индексируется", () => {
    const noindex = guideMeta.filter(
      ([, meta]) =>
        typeof meta.robots === "object" && meta.robots?.index === false,
    );
    expect(noindex.map(([url]) => url)).toEqual([
      "/guide/perevalka",
      "/guide/polnaya-zamena",
    ]);
    /* follow — обязательная половина: ссылочный вес веток течёт на вход */
    for (const [, meta] of noindex) {
      expect(meta.robots).toMatchObject({ follow: true });
    }
  });
});
