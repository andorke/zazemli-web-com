import type { Metadata } from "next";
import { openGraphFor } from "@/lib/metadata";

/*
 * Редирект-страница, а не заглушка: страницы-индекса коллекции нет (живёт секцией
 * на главной), но печатный QR партии 0 зашит на /collectio. Уводим на /#collectio
 * клиентскими средствами — meta refresh + location.replace работают на любом
 * статик-хостинге без серверной конфигурации; настоящий 301 добавит хостинг поверх.
 * (design-решение 3; redirect() next в static export не работает.)
 */
const TARGET = "/#collectio";

export const metadata: Metadata = {
  title: "Коллекция",
  alternates: { canonical: "/" },
  openGraph: openGraphFor("/"),
  robots: { index: false, follow: false },
};

export default function CollectioRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${TARGET}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `location.replace(${JSON.stringify(TARGET)})`,
        }}
      />
      {/* Содержимого у редирект-страницы нет, но якорь skip-link нужен и здесь:
          без JS человек остаётся именно на ней. */}
      <main id="main">
        <noscript>
          <a href={TARGET}>Перейти к коллекции на главной</a>
        </noscript>
      </main>
    </>
  );
}
