import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import Collectio, { metadata } from "./page";

it("зарезервированный QR ведёт к каталогу и сохраняет query", () => {
  const html = renderToStaticMarkup(<Collectio />);
  expect(html).toContain("new URLSearchParams(location.search)");
  expect(html).toContain('location.replace(to.pathname+to.search+to.hash)');
  expect(html).toContain('href="/#boxes"');
  expect(metadata.robots).toMatchObject({ index: false });
});
