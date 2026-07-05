import Link from "next/link";

import { OzonButton } from "@/components/site/ozon-button";
import { Button } from "@/components/ui/button";
import { ozonStoreUrl } from "@/content/site";

/* Копи 404 — утверждённая: Голос/ui-microcopy/error-message.md v1.0.1 §1 (вариант A) */
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-start gap-6 px-6 py-24 lg:px-30">
      <h1 className="leading-heading tracking-heading-tight text-charcoal/80 text-4xl font-bold">
        Страница не нашлась.
      </h1>
      <p className="leading-narrative text-charcoal/70 max-w-xl font-voice text-lg">
        Возможно, переехала или мы ошиблись со ссылкой.
      </p>
      <div className="flex items-center gap-4">
        <Button asChild variant="outline">
          <Link href="/">На главную</Link>
        </Button>
        <OzonButton href={ozonStoreUrl} />
      </div>
    </main>
  );
}
