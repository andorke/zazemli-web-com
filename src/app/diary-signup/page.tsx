import type { Metadata } from "next";

import { KickerHeader } from "@/components/ui/kicker-header";
import { diary } from "@/content/diary";

/*
 * Вход только по QR со страницы III печатного дневника (бриф §2):
 * страницы нет в навигации, sitemap и индексе.
 * Копи: Маркетинг/Каналы/Сайт/diary-signup.md v1.1 §Meta-content
 */
export const metadata: Metadata = {
  title: { absolute: "Дневник растения · ЗАЗЕМЛИ" },
  description:
    "Земля и забота — всё, что нужно растению. Дневник — мост. 7 писем за год от Day 0 до Day +365.",
  alternates: { canonical: "/diary-signup" },
  robots: { index: false, follow: false },
};

/*
 * Страница-форма по прототипу diary-signup.html v3: hero (выгода-результат) высоко,
 * форма above the fold на мобиле. Форма, состояния, попап политики и секции
 * «Почему тебе» / «Что внутри» / эхо — следующие задачи (2.2–2.5). Копи — из diary.ts.
 */
export default function DiarySignupPage() {
  const { hero, gift } = diary;
  return (
    <main className="flex-1 px-6 py-16 lg:px-30">
      <section className="mx-auto flex max-w-2xl flex-col">
        <KickerHeader>{hero.eyebrow}</KickerHeader>
        <p className="text-charcoal/60 mt-4 text-sm">{hero.ack}</p>
        <h1 className="leading-hero tracking-heading-tight text-charcoal mt-4 font-serif text-[clamp(2.2rem,6vw,3.6rem)] font-light">
          {hero.title}
        </h1>
        <p className="leading-narrative text-charcoal/90 mt-6 max-w-xl font-serif text-lg font-light">
          {hero.sub}
        </p>
        <p className="border-moss leading-body text-charcoal/70 mt-6 max-w-xl border-l-2 pl-4 text-sm">
          <span className="text-charcoal font-medium">{gift.lead}</span>{" "}
          {gift.body}
        </p>
      </section>
    </main>
  );
}
