import type { Metadata } from "next";

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
      <noscript>
        <a href={TARGET}>Перейти к коллекции на главной</a>
      </noscript>
    </>
  );
}
