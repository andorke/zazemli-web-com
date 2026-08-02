/*
 * Контракт API листа ожидания N°08 (PATCH-1 §3.4, FIX-73) и утилиты ввода.
 *
 * Два шага пишутся раздельно: растение фиксируется СРАЗУ, до почты, — если
 * человек уйдёт на шаге 2, запрос всё равно остаётся в счётчике спроса. Это
 * единственный источник данных о том, какие растения собирать в следующей партии.
 */

/* Предел длины названия растения: длиннее — разъезжает модалку (NEW-05) */
export const PLANT_MAX_LENGTH = 42;

export function trimPlant(value: string): string {
  return value.trim().slice(0, PLANT_MAX_LENGTH);
}

/*
 * Версия редакции текстов согласий (PATCH-1 §3.4). Бэкенд пишет её в лог
 * согласий (хранение ≥ 3 лет — условие законности сбора), чтобы знать, на
 * какую редакцию юр-текста подписался человек. Правка текстов согласий в
 * content/waitlist.ts — поднять версию здесь и синкнуть канон.
 */
export const CONSENT_VERSION = "2026-07-14";

/* Шаг 1: POST /api/waitlist/plant {plant, ts} → {requestId} */
export type WaitlistPlantRequest = { plant: string; ts: string };

/*
 * Шаг 2: POST /api/waitlist/email → лог согласий + Sendsay «Лист ожидания».
 * Поле ip контракта заполняет сервер из запроса — клиент своего IP не знает.
 * Имена consent_pdn / consent_ads — из канона (историческое); семантика
 * consent_ads здесь — согласие на одно письмо, не на рекламу (NEW-07).
 */
export type WaitlistEmailRequest = {
  requestId: string | null;
  email: string;
  consent_pdn: boolean;
  consent_ads: boolean;
  consent_version: typeof CONSENT_VERSION;
  ts: string;
};

export type WaitlistEmailInput = Omit<
  WaitlistEmailRequest,
  "consent_version" | "ts"
>;

/*
 * Фича-флаг интеграции (design Decision 3, образец — lib/diary-submit.ts):
 * базовый URL API листа ожидания. Пустой по умолчанию → сбор выключен целиком,
 * форма в плитке N°08 не рендерится. Включать только вместе с живым
 * /api/waitlist/* : сбор email без серверного лога согласий со сроком хранения
 * ≥ 3 лет юридически незащищён (PATCH-1 §3.4).
 */
export function isWaitlistApiEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_WAITLIST_API);
}

/*
 * Шаг 1. Растение — не ПДн, согласий не требует, поэтому пишется сразу и не
 * блокирует попап: сбой сети просто оставляет requestId пустым (шаг 2 уйдёт
 * без него, сервер свяжет запись по почте). Ошибки отправки на UI не выводим —
 * состояния ошибок бэкенда проектируются вместе с ним, в change waitlist-api.
 */
export async function submitWaitlistPlant(
  plant: string,
): Promise<string | null> {
  const api = process.env.NEXT_PUBLIC_WAITLIST_API;
  if (!api) return null;

  try {
    const res = await fetch(`${api}/plant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plant,
        ts: new Date().toISOString(),
      } satisfies WaitlistPlantRequest),
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    const requestId = (data as { requestId?: unknown } | null)?.requestId;
    return typeof requestId === "string" ? requestId : null;
  } catch {
    return null;
  }
}

/* Шаг 2. Почта и согласия дописываются к записи шага 1 по requestId. */
export async function submitWaitlistEmail(
  input: WaitlistEmailInput,
): Promise<void> {
  const api = process.env.NEXT_PUBLIC_WAITLIST_API;
  if (!api) return;

  try {
    await fetch(`${api}/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        consent_version: CONSENT_VERSION,
        ts: new Date().toISOString(),
      } satisfies WaitlistEmailRequest),
    });
  } catch {
    // сбой отправки на UI не выводим — см. комментарий к submitWaitlistPlant
  }
}
