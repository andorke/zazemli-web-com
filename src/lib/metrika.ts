import { getConsent } from "./consent";

type Counter = {
  destruct: () => void;
  hit: (url: string) => void;
  reachGoal: (goal: string, params?: Record<string, string>) => void;
};

declare global {
  interface Window {
    Ya?: {
      Metrika2: new (options: {
        id: number;
        defer: true;
        clickmap: false;
        trackLinks: false;
        accurateTrackBounce: true;
        webvisor: false;
      }) => Counter;
    };
  }
}

export type MetrikaGoal =
  | "plant_select"
  | "format_select"
  | "offer_select"
  | "ozon-click"
  | "lab-to-collectio"
  | "guide-to-collectio"
  | "sku-open"
  | "diary_signup_submit"
  | "diary_signup_error"
  | "waitlist_plant_input"
  | "waitlist_form_open"
  | "waitlist_submit"
  | "waitlist_error";

const hosts = new Set(["zazemli.com", "www.zazemli.com"]);
const paramPatterns: Record<string, RegExp> = {
  plant_slug: /^(monstera|ficus|anthurium|aglaonema|spathiphyllum|zamioculcas|epipremnum)$/,
  format: /^(box|soil)$/,
  offer_id: /^[a-z0-9_-]{1,50}$/i,
  source: /^(catalog|lab|guide|waitlist|navigation)$/,
  reason: /^(network_error|server_error|email_unconfigured)$/,
};
let active: Counter | undefined;
let tag: HTMLScriptElement | undefined;
let lastHit = "";

function allowedId() {
  const id = process.env.NEXT_PUBLIC_METRIKA_ID;
  if (typeof window === "undefined" || !hosts.has(location.hostname) || getConsent() !== "all") return undefined;
  if (!id || !/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) return undefined;
  return Number(id);
}

function pageUrl() {
  const url = new URL(location.href);
  const params = new URLSearchParams();
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = url.searchParams.get(key);
    if (value && value.length <= 120 && !/@|https?:/i.test(value)) params.set(key, value);
  }
  url.search = params.toString();
  url.hash = "";
  return url.href;
}

export function updateMetrika(path: string) {
  const id = allowedId();
  if (!id) {
    active?.destruct();
    active = undefined;
    return;
  }
  if (!active && window.Ya?.Metrika2) {
    active = new window.Ya.Metrika2({ id, defer: true, clickmap: false, trackLinks: false, accurateTrackBounce: true, webvisor: false });
  }
  if (!active && !tag) {
    tag = document.createElement("script");
    tag.src = "https://mc.yandex.ru/metrika/tag.js";
    tag.async = true;
    tag.onload = () => updateMetrika(location.pathname);
    tag.onerror = () => { tag?.remove(); tag = undefined; };
    document.head.append(tag);
  }
  // Смена query/вкладки каталога — цель, а не новый просмотр.
  if (active && lastHit !== path) {
    lastHit = path;
    active.hit(pageUrl());
  }
}

export function reachGoal(goal: MetrikaGoal, params?: Record<string, unknown>) {
  if (!active || !allowedId()) return;
  const payload = Object.fromEntries(Object.entries(params ?? {}).filter(([key, value]) =>
    typeof value === "string" && paramPatterns[key]?.test(value),
  )) as Record<string, string>;
  if (Object.keys(payload).length) active.reachGoal(goal, payload);
  else active.reachGoal(goal);
}
