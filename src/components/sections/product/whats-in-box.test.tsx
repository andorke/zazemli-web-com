import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WhatsInBox } from "@/components/sections/product/whats-in-box";
import { skuBoxContents, skus } from "@/content/sku";

const monstera = skus.find((s) => s.slug === "monstera")!;

describe("WhatsInBox (что в боксе, страница товара)", () => {
  it("eyebrow и H2 «на одну пересадку» в родительном падеже", () => {
    render(<WhatsInBox sku={monstera} />);
    expect(screen.getByText("Что в боксе")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Всё на одну пересадку монстеры",
    );
  });

  it("опись из общего модуля состава: 5 позиций и мост в лабораторию", () => {
    render(<WhatsInBox sku={monstera} />);
    expect(
      screen.getByText(/Грунт, собранный под монстеру · 10 компонентов/),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Листовка с гайдом по пересадке"),
    ).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("05")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "подробнее в лаборатории грунта →" }),
    ).toHaveAttribute("href", "/lab#rec-monstera");
  });

  it("четыре подпункта заботы, включая баночку угольной пудры", () => {
    render(<WhatsInBox sku={monstera} />);
    expect(
      screen.getByText(/баночка угольной пудры, чтобы подсушить свежий срез/),
    ).toBeInTheDocument();
    expect(screen.getByText(/корневин, чтобы на свежем срезе/)).toBeInTheDocument();
  });
});

/*
 * FIX-53 на уровне разметки. Сравнение массивов в box.test.ts тавтологично:
 * обе стороны держат одни и те же объекты общего модуля, поэтому оно зелёное
 * при любом содержимом. Нарушить можно другое — что общий состав дошёл до
 * каждой из семи карточек; здесь это и проверяется, рендером.
 */
describe.each(skus)("Состав бокса дошёл до карточки $slug", (sku) => {
  it("позиции 02–05 и подпункты заботы отрисованы дословно", () => {
    const { container } = render(<WhatsInBox sku={sku} />);
    for (const item of skuBoxContents(sku).slice(1)) {
      expect(container.textContent).toContain(item.text);
      for (const sub of item.sub ?? []) {
        expect(container.textContent).toContain(sub);
      }
    }
  });
});
