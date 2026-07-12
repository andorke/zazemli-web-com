import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SignupForm } from "@/components/sections/diary/signup-form";
import { diary } from "@/content/diary";

/*
 * Форма подписки /diary-signup (task 2.2): валидация email по формату, два
 * непредзаполненных согласия, submit собирает ошибки и уводит фокус на первую.
 * Happy-path (confirmation) и микрокопи ошибок отправки — task 2.3; встроенная
 * ссылка CB1 → /privacy и попап — task 2.4. Копи проверяем из diary.ts.
 */
describe("SignupForm — валидация и согласия (task 2.2)", () => {
  it("оба чекбокса согласия не предзаполнены", () => {
    render(<SignupForm />);
    const boxes = screen.getAllByRole("checkbox");
    expect(boxes).toHaveLength(2);
    boxes.forEach((box) => expect(box).not.toBeChecked());
  });

  it("невалидный email при submit → aria-invalid, микрокопи и фокус на поле", async () => {
    render(<SignupForm />);
    const email = screen.getByLabelText(diary.form.label);
    await userEvent.type(email, "не-почта");
    // отмечаем оба согласия, чтобы первой ошибкой был именно email
    for (const box of screen.getAllByRole("checkbox"))
      await userEvent.click(box);
    await userEvent.click(
      screen.getByRole("button", { name: diary.form.submit }),
    );

    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText(diary.states.validation)).toBeInTheDocument();
    expect(email).toHaveFocus();
  });

  it("валидный email на blur → ok-микрокопи и aria-invalid=false", async () => {
    render(<SignupForm />);
    const email = screen.getByLabelText(diary.form.label);
    await userEvent.type(email, "me@example.com");
    await userEvent.tab();

    expect(screen.getByText(diary.form.emailOk)).toBeInTheDocument();
    expect(email).toHaveAttribute("aria-invalid", "false");
  });

  it("submit без согласий (email валиден) → ошибка согласий и фокус на первый чекбокс", async () => {
    render(<SignupForm />);
    await userEvent.type(
      screen.getByLabelText(diary.form.label),
      "me@example.com",
    );
    await userEvent.click(
      screen.getByRole("button", { name: diary.form.submit }),
    );

    expect(screen.getByText(diary.form.consentError)).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")[0]).toHaveFocus();
  });

  it("submit с одним согласием → фокус на второй, непроставленный чекбокс", async () => {
    render(<SignupForm />);
    await userEvent.type(
      screen.getByLabelText(diary.form.label),
      "me@example.com",
    );
    await userEvent.click(screen.getAllByRole("checkbox")[0]);
    await userEvent.click(
      screen.getByRole("button", { name: diary.form.submit }),
    );

    expect(screen.getAllByRole("checkbox")[1]).toHaveFocus();
  });

  it("фокус на первую ошибку: email и согласия невалидны → фокус на email", async () => {
    render(<SignupForm />);
    await userEvent.click(
      screen.getByRole("button", { name: diary.form.submit }),
    );

    expect(screen.getByLabelText(diary.form.label)).toHaveFocus();
  });
});
