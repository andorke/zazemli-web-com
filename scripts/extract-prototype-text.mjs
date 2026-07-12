// Выгрузка видимых текстовых узлов прототипов guide.html / lab.html как эталон
// для контент-тестов (diff-сверка переноса в src/content/*.ts против прототипа).
//
// Прототипы лежат во внешнем vault (read-only), в CI/ночной сборке его нет —
// поэтому эталон коммитится в репозиторий, а тесты читают закоммиченный .txt.
// Перегенерация — вручную после правок прототипа:
//   npm run extract:prototypes
//   PROTOTYPES_DIR=/путь/к/prototypes npm run extract:prototypes   # из worktree
//
// Формат вывода: по одной нормализованной текстовой строке на узел, дедуп в
// порядке первого появления. Плейсхолдеры иллюстраций (CSS content: attr(data-*))
// в DOM-текст не входят и в эталон не попадают — иллюстрации на MVP это слоты.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PROTO_DIR =
  process.env.PROTOTYPES_DIR ??
  resolve(repoRoot, "../zazemli-vault/Айти/Сайт/prototypes");
const OUT_DIR = resolve(repoRoot, "src/content/__fixtures__");

// Инлайн-разметка схлопывается в строку родителя (фраза остаётся целой).
// span в этих прототипах используется как блок — намеренно НЕ в списке.
const INLINE = new Set([
  "A", "B", "I", "EM", "STRONG", "U", "SUP", "SUB", "BR", "SMALL", "CODE",
]);

const normalize = (s) => s.replace(/[\t\n\r\f\v ]+/g, " ").trim();
const hasText = (s) => /[\p{L}\p{N}]/u.test(s);

// Текст элемента: text-узлы и инлайн-дети склеиваются в одну строку; блочный
// ребёнок — граница (сброс буфера и рекурсия внутрь).
function extract(node, out) {
  let buf = "";
  const flush = () => {
    const t = normalize(buf);
    if (t && hasText(t)) out.push(t);
    buf = "";
  };
  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      buf += child.textContent;
    } else if (child.nodeType === 1) {
      if (INLINE.has(child.tagName)) {
        buf += child.textContent;
      } else {
        flush();
        extract(child, out);
      }
    }
  }
  flush();
}

function dumpNodes(html) {
  const { document } = new JSDOM(html).window;
  document.querySelectorAll("script, style").forEach((n) => n.remove());
  const out = [];
  extract(document.body, out);
  const seen = new Set();
  return out.filter((s) => !seen.has(s) && seen.add(s));
}

function run(name) {
  const html = readFileSync(resolve(PROTO_DIR, `${name}.html`), "utf8");
  const nodes = dumpNodes(html);
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(
    resolve(OUT_DIR, `${name}.prototype.txt`),
    nodes.join("\n") + "\n",
    "utf8",
  );
  console.log(`${name}: ${nodes.length} узлов → src/content/__fixtures__/${name}.prototype.txt`);
}

run("guide");
run("lab");
