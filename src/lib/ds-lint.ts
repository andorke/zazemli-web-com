/*
 * Проверки DS-запретов (tokens.json v1.0.1 $notes.policyReminders):
 * цвета только через токены (без hex в коде), shadow: null, радиусы 0 / 2px / pill.
 */

const RULES: Array<{ name: string; pattern: RegExp }> = [
  { name: "hex-литерал цвета", pattern: /#[0-9a-fA-F]{3,8}\b/ },
  { name: "box-shadow класс", pattern: /(?:^|[\s"'`:])shadow-/ },
  {
    name: "запрещённый радиус (только 0 / 2px / pill)",
    pattern: /rounded-(?:2xl|3xl|4xl|\[\d)/,
  },
];

export function checkDsViolations(source: string): string[] {
  return RULES.filter((rule) => rule.pattern.test(source)).map(
    (rule) => rule.name,
  );
}
