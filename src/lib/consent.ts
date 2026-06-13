/*
 * Согласие на необязательные cookie (152-ФЗ, бриф §8).
 * По умолчанию — не задано; Метрика грузится только при «granted».
 */

import { useSyncExternalStore } from "react";

export const CONSENT_KEY = "zazemli-consent";
export const CONSENT_EVENT = "zazemli-consent";

export type Consent = "granted" | "denied";

export function getConsent(): Consent | null {
  if (typeof localStorage === "undefined") return null;
  const value = localStorage.getItem(CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : null;
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
