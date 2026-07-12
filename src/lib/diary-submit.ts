/*
 * Интеграционная точка submit формы /diary-signup (design Decision 4, task 3.2).
 * Обёртка POST на РФ-эндпоинт из NEXT_PUBLIC_DIARY_SUBMIT_ENDPOINT. Эндпоинт по
 * умолчанию не задан → сбор выключен: реального POST с ПДн нет, форма получает
 * ok и показывает confirmation (валидна, но данные не уходят). Реальный сбор
 * деплоится после юр-обвязки — РФ-хостинг/БД + уведомление РКН (PDN-SPEC §4).
 * Payload несёт версию формулировки согласия, чтобы бэкенд зафиксировал её в
 * логе согласия (email + дата + IP + версия, хранение ≥3 года, PDN-SPEC §1.3).
 */

/* Состояния ошибки отправки — микрокопи diary.states (error-message.md v1.0.1). */
export type SubmitErrorState =
  | "network"
  | "server"
  | "maintenance"
  | "duplicate";
export type SubmitResult =
  | { ok: true }
  | { ok: false; state: SubmitErrorState };

export type DiarySubmitInput = {
  email: string;
  consents: { pdn: boolean; ads: boolean };
};

/*
 * Версия формулировки согласия — идентификатор редакции юр-текста чекбоксов
 * (diary.ts, синк с diary-signup.md v2.2 / PDN-152FZ-SPEC §1.2). Бэкенд хранит
 * её в логе согласия, чтобы знать, на какую редакцию текста подписался человек.
 * При правке текстов согласий — поднять версию здесь и в канонах.
 */
export const CONSENT_VERSION = "2.2";

export async function submitDiarySignup(
  input: DiarySubmitInput,
): Promise<SubmitResult> {
  const endpoint = process.env.NEXT_PUBLIC_DIARY_SUBMIT_ENDPOINT;
  // сбор выключен (нет РФ-эндпоинта) → реального POST с ПДн нет (design Decision 4)
  if (!endpoint) return { ok: true };

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, consentVersion: CONSENT_VERSION }),
    });
  } catch {
    // запрос не дошёл — сеть недоступна
    return { ok: false, state: "network" };
  }

  if (res.ok) return { ok: true };
  if (res.status === 409) return { ok: false, state: "duplicate" };
  if (res.status === 503) return { ok: false, state: "maintenance" };
  return { ok: false, state: "server" };
}
