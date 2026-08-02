import { describe, expect, it } from "vitest";

import { buildOzonUrl, buildSocialUrl } from "@/lib/utm";

describe("buildOzonUrl", () => {
  it("добавляет utm_source=site к чистому URL", () => {
    const url = new URL(buildOzonUrl("https://www.ozon.ru/seller/zazemli"));
    expect(url.searchParams.get("utm_source")).toBe("site");
  });

  it("сохраняет существующие query-параметры", () => {
    const url = new URL(
      buildOzonUrl("https://www.ozon.ru/seller/zazemli?from=menu"),
    );
    expect(url.searchParams.get("from")).toBe("menu");
    expect(url.searchParams.get("utm_source")).toBe("site");
  });

  it("добавляет utm_content для конкретного SKU", () => {
    const url = new URL(
      buildOzonUrl("https://www.ozon.ru/product/x", { skuNumber: "N°003" }),
    );
    expect(url.searchParams.get("utm_content")).toBe("sku003");
  });
});

describe("buildSocialUrl", () => {
  it("помечает соцпрофиль тем же источником, что и Ozon-ссылки", () => {
    const url = new URL(buildSocialUrl("https://t.me/zazemli_collectio"));
    expect(url.searchParams.get("utm_source")).toBe("site");
  });

  it("сохраняет путь профиля", () => {
    expect(buildSocialUrl("https://instagram.com/zazemli_collectio")).toContain(
      "/zazemli_collectio",
    );
  });
});
