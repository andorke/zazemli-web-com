import type { Metadata } from "next";

import { PageStub } from "@/components/site/page-stub";

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

export default function DiarySignupPage() {
  return (
    <PageStub
      h1="Дневник растения"
      lead="Земля и забота — всё, что нужно растению. Дневник — мост. 7 писем за год от Day 0 до Day +365."
    />
  );
}
