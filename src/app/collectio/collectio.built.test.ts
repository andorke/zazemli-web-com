import { describe, expect, it } from "vitest";

import { hasBuild, readBuilt } from "@/lib/built-output";

/*
 * FIX-24: голый /collectio уводит на /#collectio. Настоящий 301 добавляет
 * хостинг; в статическом экспорте redirect() Next не работает, поэтому
 * страница уводит клиентскими средствами и закрыта от индекса.
 */
const onBuild = hasBuild() ? describe : describe.skip;
const html = readBuilt("/collectio") ?? "";

onBuild("Собранная /collectio: приёмка FIX-24", () => {
  it("страница существует — печатный QR партии 0 ведёт на неё", () => {
    expect(html).not.toBe("");
  });

  it("уводит на /#collectio и meta-refresh, и скриптом", () => {
    expect(html).toMatch(/http-equiv="refresh"[^>]*\/#collectio/);
    expect(html).toContain("location.replace");
  });

  it("закрыта от индекса — дубля коллекции в выдаче нет", () => {
    expect(html).toMatch(/name="robots" content="[^"]*noindex/);
  });

  it("без JS остаётся ручная ссылка", () => {
    expect(html).toMatch(/<noscript>[\s\S]*?href="\/#collectio"/);
  });
});
