"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { waitlist, type WaitlistConsent } from "@/content/waitlist";
import { reachGoal } from "@/lib/metrika";

/* Формат email — тот же паттерн, что в прототипе landing.html (#reqStep2) */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type WaitlistEmailSubmit = {
  email: string;
  consent_ads: boolean;
  consent_pdn: boolean;
};

/*
 * Текст согласия со встроенной ссылкой на политику. Ссылка получает
 * собственные inline-классы: карточные стили галереи в форму не протекают
 * (NEW-01 — в прототипе широкий селектор `.coll a` разрывал текст чекбокса).
 */
function ConsentText({ consent }: { consent: WaitlistConsent }) {
  if (!consent.link) return <>{consent.text}</>;
  const { label, href } = consent.link;
  const [before, after] = consent.text.split(label);
  return (
    <>
      {before}
      <Link
        href={href}
        onClick={(event) => event.stopPropagation()}
        className="text-moss-ink inline underline underline-offset-2"
      >
        {label}
      </Link>
      {after}
    </>
  );
}

/*
 * Шаг 2 листа ожидания N°08 — попап на нативном <dialog> + showModal()
 * (PATCH-1 §3.1, разметка-эталон #waitModal). role="dialog" и фокус-ловушка
 * у showModal() нативные; здесь добираем клик по фону, возврат фокуса на
 * инициатор и крестик 44×44. Esc закрывает нативно — приходит событием close.
 *
 * plant — введённое название как есть (null = попап закрыт). Название НЕ
 * склоняется и в тексты не подставляется: выводится отдельной строкой (NEW-05).
 */
export function WaitlistModal({
  plant,
  onClose,
  onSubmit,
}: {
  plant: string | null;
  onClose: () => void;
  onSubmit: (input: WaitlistEmailSubmit) => void | Promise<void>;
}) {
  const { modal, states, done } = waitlist;
  const [lead, pdn] = modal.consents;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const leadRef = useRef<HTMLInputElement>(null);
  const pdnRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const [email, setEmail] = useState("");
  const [ads, setAds] = useState(false);
  const [pdnChecked, setPdnChecked] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [sent, setSent] = useState(false);

  const open = plant !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      // инициатор — кнопка «Дальше →» в плитке; на неё вернём фокус при закрытии
      triggerRef.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      emailRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  /* закрытие любым путём (Esc, крестик, фон) — сброс состояния и возврат фокуса */
  function handleDialogClose() {
    setEmail("");
    setAds(false);
    setPdnChecked(false);
    setEmailError(false);
    setConsentError(false);
    setSent(false);
    triggerRef.current?.focus();
    onClose();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const okEmail = EMAIL_RE.test(email.trim());
    const okConsent = ads && pdnChecked;
    setEmailError(!okEmail);
    setConsentError(!okConsent);

    if (!okEmail || !okConsent) {
      reachGoal("waitlist_error");
      // фокус — на первое поле с ошибкой сверху вниз (NEW-06)
      const first = !okEmail
        ? emailRef.current
        : !ads
          ? leadRef.current
          : pdnRef.current;
      first?.focus();
      return;
    }

    void onSubmit({
      email: email.trim(),
      consent_ads: ads,
      consent_pdn: pdnChecked,
    });
    reachGoal("waitlist_submit", { plant });
    setSent(true);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby="waitlistQuestion"
      onClose={handleDialogClose}
      onClick={(event) => {
        // клик мимо окна: цель — сам <dialog> (окно внутри перехватывает свои клики)
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="bg-charcoal/45 text-charcoal m-0 h-full max-h-none w-full max-w-none items-center justify-center p-5 backdrop:hidden open:flex"
    >
      {open && (
        <div className="border-charcoal/50 bg-bone relative max-h-[88vh] w-full max-w-[34rem] overflow-auto border p-6 lg:p-9">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={modal.close}
            className="text-charcoal/70 absolute top-1.5 right-1.5 flex size-11 items-center justify-center text-2xl leading-none"
          >
            ×
          </button>

          <p className="tracking-eyebrow font-ui text-eyebrow text-moss-ink mb-4 font-medium uppercase">
            {modal.kicker}
          </p>
          <p className="text-moss-ink font-voice mr-10 text-[clamp(1.5rem,2.8vw,1.95rem)] leading-tight font-light [overflow-wrap:anywhere]">
            {plant}
          </p>
          <hr className="border-charcoal/15 my-4" />

          {sent ? (
            <div
              role="status"
              aria-live="polite"
              className="font-voice text-lg"
            >
              <p>{done.title}</p>
              <p className="mt-1">{done.body}</p>
              <p className="text-charcoal/50 mt-3 text-[13px] italic">
                {done.signature}
              </p>
            </div>
          ) : (
            <>
              <p
                id="waitlistQuestion"
                className="font-voice mr-6 max-w-[24ch] text-[clamp(1.32rem,2.4vw,1.66rem)] leading-tight font-light"
              >
                {modal.question}
              </p>
              <p className="text-charcoal/60 mt-2 text-[15px] leading-normal">
                {modal.sub}
              </p>

              <form noValidate onSubmit={handleSubmit} className="mt-5">
                <label
                  htmlFor="waitlistEmail"
                  className="text-charcoal/60 mb-1.5 block text-[13px]"
                >
                  {modal.emailLabel}
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  id="waitlistEmail"
                  name="email"
                  value={email}
                  placeholder={modal.emailPlaceholder}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (emailError) setEmailError(false);
                  }}
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="off"
                  autoCorrect="off"
                  aria-invalid={emailError || undefined}
                  aria-describedby={emailError ? "waitlistEmailMsg" : undefined}
                  className="border-charcoal/25 focus-visible:border-moss-ink focus-visible:ring-moss-ink text-charcoal placeholder:text-charcoal/40 aria-invalid:border-destructive font-ui min-h-12 w-full border bg-transparent px-3.5 py-3 text-base outline-none focus-visible:ring-1"
                />
                {emailError && (
                  <p
                    id="waitlistEmailMsg"
                    role="alert"
                    className="text-destructive mt-1.5 text-[13px]"
                  >
                    {states.email}
                  </p>
                )}

                <div className="mt-4 flex flex-col gap-3">
                  <label className="text-charcoal grid min-h-11 cursor-pointer grid-cols-[20px_1fr] items-start gap-2.5 text-[15px] leading-normal">
                    <input
                      ref={leadRef}
                      type="checkbox"
                      name={lead.name}
                      checked={ads}
                      onChange={(event) => {
                        setAds(event.target.checked);
                        if (consentError) setConsentError(false);
                      }}
                      className="accent-moss mt-0.5 size-5"
                    />
                    <span>
                      <ConsentText consent={lead} />
                    </span>
                  </label>
                  <label className="text-charcoal/70 grid min-h-11 cursor-pointer grid-cols-[20px_1fr] items-start gap-2.5 text-[13px] leading-normal">
                    <input
                      ref={pdnRef}
                      type="checkbox"
                      name={pdn.name}
                      checked={pdnChecked}
                      onChange={(event) => {
                        setPdnChecked(event.target.checked);
                        if (consentError) setConsentError(false);
                      }}
                      className="accent-moss mt-0.5 size-5"
                    />
                    <span>
                      <ConsentText consent={pdn} />
                    </span>
                  </label>
                  {consentError && (
                    <p role="alert" className="text-destructive text-[13px]">
                      {states.consent}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="border-moss bg-moss text-bone font-ui mt-5 min-h-12 w-full border px-5 py-3 text-[15px] font-medium"
                >
                  {modal.submit}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </dialog>
  );
}
