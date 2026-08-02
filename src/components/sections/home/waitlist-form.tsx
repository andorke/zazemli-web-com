"use client";

import { useRef, useState } from "react";

import {
  WaitlistModal,
  type WaitlistEmailSubmit,
} from "@/components/sections/home/waitlist-modal";
import { waitlist } from "@/content/waitlist";
import { reachGoal } from "@/lib/metrika";
import {
  isWaitlistApiEnabled,
  PLANT_MAX_LENGTH,
  submitWaitlistEmail,
  submitWaitlistPlant,
  trimPlant,
} from "@/lib/waitlist-submit";

/*
 * Лист ожидания N°08, шаг 1 — в плитке галереи (PATCH-1 §3.1): название
 * растения и «Дальше →». Шаг 2 (почта + два согласия) открывается попапом,
 * чтобы вопрос не растягивал ячейку грида семи SKU (NEW-02).
 *
 * За фича-флагом: без живого /api/waitlist/* формы в плитке нет вовсе. Сбор
 * email без серверного лога согласий (хранение ≥ 3 лет) юридически незащищён,
 * поэтому «форма-превью, которая ничего не отправляет» здесь не годится —
 * человек оставил бы почту в никуда (design Decision 3, spec §«Флаг выключен»).
 */
export function WaitlistForm() {
  const { step1 } = waitlist;
  const [plant, setPlant] = useState("");
  /* название, с которым открыт попап (null — закрыт) */
  const [asked, setAsked] = useState<string | null>(null);
  const requestId = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isWaitlistApiEnabled()) return null;

  function handleStep1(event: React.FormEvent) {
    event.preventDefault();
    const value = trimPlant(plant);
    if (!value) {
      inputRef.current?.focus();
      return;
    }

    /*
     * Растение фиксируем сразу, до почты, и не ждём ответа: даже брошенный
     * шаг 2 остаётся в счётчике спроса — это единственный источник данных о
     * том, какие растения собирать в следующей партии (контракт FIX-73).
     */
    void submitWaitlistPlant(value).then((id) => {
      requestId.current = id;
    });
    reachGoal("waitlist_plant_input", { plant: value });
    setAsked(value);
    reachGoal("waitlist_form_open");
  }

  function handleStep2(input: WaitlistEmailSubmit) {
    return submitWaitlistEmail({ ...input, requestId: requestId.current });
  }

  return (
    <>
      <form
        noValidate
        onSubmit={handleStep1}
        className="mt-2 flex min-w-0 flex-col gap-2"
      >
        <label htmlFor="waitlistPlant" className="sr-only">
          {step1.label}
        </label>
        <input
          ref={inputRef}
          type="text"
          id="waitlistPlant"
          name="plant"
          value={plant}
          maxLength={PLANT_MAX_LENGTH}
          placeholder={step1.placeholder}
          onChange={(event) => setPlant(event.target.value)}
          autoComplete="off"
          className="border-charcoal/25 bg-bone focus-visible:border-moss-ink focus-visible:ring-moss-ink text-charcoal placeholder:text-charcoal/40 font-ui w-full min-w-0 border px-3 py-2.5 text-[15px] outline-none focus-visible:ring-1"
        />
        <button
          type="submit"
          className="border-moss bg-moss text-bone font-ui min-h-11 w-fit border px-4 py-2.5 text-[15px] font-medium"
        >
          {step1.submit}
        </button>
      </form>

      <WaitlistModal
        plant={asked}
        onClose={() => setAsked(null)}
        onSubmit={handleStep2}
      />
    </>
  );
}
