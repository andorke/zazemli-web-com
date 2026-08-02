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
  | "sku-open"
  | "diary_signup_submit"
  /* лист ожидания N°08 — ровно четыре цели воронки (PATCH-1 §3.4, FIX-74) */
  | "waitlist_plant_input"
  | "waitlist_form_open"
  | "waitlist_submit"
  | "waitlist_error";

/* params — свойства цели (waitlist_plant_input несёт plant: какие растения просят) */
export function reachGoal(
  goal: MetrikaGoal,
  params?: Record<string, unknown>,
): void {
  const id = process.env.NEXT_PUBLIC_METRIKA_ID;
  if (typeof window === "undefined" || !window.ym || !id) return;
  if (params) window.ym(Number(id), "reachGoal", goal, params);
  else window.ym(Number(id), "reachGoal", goal);
}
