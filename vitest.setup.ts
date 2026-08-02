import "@testing-library/jest-dom/vitest";

/*
 * jsdom 29 не реализует HTMLDialogElement.showModal/close — минимальный полифил,
 * чтобы unit-тесты могли открыть нативный <dialog>. Esc и фокус-ловушка, которые
 * showModal() даёт нативно в браузере, в jsdom не воспроизводятся: они
 * проверяются e2e в реальном Chromium (e2e/waitlist.spec.ts).
 */
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(
    this: HTMLDialogElement,
  ) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
}
