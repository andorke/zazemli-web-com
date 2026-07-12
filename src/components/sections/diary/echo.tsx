import Link from "next/link";

import { diary } from "@/content/diary";

/*
 * Эхо + повтор CTA (diary.echo), прототип diary-signup.html .echo.
 * Core formula «Земля и забота — всё, что нужно.» + повтор CTA на #signup
 * (форма несёт id="signup"). RSC. Копи — из diary.ts. Outline-CTA (moss-ink).
 */
export function Echo() {
  const { echo } = diary;
  return (
    <section className="border-charcoal/15 mx-auto mt-16 max-w-2xl border-t pt-12 text-center">
      <h2 className="leading-heading text-charcoal mx-auto max-w-[20ch] font-serif text-[clamp(1.4rem,2.5vw,1.9rem)] font-light">
        {echo.title}
      </h2>
      <Link
        href={echo.cta.href}
        className="border-moss-ink text-moss-ink mt-8 inline-flex items-center justify-center border px-8 py-3.5 font-sans text-base font-medium transition-opacity hover:opacity-70"
      >
        {echo.cta.label}
      </Link>
    </section>
  );
}
