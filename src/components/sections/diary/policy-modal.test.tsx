import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PolicyModal } from "@/components/sections/diary/policy-modal";
import { diary } from "@/content/diary";

/*
 * Попап-резюме политики «Коротко о данных» (task 2.4). Короткое резюме данных +
 * ссылка на полную политику /privacy; закрывается по Esc, клику по фону, крестику.
 * Копи проверяем из diary.policyModal.
 */
describe("PolicyModal (task 2.4)", () => {
  it("закрыт (open=false) → ничего не рендерит", () => {
    render(<PolicyModal open={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("открыт → заголовок, все пункты и ссылка на полную политику /privacy", () => {
    render(<PolicyModal open onClose={() => {}} />);
    const dialog = screen.getByRole("dialog", {
      name: diary.policyModal.title,
    });
    expect(dialog).toBeInTheDocument();
    diary.policyModal.points.forEach((point) =>
      expect(screen.getByText(point)).toBeInTheDocument(),
    );
    const full = screen.getByRole("link", {
      name: diary.policyModal.fullLink.label,
    });
    expect(full).toHaveAttribute("href", diary.policyModal.fullLink.href);
  });

  it("при открытии фокус уходит на крестик", () => {
    render(<PolicyModal open onClose={() => {}} />);
    expect(screen.getByRole("button", { name: "Закрыть" })).toHaveFocus();
  });

  it("Esc → onClose", async () => {
    const onClose = vi.fn();
    render(<PolicyModal open onClose={onClose} />);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("клик по крестику → onClose", async () => {
    const onClose = vi.fn();
    render(<PolicyModal open onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("клик по фону (overlay) → onClose", () => {
    const onClose = vi.fn();
    render(<PolicyModal open onClose={onClose} />);
    // клик именно по подложке: target === сам overlay-контейнер
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("клик по содержимому окна → onClose НЕ вызывается", async () => {
    const onClose = vi.fn();
    render(<PolicyModal open onClose={onClose} />);
    await userEvent.click(screen.getByText(diary.policyModal.title));
    expect(onClose).not.toHaveBeenCalled();
  });
});
