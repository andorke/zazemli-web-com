import { readFileSync } from "node:fs";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { WaitlistForm } from "@/components/sections/home/waitlist-form";
import { waitlist } from "@/content/waitlist";

const { step1, modal } = waitlist;

beforeEach(() => {
  // форма живёт за фича-флагом: без API её в плитке нет (design Decision 3)
  vi.stubEnv("NEXT_PUBLIC_WAITLIST_API", "/api/waitlist");
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }),
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("WaitlistForm — шаг 1 в плитке N°08 (task 2.1)", () => {
  it("без API формы в плитке нет — сбор не публикуется", () => {
    vi.stubEnv("NEXT_PUBLIC_WAITLIST_API", "");
    const { container } = render(<WaitlistForm />);
    expect(container).toBeEmptyDOMElement();
  });

  it("поле названия растения и кнопка «Дальше →»", () => {
    render(<WaitlistForm />);
    expect(screen.getByLabelText(step1.label)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: step1.submit }),
    ).toBeInTheDocument();
  });

  it("поле не растягивает ячейку грида: тянется по ширине колонки", () => {
    render(<WaitlistForm />);
    const input = screen.getByLabelText(step1.label);
    expect(input).toHaveClass("w-full");
    // min-w-0 — то, что не даёт полю распереть колонку auto-fill грида
    expect(input.closest("form")).toHaveClass("min-w-0");
  });

  it("ввод обрезается до 42 знаков", async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    const long = "калатея".repeat(10);

    await user.type(screen.getByLabelText(step1.label), long);
    await user.click(screen.getByRole("button", { name: step1.submit }));

    expect(screen.getByText(long.slice(0, 42))).toBeInTheDocument();
    expect(screen.queryByText(long)).toBeNull();
  });
});

describe("WaitlistForm — шаг 1 ведёт в попап (task 2.1)", () => {
  it("название + «Дальше →» открывают попап с этим названием", async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);

    expect(screen.queryByRole("dialog")).toBeNull();
    await user.type(screen.getByLabelText(step1.label), "фикус Бенджамина");
    await user.click(screen.getByRole("button", { name: step1.submit }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("фикус Бенджамина")).toBeInTheDocument();
    expect(screen.getByText(modal.question)).toBeInTheDocument();
  });

  it("пустое поле: попап не открывается, фокус остаётся на поле", async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);

    await user.click(screen.getByRole("button", { name: step1.submit }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(screen.getByLabelText(step1.label));
  });

  it("растение пишется до почты — POST /plant на шаге 1 (контракт FIX-73)", async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);

    await user.type(screen.getByLabelText(step1.label), "калатея");
    await user.click(screen.getByRole("button", { name: step1.submit }));

    const fetchMock = vi.mocked(globalThis.fetch);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toBe("/api/waitlist/plant");
  });
});

describe("WaitlistForm — цели Метрики (task 2.3)", () => {
  it("шаг 1 шлёт waitlist_plant_input{plant} и waitlist_form_open — и только их", async () => {
    vi.stubEnv("NEXT_PUBLIC_METRIKA_ID", "12345");
    const ym = vi.fn();
    vi.stubGlobal("ym", ym);
    const user = userEvent.setup();
    render(<WaitlistForm />);

    await user.type(screen.getByLabelText(step1.label), "калатея");
    await user.click(screen.getByRole("button", { name: step1.submit }));

    expect(ym.mock.calls.map((call) => call[2])).toEqual([
      "waitlist_plant_input",
      "waitlist_form_open",
    ]);
    expect(ym).toHaveBeenCalledWith(
      12345,
      "reachGoal",
      "waitlist_plant_input",
      {
        plant: "калатея",
      },
    );
  });

  it("пустой ввод целей не шлёт", async () => {
    vi.stubEnv("NEXT_PUBLIC_METRIKA_ID", "12345");
    const ym = vi.fn();
    vi.stubGlobal("ym", ym);
    const user = userEvent.setup();
    render(<WaitlistForm />);

    await user.click(screen.getByRole("button", { name: step1.submit }));

    expect(ym).not.toHaveBeenCalled();
  });
});

/*
 * NEW-01: в прототипе широкий селектор `.coll a` (карточка SKU) протекал на
 * служебные ссылки формы N°08 и разрывал текст чекбокса. В Tailwind стили
 * лежат на самих элементах — регрессия возможна только если кто-то добавит
 * в globals.css правило «все ссылки внутри галереи».
 */
describe("Стили плитки не протекают в форму (task 2.2)", () => {
  it("globals.css не стилизует ссылки потомками секции галереи", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    expect(css).not.toMatch(/#collectio[^{]*\ba\b[^{]*\{/);
  });
});
