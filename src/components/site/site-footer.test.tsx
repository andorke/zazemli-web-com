import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "@/components/site/site-footer";
import { privacy } from "@/content/privacy";

describe("SiteFooter (по прототипу)", () => {
  it("колонка бренда: wordmark + тэглайн", () => {
    render(<SiteFooter />);
    expect(screen.getByText("ЗАЗЕМЛИ")).toBeInTheDocument();
    expect(
      screen.getByText("Земля и забота — всё, что нужно."),
    ).toBeInTheDocument();
  });

  it("связь: email и соцсети текстом, без иконок", () => {
    render(<SiteFooter />);
    const email = screen.getByRole("link", { name: "team@zazemli.com" });
    expect(email).toHaveAttribute("href", "mailto:team@zazemli.com");
    expect(
      screen.getByText(/Instagram · @zazemli_collectio/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Telegram · @zazemli_collectio/),
    ).toBeInTheDocument();
  });

  it("соцупоминания IG/TG — реальные профили, не ложные ссылки", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: /Instagram/ })).toHaveAttribute(
      "href",
      "https://instagram.com/zazemli_collectio",
    );
    expect(screen.getByRole("link", { name: /Telegram/ })).toHaveAttribute(
      "href",
      "https://t.me/zazemli_collectio",
    );
  });

  it('пустых href и href="#" в футере нет', () => {
    render(<SiteFooter />);
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs.filter((href) => !href || href === "#")).toEqual([]);
  });

  it("разделы: три ссылки, Коллекция — на якорь главной", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "Коллекция" })).toHaveAttribute(
      "href",
      "/#collectio",
    );
    expect(screen.getByRole("link", { name: "Лаборатория" })).toHaveAttribute(
      "href",
      "/lab",
    );
    expect(screen.getByRole("link", { name: "Гайд" })).toHaveAttribute(
      "href",
      "/guide",
    );
  });

  it("legal-строка: реквизиты verbatim, копирайт, «не оферта»", () => {
    render(<SiteFooter />);
    const legal = screen.getByText(/ИП Минетто/);
    expect(legal.textContent).toContain(
      "ИП Минетто А. А. · ОГРНИП 326330000022761 · работаем по УСН",
    );
    expect(legal).toHaveTextContent("© 2026 ЗАЗЕМЛИ");
    expect(legal).toHaveTextContent("не является публичной офертой");
  });

  /* Адрес в футере покрыт общим регресс-сканом src/ и out/ в privacy.test.ts */
  it("ИНН в футере не публикуется", () => {
    const { container } = render(<SiteFooter />);
    expect(container.textContent).not.toContain("ИНН");
    expect(container.textContent).not.toContain(privacy.operator.inn);
  });

  it("ссылка на политику конфиденциальности ведёт на /privacy", () => {
    render(<SiteFooter />);
    const link = screen.getByRole("link", {
      name: "Политика конфиденциальности",
    });
    expect(link).toHaveAttribute("href", "/privacy");
  });

  it("ссылка на условия использования ведёт на /terms", () => {
    render(<SiteFooter />);
    const link = screen.getByRole("link", {
      name: "Условия использования сайта",
    });
    expect(link).toHaveAttribute("href", "/terms");
  });

  it("QR-кодов (и вообще img) в футере нет", () => {
    render(<SiteFooter />);
    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });

  it("гигантского wordmark нет: ЗАЗЕМЛИ ровно один, без aria-hidden", () => {
    render(<SiteFooter />);
    const marks = screen.getAllByText("ЗАЗЕМЛИ");
    expect(marks).toHaveLength(1);
    expect(marks[0]).not.toHaveAttribute("aria-hidden");
  });

  it("глобальный дисклеймер не рендерится", () => {
    render(<SiteFooter />);
    expect(
      screen.queryByText(/Растения — не лекарство/),
    ).not.toBeInTheDocument();
  });

  it("ссылок на diary-signup нет", () => {
    render(<SiteFooter />);
    const links = screen.getAllByRole("link");
    expect(links.some((l) => l.getAttribute("href")?.includes("diary"))).toBe(
      false,
    );
  });
});
