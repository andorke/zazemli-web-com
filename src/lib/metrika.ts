/*
 * Цели Яндекс.Метрики — 7 точек воронки (бриф §8, ARCHITECTURE.md §4).
 * reachGoal — безопасный no-op без счётчика или без ID (до согласия ym не загружен).
 */

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

export type MetrikaGoal =
  | "ozon-click"
  | "lab-to-collectio"
  | "guide-to-collectio"
  | "sku-open";

export function reachGoal(goal: MetrikaGoal): void {
  const id = process.env.NEXT_PUBLIC_METRIKA_ID;
  if (typeof window === "undefined" || !window.ym || !id) return;
  window.ym(Number(id), "reachGoal", goal);
}
