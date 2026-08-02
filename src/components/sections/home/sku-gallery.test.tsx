import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkuGallery } from "@/components/sections/home/sku-gallery";
import { skus } from "@/content/sku";

describe("SkuGallery (галерея #collectio по прототипу)", () => {
  it("секция несёт якорь id=collectio", () => {
    const { container } = render(<SkuGallery />);
    expect(container.querySelector("section#collectio")).not.toBeNull();
  });

  it("eyebrow партии и заголовок «семь рецептур земли» (FIX-27)", () => {
    render(<SkuGallery />);
    expect(
      screen.getByText("Collectio Zazemli · Партия 0"),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Семь растений — семь рецептур земли",
    );
  });

  it("7 кликабельных карточек SKU с нумерацией «N° 01»…«N° 07»", () => {
    render(<SkuGallery />);
    const cards = screen.getAllByRole("link", { name: /Открыть →/ });
    expect(cards).toHaveLength(7);
    expect(screen.getByText("N° 01")).toBeInTheDocument();
    expect(screen.getByText("N° 07")).toBeInTheDocument();
    expect(screen.getByText("монстера")).toBeInTheDocument();
    expect(screen.getByText("эпипремнум")).toBeInTheDocument();
  });

  it("карточки ведут на страницы товара /collectio/[slug]", () => {
    render(<SkuGallery />);
    const cards = screen.getAllByRole("link", { name: /Открыть →/ });
    expect(cards).toHaveLength(skus.length);
    cards.forEach((card, i) => {
      expect(card).toHaveAttribute("href", `/collectio/${skus[i].slug}`);
    });
  });

  it("мета карточки: компоненты и объёмы с ценой", () => {
    render(<SkuGallery />);
    // по прототипу: 10 компонентов у монстеры, антуриума и аглаонемы
    expect(screen.getAllByText("10 компонентов")).toHaveLength(3);
    // «2,2 / 3,5 л · от 2 290 ₽» — монстера и фикус
    expect(screen.getAllByText("2,2 / 3,5 л · от 2 290 ₽")).toHaveLength(2);
  });

  it("восьмая карточка — приглашение «N° 08 — ?», не ссылка", () => {
    render(<SkuGallery />);
    const number = screen.getByText("N° 08 — ?");
    expect(number).toBeInTheDocument();
    const invite = number.closest("div");
    expect(invite).not.toBeNull();
    expect(
      within(invite as HTMLElement).getByText(
        "Твоего растения нет в коллекции?",
      ),
    ).toBeInTheDocument();
    expect(number.closest("a")).toBeNull();
  });

  it("CTA «Вся коллекция →» ведёт на /collectio", () => {
    render(<SkuGallery />);
    const cta = screen.getByRole("link", { name: "Вся коллекция →" });
    expect(cta).toHaveAttribute("href", "/collectio");
  });

  it("фото-слоты карточек — заливка chalk без текстовой заглушки (FIX-03)", () => {
    const { container } = render(<SkuGallery />);
    expect(container.textContent).not.toContain("фото");
    const slots = container.querySelectorAll(
      "span.bg-chalk.aspect-\\[3\\/4\\]",
    );
    expect(slots).toHaveLength(7);
  });

  /*
   * NEW-01: в прототипе широкий селектор `.coll a` протекал на служебные ссылки
   * плитки N°08. В Tailwind это значит — никаких селекторов-потомков на секции.
   */
  it("карточные стили висят на карточках, а не на всех ссылках секции", () => {
    const { container } = render(<SkuGallery />);
    const section = container.querySelector("section#collectio")!;
    expect(section.className).not.toMatch(/\[&/);
    const list = section.querySelector("ul")!;
    expect(list.className).not.toMatch(/\[&/);
    for (const card of screen.getAllByRole("link", { name: /Открыть →/ })) {
      expect(card.className).toContain("flex");
    }
  });

  it("плитка N°08 не несёт карточных стилей и служебных ссылок", () => {
    render(<SkuGallery />);
    const invite = screen.getByText("N° 08 — ?").closest("div")!;
    expect(within(invite).queryAllByRole("link")).toHaveLength(0);
    expect(invite.className).not.toContain("aspect-[3/4]");
  });

  it("SKU-цвета на главной не используются (только moss-акцент)", () => {
    const { container } = render(<SkuGallery />);
    const html = container.innerHTML;
    for (const color of ["cosmos", "iris", "buttercup", "sky", "poppy"]) {
      expect(html).not.toContain(color);
    }
  });
});
