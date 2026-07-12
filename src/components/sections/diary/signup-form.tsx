"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { diary } from "@/content/diary";

/* Формат email — тот же паттерн, что в прототипе diary-signup.html v3 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
 * Форма подписки /diary-signup (task 2.2). Клиентский компонент: валидация email
 * по формату (aria-invalid, ok/err-микрокопи), два непредзаполненных согласия
 * (CB1 — 152-ФЗ, CB2 — 38-ФЗ), submit собирает ошибки и уводит фокус на первую.
 * Стек — чистый React, как cookie-banner (тоже consent-UI 152-ФЗ): форма из
 * одного email и двух чекбоксов, отдельный form-стек избыточен. Копи — из diary.ts.
 *
 * Вне скоупа 2.2: happy-path (отправка + confirmation) и микрокопи ошибок
 * отправки — task 2.3; встроенная ссылка CB1 → /privacy и попап-резюме — task 2.4.
 */
export function SignupForm() {
  const { form, states } = diary;
  const [pdnConsent, adsConsent] = form.consents;

  const [email, setEmail] = useState("");
  // null — поле ещё не проверяли (нейтрально, ни ok, ни err)
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [pdn, setPdn] = useState(false);
  const [ads, setAds] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const pdnRef = useRef<HTMLInputElement>(null);
  const adsRef = useRef<HTMLInputElement>(null);

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

  function handleSubmit(event: React.FormEvent) {
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
    // всё валидно → отправка и confirmation — task 2.3
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
          <span>{pdnConsent.text}</span>
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

      <Button type="submit" size="lg" className="w-full">
        {form.submit}
      </Button>
      <p className="text-charcoal/60 text-xs">{form.trust}</p>
      <p className="text-charcoal/60 text-xs">{form.caveat}</p>
    </form>
  );
}
