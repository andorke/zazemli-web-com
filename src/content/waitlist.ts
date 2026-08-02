/*
 * Контент формы N°08 «Лист ожидания». Источник — прототип
 * ../zazemli-vault/Айти/Сайт/prototypes/landing.html, блок #waitModal
 * (редакция согласий 2026-07-14, PATCH-1 §3).
 *
 * Юр-конструкция (NEW-07, P0): это НЕ рассылка. Сайт обещает ровно одно письмо —
 * уведомление о появлении грунта под конкретное растение. Конструкция рекламной
 * рассылки с отпиской осталась только на /diary-signup (отдельная база, своё
 * согласие). Правка текстов согласий = смена юр-конструкции: поднять
 * CONSENT_VERSION в lib/waitlist-submit.ts и синкнуть канон.
 *
 * NEW-05: название растения не склоняется — тексты построены без падежных
 * конструкций («землю под это растение»), подстановки имени в них нет.
 * NEW-06: ведущее согласие (про письмо) идёт первым, ПДн — вторым; порядок
 * массива consents = визуальный порядок.
 *
 * Тексты плитки N°08 (номер, вопрос, приписка) живут в home.skuGallery.invite —
 * это контент галереи, здесь только форма.
 */

export type WaitlistConsent = {
  /* имя поля = идентификатор согласия в логе согласий (контракт §3.4) */
  name: "consent_ads" | "consent_pdn";
  /* текст согласия дословно; при link != null содержит link.label подстрокой */
  text: string;
  link: { label: string; href: string } | null;
};

export type WaitlistContent = {
  step1: { label: string; placeholder: string; submit: string };
  modal: {
    kicker: string;
    question: string;
    sub: string;
    emailLabel: string;
    emailPlaceholder: string;
    consents: WaitlistConsent[];
    submit: string;
    close: string;
  };
  states: { email: string; consent: string };
  done: { title: string; body: string; signature: string };
};

export const waitlist: WaitlistContent = {
  step1: {
    label: "Растение",
    placeholder: "например, калатея",
    submit: "Дальше →",
  },
  modal: {
    kicker: "N° 08 · Лист ожидания",
    question: "Прислать письмо, когда соберём землю под это растение?",
    sub: "Одно письмо — когда грунт появится. Ни рассылки, ни новостей.",
    emailLabel: "Твоя почта",
    emailPlaceholder: "name@example.com",
    consents: [
      {
        name: "consent_ads",
        text: "Хочу получить письмо, когда появится грунт под моё растение. Это единственное письмо — больше мы ничего не пришлём.",
        link: null,
      },
      {
        name: "consent_pdn",
        // имя оператора — неразрывными пробелами, как в прототипе (&nbsp;)
        text: "Даю согласие на обработку персональных данных (почта, название растения) ИП\u00A0Минетто\u00A0А.\u00A0А. на условиях политики конфиденциальности.",
        link: { label: "политики конфиденциальности", href: "/privacy" },
      },
    ],
    submit: "Записать меня →",
    close: "Закрыть",
  },
  states: {
    email: "Похоже, ошибка в адресе. Проверь — лучше дважды.",
    consent: "Чтобы записаться, отметь оба согласия.",
  },
  done: {
    title: "Записали.",
    body: "Напишем, когда соберём землю под это растение.",
    signature: "— ЗАЗЕМЛИ",
  },
};
