import { footer } from "@/content/site";

/*
 * Schema.org-разметка. Данные собираются из тех же контент-модулей, что и видимый
 * текст (design-решение 2): рукописный JSON рано или поздно разъезжается со страницей.
 * `<` экранируем по рекомендации Next.js — иначе строка в данных может закрыть script.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/* Кто стоит за сайтом. Один узел на страницу — рендерится из layout. logo ≥112×112. */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ЗАЗЕМЛИ",
        url: "https://zazemli.com",
        logo: "https://zazemli.com/apple-icon.png",
        email: footer.email,
        /* sameAs — канонические профили без UTM: это признак тождества, не переход */
        sameAs: [footer.instagramUrl, footer.telegramUrl],
      }}
    />
  );
}
