import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { WaitlistModal } from "@/components/sections/home/waitlist-modal";
import { waitlist } from "@/content/waitlist";

const { modal, states, done } = waitlist;
const [lead, pdn] = modal.consents;

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function setup(props: Partial<React.ComponentProps<typeof WaitlistModal>> = {}) {
  const onClose = vi.fn();
  const onSubmit = vi.fn().mockResolvedValue(undefined);
  const view = render(
    <WaitlistModal
      plant="калатея"
      onClose={onClose}
      onSubmit={onSubmit}
      {...props}
    />,
  );
  return { ...view, onClose, onSubmit, user: userEvent.setup() };
}

/* Метрика: цели уходят через lib/metrika, здесь наблюдаем сам вызов ym */
function stubMetrika() {
  vi.stubEnv("NEXT_PUBLIC_METRIKA_ID", "12345");
  const ym = vi.fn();
  vi.stubGlobal("ym", ym);
  return ym;
}

describe("WaitlistModal — разметка попапа (task 3.1)", () => {
  it("закрыт, пока растение не передано", () => {
    setup({ plant: null });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.queryByText(modal.question)).toBeNull();
  });

  it("нативный <dialog> с заголовком, вопросом и подписью", () => {
    const { container } = setup();
    const dialog = screen.getByRole("dialog");
    expect(dialog.tagName).toBe("DIALOG");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(container.querySelector("dialog")).toHaveProperty("open", true);
    expect(screen.getByText(modal.kicker)).toBeInTheDocument();
    expect(screen.getByText(modal.question)).toBeInTheDocument();
    expect(screen.getByText(modal.sub)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: modal.submit }),
    ).toBeInTheDocument();
  });

  it("имя растения — отдельной строкой, как ввели (NEW-05)", () => {
    setup({ plant: "фикус Бенджамина" });
    const line = screen.getByText("фикус Бенджамина");
    expect(line).toBeInTheDocument();
    // текст вокруг не склоняется и имя в него не подставлено
    expect(screen.getByText(modal.question)).not.toHaveTextContent("фикус");
  });

  it("два согласия: ведущее 15px первым, ПДн ≥13px вторым, оба пусты (NEW-06)", () => {
    setup();
    const boxes = screen.getAllByRole("checkbox");
    expect(boxes).toHaveLength(2);
    expect(boxes[0]).toHaveAttribute("name", "consent_ads");
    expect(boxes[1]).toHaveAttribute("name", "consent_pdn");
    expect(boxes[0]).not.toBeChecked();
    expect(boxes[1]).not.toBeChecked();

    const leadLabel = boxes[0].closest("label");
    const pdnLabel = boxes[1].closest("label");
    expect(leadLabel).toHaveClass("text-[15px]");
    expect(pdnLabel).toHaveClass("text-[13px]");
    // таргет не меньше 44px у обоих
    expect(leadLabel).toHaveClass("min-h-11");
    expect(pdnLabel).toHaveClass("min-h-11");
  });

  it("ссылка политики внутри согласия — inline, своими стилями (NEW-01)", () => {
    setup();
    const link = screen.getByRole("link", { name: pdn.link!.label });
    expect(link).toHaveAttribute("href", "/privacy");
    expect(link).toHaveClass("inline");
    // карточные стили галереи внутрь формы не протекают
    expect(link.className).not.toMatch(/\bflex\b|aspect-|px-6/);
  });
});

describe("WaitlistModal — a11y (task 3.2)", () => {
  it("крестик закрытия — таргет 44×44", () => {
    setup();
    const close = screen.getByRole("button", { name: modal.close });
    expect(close).toHaveClass("size-11");
  });

  it("клик по фону закрывает попап", async () => {
    const { container, onClose, user } = setup();
    const dialog = container.querySelector("dialog")!;
    await user.click(dialog);
    expect(onClose).toHaveBeenCalled();
  });

  it("клик внутри окна попап не закрывает", async () => {
    const { onClose, user } = setup();
    await user.click(screen.getByText(modal.question));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("нативное закрытие (Esc) возвращает фокус на инициатор", async () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    trigger.focus();

    const { container, onClose } = setup();
    const dialog = container.querySelector("dialog")!;
    dialog.close();

    expect(onClose).toHaveBeenCalled();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
});

describe("WaitlistModal — пять состояний (task 3.3)", () => {
  it("пусто: ошибки почты и согласий, отправки нет, фокус на почте", async () => {
    const { onSubmit, user } = setup();
    await user.click(screen.getByRole("button", { name: modal.submit }));

    expect(screen.getByText(states.email)).toBeInTheDocument();
    expect(screen.getByText(states.consent)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByLabelText(modal.emailLabel));
  });

  it("кривой email: ошибка почты, отправки нет", async () => {
    const { onSubmit, user } = setup();
    await user.type(screen.getByLabelText(modal.emailLabel), "не-почта");
    await user.click(screen.getAllByRole("checkbox")[0]);
    await user.click(screen.getAllByRole("checkbox")[1]);
    await user.click(screen.getByRole("button", { name: modal.submit }));

    expect(screen.getByText(states.email)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("почта без согласий: фокус на визуально первом неотмеченном", async () => {
    const { onSubmit, user } = setup();
    await user.type(screen.getByLabelText(modal.emailLabel), "me@example.com");
    await user.click(screen.getByRole("button", { name: modal.submit }));

    expect(screen.getByText(states.consent)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getAllByRole("checkbox")[0]);
  });

  it("почта + одно согласие: отправки нет, фокус на неотмеченном", async () => {
    const { onSubmit, user } = setup();
    await user.type(screen.getByLabelText(modal.emailLabel), "me@example.com");
    await user.click(screen.getAllByRole("checkbox")[0]);
    await user.click(screen.getByRole("button", { name: modal.submit }));

    expect(screen.getByText(states.consent)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getAllByRole("checkbox")[1]);
  });

  it("почта + оба согласия: отправка по контракту и текст успеха", async () => {
    const { onSubmit, user } = setup();
    await user.type(screen.getByLabelText(modal.emailLabel), "me@example.com");
    await user.click(screen.getAllByRole("checkbox")[0]);
    await user.click(screen.getAllByRole("checkbox")[1]);
    await user.click(screen.getByRole("button", { name: modal.submit }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: "me@example.com",
      consent_ads: true,
      consent_pdn: true,
    });
    expect(screen.getByText(done.title)).toBeInTheDocument();
    expect(screen.getByText(done.body)).toBeInTheDocument();
    expect(screen.getByText(done.signature)).toBeInTheDocument();
  });
});

describe("WaitlistModal — цели Метрики (task 3.4)", () => {
  it("успешная отправка — ровно waitlist_submit со свойством plant", async () => {
    const ym = stubMetrika();
    const { user } = setup();
    await user.type(screen.getByLabelText(modal.emailLabel), "me@example.com");
    await user.click(screen.getAllByRole("checkbox")[0]);
    await user.click(screen.getAllByRole("checkbox")[1]);
    await user.click(screen.getByRole("button", { name: modal.submit }));

    const goals = ym.mock.calls.map((call) => call[2]);
    expect(goals).toEqual(["waitlist_submit"]);
    expect(ym).toHaveBeenCalledWith(12345, "reachGoal", "waitlist_submit", {
      plant: "калатея",
    });
  });

  it("заблокированная отправка — ровно waitlist_error", async () => {
    const ym = stubMetrika();
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: modal.submit }));

    expect(ym.mock.calls.map((call) => call[2])).toEqual(["waitlist_error"]);
  });

  it("ведущее согласие в тексте обещает одно письмо", () => {
    setup();
    expect(screen.getByText(lead.text)).toBeInTheDocument();
  });
});
