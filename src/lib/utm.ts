/*
 * UTM-контракт исходящих ссылок бренда (бриф §2, ARCHITECTURE.md §4):
 * utm_source=site всегда; utm_content=sku00X для ссылок конкретного SKU.
 * Действует на все площадки бренда — Ozon и соцпрофили: без метки переход
 * из футера в статистике неотличим от прямого захода (FIX-29).
 * Сторонние ссылки (научные источники /lab, статьи гайда) — не наши площадки,
 * UTM на них не вешаем.
 */

function tagged(base: string): URL {
  const url = new URL(base);
  url.searchParams.set("utm_source", "site");
  return url;
}

export function buildOzonUrl(
  base: string,
  opts?: { skuNumber?: `N°${string}` },
): string {
  const url = tagged(base);
  if (opts?.skuNumber) {
    url.searchParams.set(
      "utm_content",
      `sku${opts.skuNumber.replace("N°", "")}`,
    );
  }
  return url.toString();
}

export function buildSocialUrl(base: string): string {
  return tagged(base).toString();
}
