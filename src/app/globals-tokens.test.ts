import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/*
 * Инвариант токенов ds-migration: globals.css соответствует
 * ../zazemli-vault/Айти/Сайт/tokens.json v1.1.0 (значения захардкожены
 * здесь, чтобы репо оставался самодостаточным без vault).
 */

const css = readFileSync("src/app/globals.css", "utf8");
const root = css.slice(css.indexOf(":root"), css.indexOf("@theme"));

const has = (source: string, decl: string) =>
  new RegExp(decl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(source);

describe("токены v1.1.0 на :root", () => {
  it("бренд-палитра: bone, charcoal, moss, moss-ink, chalk", () => {
    expect(has(root, "--color-bone: #F6F4F0")).toBe(true);
    expect(has(root, "--color-charcoal: #1C1C1C")).toBe(true);
    expect(has(root, "--color-moss: #4A7C59")).toBe(true);
    expect(has(root, "--color-moss-ink: #406C4F")).toBe(true);
    expect(has(root, "--color-chalk: #EDEBE6")).toBe(true);
  });

  it("earth-палитра: 6 материалов", () => {
    expect(has(root, "--color-graphite: #2E2E2E")).toBe(true);
    expect(has(root, "--color-soil: #6B4D35")).toBe(true);
    expect(has(root, "--color-ceramsite: #B08C5A")).toBe(true);
    expect(has(root, "--color-pumice: #B5AFA3")).toBe(true);
    expect(has(root, "--color-sand: #C8B8A8")).toBe(true);
    expect(has(root, "--color-gravel: #D2C9B8")).toBe(true);
  });

  it("SKU-палитра: 7 растений (tokens.color.sku)", () => {
    expect(has(root, "--color-sku-monstera: #4A7C59")).toBe(true);
    expect(has(root, "--color-sku-epipremnum: #4A7C59")).toBe(true);
    expect(has(root, "--color-sku-ficus: #BE3A6B")).toBe(true);
    expect(has(root, "--color-sku-aglaonema: #7E6AAF")).toBe(true);
    expect(has(root, "--color-sku-zamioculcas: #C47A10")).toBe(true);
    expect(has(root, "--color-sku-spathiphyllum: #2878AE")).toBe(true);
    expect(has(root, "--color-sku-anthurium: #C03A30")).toBe(true);
  });

  it("opacity-шкала (tokens.opacity)", () => {
    expect(has(root, "--opacity-text-display: 0.8")).toBe(true);
    expect(has(root, "--opacity-text-latin: 0.75")).toBe(true);
    expect(has(root, "--opacity-text-narrative: 0.7")).toBe(true);
    expect(has(root, "--opacity-text-secondary: 0.5")).toBe(true);
    expect(has(root, "--opacity-text-caption: 0.4")).toBe(true);
    expect(has(root, "--opacity-border-divider: 0.3")).toBe(true);
  });
});

describe("шкалы v1.1.0 в теме", () => {
  it("типо-шкала ролей 84/52/34/24/18/15/13/12 (tokens.typography.roles)", () => {
    expect(has(css, "--text-display: 5.25rem")).toBe(true); // 84
    expect(has(css, "--text-h1: 3.25rem")).toBe(true); // 52
    expect(has(css, "--text-h2: 2.125rem")).toBe(true); // 34
    expect(has(css, "--text-take: 1.5rem")).toBe(true); // 24
    expect(has(css, "--text-body: 1.125rem")).toBe(true); // 18
    expect(has(css, "--text-small: 0.9375rem")).toBe(true); // 15
    expect(has(css, "--text-caption: 0.8125rem")).toBe(true); // 13
    expect(has(css, "--text-eyebrow: 0.75rem")).toBe(true); // 12
  });

  it("семантическая spacing-шкала (tokens.space.semantic)", () => {
    expect(has(css, "--spacing-section-y: 6rem")).toBe(true); // 96
    expect(has(css, "--spacing-section-y-mobile: 4rem")).toBe(true); // 64
    expect(has(css, "--spacing-section-gap: 4rem")).toBe(true); // 64
    expect(has(css, "--spacing-section-gap-mobile: 3rem")).toBe(true); // 48
    expect(has(css, "--spacing-block-gap: 2rem")).toBe(true); // 32
    expect(has(css, "--spacing-item-gap: 1rem")).toBe(true); // 16
    expect(has(css, "--spacing-tight-gap: 0.5rem")).toBe(true); // 8
  });

  it("layout-брейкпоинт прототипов 860px", () => {
    expect(has(css, "--breakpoint-layout: 860px")).toBe(true);
  });

  it("ссылка на источник v1.1.0 в комментарии", () => {
    expect(css).toContain("tokens.json v1.1.0");
  });
});
