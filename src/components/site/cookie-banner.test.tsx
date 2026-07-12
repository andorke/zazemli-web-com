import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { CookieBanner } from "@/components/site/cookie-banner";
import { getConsent } from "@/lib/consent";

describe("CookieBanner", () => {
  beforeEach(() => localStorage.clear());

  it("показывается при первом визите (согласие не задано)", async () => {
    render(<CookieBanner />);
    expect(
      await screen.findByRole("button", { name: "Принять" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Только необходимые" }),
    ).toBeInTheDocument();
  });

  it("«Только необходимые» сохраняет denied и скрывает баннер", async () => {
    render(<CookieBanner />);
    await userEvent.click(
      await screen.findByRole("button", { name: "Только необходимые" }),
    );
    expect(getConsent()).toBe("denied");
    expect(
      screen.queryByRole("button", { name: "Принять" }),
    ).not.toBeInTheDocument();
  });

  it("«Принять» сохраняет granted", async () => {
    render(<CookieBanner />);
    await userEvent.click(
      await screen.findByRole("button", { name: "Принять" }),
    );
    expect(getConsent()).toBe("granted");
  });

  it("при ранее сохранённом выборе не показывается", () => {
    localStorage.setItem("zazemli-consent", "granted");
    render(<CookieBanner />);
    expect(
      screen.queryByRole("button", { name: "Принять" }),
    ).not.toBeInTheDocument();
  });

  it("текст нотиса содержит ссылку на /privacy", async () => {
    render(<CookieBanner />);
    const link = await screen.findByRole("link", {
      name: /политик/i,
    });
    expect(link).toHaveAttribute("href", "/privacy");
  });
});
