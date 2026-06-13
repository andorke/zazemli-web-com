import type { Metadata } from "next";

import { PageStub } from "@/components/site/page-stub";

/* Копи: Маркетинг/Каналы/Сайт/guide.md v1.1 §Meta-content */
export const metadata: Metadata = {
  title: {
    absolute: "Как заземлить растение · Гайд по пересадке за 5 шагов · ЗАЗЕМЛИ",
  },
  description:
    "Универсальный ритуал пересадки комнатного растения за 5 шагов. Подготовка, дренаж, грунт, посадка. Подходит для любого вида.",
  alternates: { canonical: "/guide" },
};

export default function GuidePage() {
  return (
    <PageStub
      h1="Гайд"
      lead="Универсальный ритуал пересадки комнатного растения за 5 шагов. Подготовка, дренаж, грунт, посадка. Подходит для любого вида."
    />
  );
}
