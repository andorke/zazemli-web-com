import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "@/components/site/site-footer";

describe("SiteFooter", () => {
  it("дисклеймер присутствует дословно", () => {
    render(<SiteFooter />);
    expect(screen.getByText(/Растения — не лекарство\./)).toBeInTheDocument();
  });

  it("контакты: email и соцсети текстом", () => {
    render(<SiteFooter />);
    const email = screen.getByRole("link", { name: "team@zazemli.com" });
    expect(email).toHaveAttribute("href", "mailto:team@zazemli.com");
    expect(screen.getAllByText(/@zazemli_collectio/).length).toBeGreaterThan(0);
  });

  it("юр-информация ИП присутствует", () => {
    render(<SiteFooter />);
    expect(screen.getByText(/ИП Минетто/)).toBeInTheDocument();
  });

  it("ссылка на политику конфиденциальности ведёт на /privacy", () => {
    render(<SiteFooter />);
    const link = screen.getByRole("link", {
      name: "Политика конфиденциальности",
    });
    expect(link).toHaveAttribute("href", "/privacy");
  });

  it("QR-блок: 4 кода, без diary", () => {
    render(<SiteFooter />);
    const qrImages = screen.getAllByRole("img");
    expect(qrImages).toHaveLength(4);
    expect(
      qrImages.some((img) => img.getAttribute("src")?.includes("diary")),
    ).toBe(false);
  });

  it("ссылок на diary-signup нет", () => {
    render(<SiteFooter />);
    const links = screen.getAllByRole("link");
    expect(links.some((l) => l.getAttribute("href")?.includes("diary"))).toBe(
      false,
    );
  });

  it("гигантский wordmark ЗАЗЕМЛИ", () => {
    render(<SiteFooter />);
    expect(screen.getByText("ЗАЗЕМЛИ")).toBeInTheDocument();
  });
});
