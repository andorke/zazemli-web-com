/*
 * UTM-контракт исходящих ссылок на Ozon (бриф §2, ARCHITECTURE.md §4):
 * utm_source=site всегда; utm_content=sku00X для ссылок конкретного SKU.
 */

export function buildOzonUrl(
  base: string,
  opts?: { skuNumber?: `N°${string}` },
): string {
  const url = new URL(base);
  url.searchParams.set("utm_source", "site");
  if (opts?.skuNumber) {
    url.searchParams.set(
      "utm_content",
      `sku${opts.skuNumber.replace("N°", "")}`,
    );
  }
  return url.toString();
}
