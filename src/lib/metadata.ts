import type { Metadata } from "next";

/*
 * Общий блок Open Graph + per-page og:url.
 *
 * Next мержит metadata по верхним ключам, но openGraph заменяет целиком: страница,
 * задавшая свой og:url, теряет и type/locale/siteName, и картинку, которую
 * подставляет файловая конвенция opengraph-image.tsx. Поэтому общие поля живут
 * здесь одним местом, а каждая страница вызывает openGraphFor(<свой canonical>).
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "ЗАЗЕМЛИ · Бокс на одну пересадку растения";

export function openGraphFor(path: string): Metadata["openGraph"] {
  return {
    type: "website",
    locale: "ru_RU",
    siteName: "ЗАЗЕМЛИ",
    url: path,
    images: [{ url: "/opengraph-image", ...OG_SIZE, alt: OG_ALT }],
  };
}
