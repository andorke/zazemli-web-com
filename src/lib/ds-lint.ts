/*
 * Проверки DS-запретов (tokens.json v1.1.0 $notes.policyReminders +
 * контраст-политика moss-ink): цвета только через токены (без hex в коде),
 * shadow: null, радиусы 0 / 2px / pill, выведенные семейства под запретом,
 * text-moss и SKU-цвет на тексте — только с инлайн-меткой ds-allow.
 */

const RULES: Array<{ name: string; pattern: RegExp; allowMark?: string }> = [
  { name: "hex-литерал цвета", pattern: /#[0-9a-fA-F]{3,8}\b/ },
  { name: "box-shadow класс", pattern: /(?:^|[\s"'`:])shadow-/ },
  {
    name: "запрещённый радиус (только 0 / 2px / pill)",
    pattern: /rounded-(?:2xl|3xl|4xl|\[\d)/,
  },
  {
    name: "выведенное семейство (unbounded|spectral|caveat)",
    pattern: /unbounded|spectral|caveat/i,
  },
  {
    name: "raw moss на тексте (мелкий текст — text-moss-ink/charcoal)",
    pattern: /(?:^|[\s"'`:])text-moss(?!-ink)/,
    allowMark: "ds-allow: moss-large",
  },
  {
    name: "SKU-цвет как цвет текста (SKU — только декор)",
    pattern:
      /(?:^|[\s"'`:])text-(?:sku-[a-z]+|cosmos|iris|buttercup|sky|poppy)\b/,
    allowMark: "ds-allow: sku-accent",
  },
  {
    name: "устаревшее имя токена: var(--moss|--soil|…) → var(--color-*)",
    pattern:
      /var\(--(?:bone|charcoal|moss|chalk|graphite|soil|ceramsite|pumice|sand|gravel|cosmos|iris|buttercup|sky|poppy)(?![-a-z])/,
  },
];

export function checkDsViolations(source: string): string[] {
  const lines = source.split("\n");
  return RULES.filter((rule) =>
    lines.some(
      (line) =>
        rule.pattern.test(line) &&
        !(rule.allowMark && line.includes(rule.allowMark)),
    ),
  ).map((rule) => rule.name);
}

/*
 * Проверка CSS-файлов. Hex здесь НЕ ищем — globals.css это источник токенов
 * (единственное легитимное место hex). Ищем box-shadow: тени запрещены (shadow: null),
 * а CSS-property мимо tsx-сканера прошла бы незамеченной.
 */
export function checkCssViolations(source: string): string[] {
  return /box-shadow\s*:/.test(source) ? ["box-shadow в CSS"] : [];
}
