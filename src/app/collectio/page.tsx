import type { Metadata } from "next";

import { PageStub } from "@/components/site/page-stub";

/* Копи: Маркетинг/Каналы/Сайт/collectio-grid.md v1.1 §Meta-content */
export const metadata: Metadata = {
  title: { absolute: "Коллекция · 7 родов растений · ЗАЗЕМЛИ" },
  description:
    "Коллекция из 7 видов боксов для пересадки растений: Монстера, Фикус, Антуриум, Аглаонема, Спатифиллум, Замиокулькас, Эпипремнум. В каждом — рецептура под биотоп.",
  alternates: { canonical: "/collectio" },
};

export default function CollectioPage() {
  return (
    <PageStub
      h1="Коллекция"
      lead="Коллекция из 7 видов боксов для пересадки растений: монстера, фикус, антуриум, аглаонема, спатифиллум, замиокулькас, эпипремнум. В каждом — рецептура под биотоп."
    />
  );
}
