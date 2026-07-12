import { describe, expect, it } from "vitest";

import { metadata } from "@/app/privacy/page";
import sitemap from "@/app/sitemap";

describe("sitemap — индексируемость /privacy", () => {
  it("содержит URL /privacy", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://zazemli.com/privacy");
  });

  it("/privacy индексируема (robots-метаданные не noindex)", () => {
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
  });
});
