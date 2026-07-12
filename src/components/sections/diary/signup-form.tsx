"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { PolicyModal } from "@/components/sections/diary/policy-modal";
import { Button } from "@/components/ui/button";
import { Fleuron } from "@/components/ui/fleuron";
import { diary, type DiaryConsent } from "@/content/diary";
import { reachGoal } from "@/lib/metrika";

/* Формат email — тот же паттерн, что в прототипе diary-signup.html v3 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
 * Состояния submit — микрокопи из diary.states (network/server/maintenance/
 * duplicate, error-message.md v1.0.1). Реальную обёртку POST на РФ-эндпоинт
 * (флаг/null, payload с версией согласия) подключит task 3.2 через onSubmit.
 */
export type SubmitErrorState =
  | "network"
  | "server"
  | "maintenance"
  | "duplicate";
export type SubmitResult =
  | { ok: true }
  | { ok: false; state: SubmitErrorState };

/*
 * Заглушка отправки по умолчанию: сбор выключен (нет РФ-бэкенда) → успех →
 * confirmation (design Decision 4 — до готовности бэкенда форма валидна и
 * показывает confirmation, реального POST с ПДн нет). task 3.2 подменит.
 */
async function noopSubmit(): Promise<SubmitResult> {
  return { ok: true };
}

/*
 * Текст согласия. У CB со ссылкой (link != null) встроенная ссылка на политику по
 * подстроке link.label: href=/privacy (запасной вариант без JS), но клик открывает
 * попап-резюме, не уводя со страницы. stopPropagation — чтобы клик по ссылке не
 * всплыл к label и не отметил согласие (согласие — осознанное действие). (task 2.4)
 */
function ConsentText({
  consent,
  onPolicyClick,
}: {
  consent: DiaryConsent;
  onPolicyClick: () => void;
}) {
  if (!consent.link) return <>{consent.text}</>;
  const { label, href } = consent.link;
  const [before, after] = consent.text.split(label);
  return (
    <>
      {before}
      <Link
        href={href}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onPolicyClick();
        }}
        className="text-moss-ink underline underline-offset-2"
      >
        {label}
      </Link>
      {after}
    </>
  );
}

/*
 * Форма подписки /diary-signup. Клиентский компонент: валидация email по формату
 * (aria-invalid, ok/err-микрокопи), два непредзаполненных согласия (CB1 — 152-ФЗ,
 * CB2 — 38-ФЗ), submit собирает ошибки и уводит фокус на первую (task 2.2).
 * Успешная отправка подменяет форму confirmation-блоком, ошибка отправки
 * показывает микрокопи из diary.states (task 2.3). Стек — чистый React, как
 * cookie-banner (тоже consent-UI 152-ФЗ). Копи — из diary.ts.
 *
 * onSubmit — интеграционная точка отправки (design Decision 4): по умолчанию
 * заглушка-успех; task 3.2 передаст обёртку POST с флагом/null-эндпоинтом.
 * Вне скоупа: встроенная ссылка CB1 → /privacy и попап-резюме — task 2.4.
 */
export function SignupForm({
  onSubmit = noopSubmit,
}: {
  onSubmit?: () => Promise<SubmitResult>;
}) {
  const { form, states, confirmation } = diary;
  const [pdnConsent, adsConsent] = form.consents;

  const [email, setEmail] = useState("");
  // null — поле ещё не проверяли (нейтрально, ни ok, ни err)
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [pdn, setPdn] = useState(false);
  const [ads, setAds] = useState(false);
  const [consentError, setConsentError] = useState(false);
  // "idle" — форма; "sent" — форма подменена confirmation-блоком
  const [phase, setPhase] = useState<"idle" | "sent">("idle");
  const [submitError, setSubmitError] = useState<SubmitErrorState | null>(null);
  // попап-резюме политики (открывается ссылкой в CB1) — task 2.4
  const [policyOpen, setPolicyOpen] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const pdnRef = useRef<HTMLInputElement>(null);
  const adsRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  // подмена формы confirmation → переносим фокус на блок (a11y, как в прототипе)
  useEffect(() => {
    if (phase === "sent") confirmRef.current?.focus();
  }, [phase]);

  function validateOnBlur() {
    if (email.trim() === "") {
      setEmailValid(null);
      return;
    }
    setEmailValid(EMAIL_RE.test(email.trim()));
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    // живое исправление: снимаем ошибку, как только адрес стал валидным
    if (emailValid === false && EMAIL_RE.test(value.trim()))
      setEmailValid(true);
  }

  function toggleConsent(which: "pdn" | "ads", checked: boolean) {
    const nextPdn = which === "pdn" ? checked : pdn;
    const nextAds = which === "ads" ? checked : ads;
    if (which === "pdn") setPdn(checked);
    else setAds(checked);
    if (nextPdn && nextAds) setConsentError(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const okEmail = EMAIL_RE.test(email.trim());
    const okConsent = pdn && ads;
    setEmailValid(okEmail);
    setConsentError(!okConsent);

    let firstError: HTMLInputElement | null = null;
    if (!okEmail) firstError = emailRef.current;
    if (!okConsent && !firstError)
      firstError = pdn ? adsRef.current : pdnRef.current;

    if (firstError) {
      firstError.focus();
      return;
    }

    // всё валидно → отправка через интеграционную точку (task 3.2)
    setSubmitError(null);
    const result = await onSubmit();
    if (result.ok) {
      // consent-gate — в самом reachGoal: ym есть только при granted (task 3.1)
      reachGoal("diary_signup_submit");
      setPhase("sent");
    } else setSubmitError(result.state);
  }

  if (phase === "sent") {
    return (
      <div
        id="signup"
        ref={confirmRef}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        className="border-charcoal/15 bg-bone mt-10 border p-6 outline-none lg:p-8"
      >
        <Fleuron className="text-xl" />
        <h2 className="text-charcoal mt-2 font-serif text-2xl font-light">
          {confirmation.title}
        </h2>
        {confirmation.body.map((line) => (
          <p
            key={line}
            className="text-charcoal/70 leading-body mt-2 max-w-md text-base"
          >
            {line}
          </p>
        ))}
        <p className="text-charcoal/50 mt-4 font-serif text-sm italic">
          {confirmation.signature}
        </p>
      </div>
    );
  }

  return (
    <form
      id="signup"
      noValidate
      onSubmit={handleSubmit}
      className="border-charcoal/15 bg-bone mt-10 flex flex-col gap-5 border p-6 lg:p-8"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-charcoal text-sm font-medium">
          {form.label}
        </label>
        <input
          ref={emailRef}
          type="email"
          id="email"
          name="email"
          placeholder={form.placeholder}
          value={email}
          onChange={(event) => handleEmailChange(event.target.value)}
          onBlur={validateOnBlur}
          autoComplete="email"
          inputMode="email"
          autoCapitalize="off"
          autoCorrect="off"
          aria-invalid={
            emailValid === false
              ? true
              : emailValid === true
                ? false
                : undefined
          }
          aria-describedby="emailMsg"
          className="border-charcoal/25 focus-visible:border-moss focus-visible:ring-moss/30 text-charcoal placeholder:text-charcoal/40 aria-invalid:border-destructive rounded-sm border bg-transparent px-3 py-2 text-base outline-none focus-visible:ring-3"
        />
        {emailValid === true && (
          <p className="text-moss-ink text-sm">{form.emailOk}</p>
        )}
        {emailValid === false && (
          <p id="emailMsg" role="alert" className="text-destructive text-sm">
            {states.validation}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-charcoal/80 leading-body flex gap-3 text-sm">
          <input
            ref={pdnRef}
            type="checkbox"
            name={pdnConsent.name}
            checked={pdn}
            onChange={(event) => toggleConsent("pdn", event.target.checked)}
            className="accent-moss mt-0.5 size-4 shrink-0"
          />
          <span>
            <ConsentText
              consent={pdnConsent}
              onPolicyClick={() => setPolicyOpen(true)}
            />
          </span>
        </label>
        <label className="text-charcoal/80 leading-body flex gap-3 text-sm">
          <input
            ref={adsRef}
            type="checkbox"
            name={adsConsent.name}
            checked={ads}
            onChange={(event) => toggleConsent("ads", event.target.checked)}
            className="accent-moss mt-0.5 size-4 shrink-0"
          />
          <span>{adsConsent.text}</span>
        </label>
        {consentError && (
          <p role="alert" className="text-destructive text-sm">
            {form.consentError}
          </p>
        )}
      </div>

      {submitError && (
        <p role="alert" className="text-destructive text-sm">
          {states[submitError]}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full">
        {form.submit}
      </Button>
      <p className="text-charcoal/60 text-xs">{form.trust}</p>
      <p className="text-charcoal/60 text-xs">{form.caveat}</p>

      <PolicyModal open={policyOpen} onClose={() => setPolicyOpen(false)} />
    </form>
  );
}
