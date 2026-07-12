import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import CollectioRedirect, { metadata } from "@/app/collectio/page";

/* Редирект-страница печатного QR: static export → клиентский редирект (design-решение 3) */
describe("Редирект-страница /collectio", () => {
  const html = renderToStaticMarkup(<CollectioRedirect />);

  it("meta refresh мгновенно уводит на /#collectio", () => {
    expect(html).toContain('http-equiv="refresh"');
    expect(html).toContain("0;url=/#collectio");
  });

  it("инлайн location.replace дублирует редирект на /#collectio", () => {
    expect(html).toContain("location.replace");
    expect(html).toContain("/#collectio");
  });

  it("вне индекса: robots noindex", () => {
    expect(metadata.robots).toMatchObject({ index: false });
  });

  it("canonical указывает на главную", () => {
    expect(metadata.alternates?.canonical).toBe("/");
  });
});
