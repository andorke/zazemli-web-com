/*
 * Согласие на необязательные cookie (152-ФЗ, бриф §8).
 * По умолчанию — не задано; Метрика грузится только при «all».
 */

import { useSyncExternalStore } from "react";

export const CONSENT_KEY = "zazemli-consent";
export const CONSENT_EVENT = "zazemli-consent";

export type Consent = "necessary" | "all";

/* Значения ключа до legal-fixes. Читаем их как новые, но не переписываем:
   маппинг при чтении вместо миграции записи (design.md, решение 3). */
const LEGACY: Record<string, Consent> = {
  granted: "all",
  denied: "necessary",
};

export function getConsent(): Consent | null {
  if (typeof localStorage === "undefined") return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === "necessary" || value === "all") return value;
  return value !== null ? (LEGACY[value] ?? null) : null;
}

export function setConsent(value: Consent): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_EVENT, onChange);
}

/* Реактивное чтение согласия. Внешнее хранилище = localStorage + CONSENT_EVENT.
   На сервере (static export) — всегда null: баннер/Метрика появляются после гидрации. */
export function useConsent(): Consent | null {
  return useSyncExternalStore(subscribe, getConsent, () => null);
}
