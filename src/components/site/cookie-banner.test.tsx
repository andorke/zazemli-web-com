import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { CookieBanner } from "@/components/site/cookie-banner";
import { getConsent } from "@/lib/consent";

/* Нотис verbatim из спеки analytics-consent (PATCH-1 §4б). */
const NOTICE =
  "Мы используем файлы cookie. Обязательные — чтобы сайт работал; " +
  "аналитические (Яндекс.Метрика) — только с твоего согласия. " +
  "Подробнее — в Политике конфиденциальности.";

describe("CookieBanner", () => {
  beforeEach(() => localStorage.clear());

  it("показывается при первом визите (согласие не задано)", async () => {
    render(<CookieBanner />);
    expect(
      await screen.findByRole("button", { name: "Принять все" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Только необходимые" }),
    ).toBeInTheDocument();
  });

  it("«Только необходимые» сохраняет necessary и скрывает баннер", async () => {
    render(<CookieBanner />);
    await userEvent.click(
      await screen.findByRole("button", { name: "Только необходимые" }),
    );
    expect(getConsent()).toBe("necessary");
    expect(
      screen.queryByRole("button", { name: "Принять все" }),
    ).not.toBeInTheDocument();
  });

  it("«Принять все» сохраняет all", async () => {
    render(<CookieBanner />);
    await userEvent.click(
      await screen.findByRole("button", { name: "Принять все" }),
    );
    expect(getConsent()).toBe("all");
  });

  it("при ранее сохранённом выборе (в т. ч. легаси) не показывается", () => {
    localStorage.setItem("zazemli-consent", "granted");
    render(<CookieBanner />);
    expect(
      screen.queryByRole("button", { name: "Принять все" }),
    ).not.toBeInTheDocument();
  });

  it("нотис совпадает с канонным текстом дословно", async () => {
    render(<CookieBanner />);
    const region = await screen.findByRole("region", {
      name: "Согласие на cookie",
    });
    const notice = region.querySelector("p");
    expect(notice?.textContent?.replace(/\s+/g, " ").trim()).toBe(NOTICE);
  });

  it("текст нотиса содержит ссылку на /privacy", async () => {
    render(<CookieBanner />);
    const link = await screen.findByRole("link", {
      name: /политик/i,
    });
    expect(link).toHaveAttribute("href", "/privacy");
  });
});
