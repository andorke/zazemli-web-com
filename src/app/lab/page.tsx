import type { Metadata } from "next";

import { PageStub } from "@/components/site/page-stub";

/* Копи: Маркетинг/Каналы/Сайт/lab.md v1.0 §Meta-content */
export const metadata: Metadata = {
  title: {
    absolute: "Лаборатория грунта · 11 компонентов почвосмеси · ЗАЗЕМЛИ",
  },
  description:
    "11 компонентов почвосмеси под 7 видов растений. Антуриуму — кора и кокос. Замиокулькасу — пеностекло. Каждому растению — своя рецептура.",
  alternates: { canonical: "/lab" },
};

export default function LabPage() {
  return (
    <PageStub
      h1="Лаборатория"
      lead="11 компонентов почвосмеси под 7 видов растений. Антуриуму — кора и кокос. Замиокулькасу — пеностекло. Каждому растению — своя рецептура."
    />
  );
}
