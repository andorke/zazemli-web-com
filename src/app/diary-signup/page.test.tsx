import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DiarySignupPage, { metadata } from "@/app/diary-signup/page";
import sitemap from "@/app/sitemap";
import { diary } from "@/content/diary";

/*
 * /diary-signup — страница-форма по прототипу (заглушка снята, task 2.1).
 * Инварианты site-shell сохраняются: noindex + страницы нет в sitemap (вход по QR).
 * Один h1. Тексты — из diary.ts (хардкод в JSX запрещён, DEVELOPMENT.md).
 */
describe("/diary-signup — роут страницы-формы", () => {
  it("noindex сохранён — вход только по QR", () => {
    expect(metadata.robots).toMatchObject({ index: false });
  });

  it("вне sitemap — вход только по QR", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).not.toContain("https://zazemli.com/diary-signup");
  });

  it("ровно один h1, несёт заголовок hero из diary.ts", () => {
    const { container } = render(<DiarySignupPage />);
    const headings = container.querySelectorAll("h1");
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(diary.hero.title);
  });

  it("рендерит hero-контент из diary.ts (eyebrow, sub)", () => {
    render(<DiarySignupPage />);
    expect(screen.getByText(diary.hero.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(diary.hero.sub)).toBeInTheDocument();
  });
});
