"use client";

import { Button } from "@/components/ui/button";
import { setConsent, useConsent, type Consent } from "@/lib/consent";

/*
 * Cookie-баннер с consent-gate (бриф §8, 152-ФЗ): по умолчанию необязательные
 * cookie отклоняются. Решение сохраняется — баннер показывается только до выбора.
 */
export function CookieBanner() {
  const consent = useConsent();

  function decide(value: Consent) {
    setConsent(value);
  }

  if (consent !== null) return null;

  return (
    <div
      role="region"
      aria-label="Согласие на cookie"
      className="border-charcoal/15 bg-bone fixed inset-x-0 bottom-0 z-50 border-t px-6 py-5 lg:px-16"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-charcoal/70 leading-body max-w-2xl font-voice text-sm">
          Мы используем cookie для аналитики — чтобы понимать, как улучшить
          сайт. Необязательные cookie включаются только с твоего согласия.
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <Button variant="ghost" onClick={() => decide("denied")}>
            Только необходимые
          </Button>
          <Button onClick={() => decide("granted")}>Принять</Button>
        </div>
      </div>
    </div>
  );
}
