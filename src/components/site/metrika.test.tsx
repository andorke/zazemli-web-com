import { act, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { setConsent } from "@/lib/consent";
import { updateMetrika } from "@/lib/metrika";
import { Metrika } from "./metrika";

vi.mock("next/navigation", () => ({ usePathname: () => "/lab" }));
vi.mock("@/lib/metrika", () => ({ updateMetrika: vi.fn() }));

afterEach(() => { localStorage.clear(); vi.clearAllMocks(); });

it("пересчитывает счётчик после выбора и отзыва в соседней вкладке", () => {
  render(<Metrika />);
  expect(updateMetrika).toHaveBeenCalledWith("/lab");
  act(() => setConsent("all"));
  expect(updateMetrika).toHaveBeenCalledTimes(2);
  act(() => {
    localStorage.setItem("zazemli-consent", "necessary");
    window.dispatchEvent(new StorageEvent("storage", { key: "zazemli-consent" }));
  });
  expect(updateMetrika).toHaveBeenCalledTimes(3);
});
