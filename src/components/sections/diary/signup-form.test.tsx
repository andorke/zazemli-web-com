import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SignupForm } from "@/components/sections/diary/signup-form";
import { diary } from "@/content/diary";

/*
 * Форма подписки /diary-signup (task 2.2): валидация email по формату, два
 * непредзаполненных согласия, submit собирает ошибки и уводит фокус на первую.
 * Состояния отправки + confirmation — task 2.3 (ниже); встроенная ссылка CB1 →
 * /privacy и попап — task 2.4. Копи проверяем из diary.ts.
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

/*
 * Состояния отправки и confirmation (task 2.3). Успех подменяет форму
 * confirmation-блоком (design Decision 4: сбор выключен → сразу confirmation);
 * ошибка отправки показывает микрокопи из diary.states, форма остаётся.
 * Реальную обёртку POST (флаг/null-эндпоинт, payload) подключит task 3.2.
 */
describe("SignupForm — состояния отправки и confirmation (task 2.3)", () => {
  async function fillValid() {
    await userEvent.type(
      screen.getByLabelText(diary.form.label),
      "me@example.com",
    );
    for (const box of screen.getAllByRole("checkbox"))
      await userEvent.click(box);
    await userEvent.click(
      screen.getByRole("button", { name: diary.form.submit }),
    );
  }

  it("валидный submit → форма скрыта, показан confirmation (role=status, копи из diary.ts)", async () => {
    render(<SignupForm />);
    await fillValid();

    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent(diary.confirmation.title);
    diary.confirmation.body.forEach((line) =>
      expect(status).toHaveTextContent(line),
    );
    expect(status).toHaveTextContent(diary.confirmation.signature);
    // форма подменена — поля email больше нет
    expect(screen.queryByLabelText(diary.form.label)).not.toBeInTheDocument();
  });

  it("ошибка отправки → микрокопи из diary.states, форма остаётся для повтора", async () => {
    render(
      <SignupForm
        onSubmit={async () => ({ ok: false, state: "network" }) as const}
      />,
    );
    await fillValid();

    expect(await screen.findByText(diary.states.network)).toBeInTheDocument();
    expect(screen.getByLabelText(diary.form.label)).toBeInTheDocument();
  });
});

/*
 * Встроенная ссылка в CB1 и попап-резюме политики (task 2.4). Ссылка ведёт на
 * /privacy (запасной вариант без JS), но клик открывает попап «Коротко о данных»,
 * не уводя со страницы. Клик по ссылке не должен отмечать согласие.
 */
describe("SignupForm — ссылка CB1 → /privacy и попап политики (task 2.4)", () => {
  const pdnLink = diary.form.consents[0].link;

  it("ссылка в CB1 ведёт на /privacy", () => {
    render(<SignupForm />);
    const link = screen.getByRole("link", { name: pdnLink?.label });
    expect(link).toHaveAttribute("href", pdnLink?.href);
  });

  it("клик по ссылке CB1 открывает попап-резюме политики", async () => {
    render(<SignupForm />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("link", { name: pdnLink?.label }));
    expect(
      screen.getByRole("dialog", { name: diary.policyModal.title }),
    ).toBeInTheDocument();
  });

  it("клик по ссылке CB1 не отмечает согласие", async () => {
    render(<SignupForm />);
    await userEvent.click(screen.getByRole("link", { name: pdnLink?.label }));
    expect(screen.getAllByRole("checkbox")[0]).not.toBeChecked();
  });
});
