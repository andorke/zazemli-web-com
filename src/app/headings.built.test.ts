import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { hasBuild, mainOf, readBuilt } from "@/lib/built-output";

/*
 * Заголовки собранных страниц сверяются с эталоном прототипа.
 *
 * Зачем именно заголовки: это самый заметный текст на странице и самый частый
 * канал расхождения. Дважды одно и то же уже случалось — 45 финальных точек
 * (FIX-26) и старый заголовок /lab (FIX-50) прожили на проде недели, потому
 * что сверка шла против эталона, снятого 12.07, а карточек и юр-страниц в
 * эталонах не было вовсе.
 *
 * Проверка односторонняя: каждый заголовок сборки должен встречаться в
 * прототипе. Обратное направление (узел прототипа отсутствует в сборке) шумит
 * на законных различиях — форма N°08 выключена флагом, тексты состояний и
 * модалок появляются в рантайме, футер и cookie-нотис живут в общем layout.
 */
const onBuild = hasBuild() ? describe : describe.skip;

const FIXTURES = resolve(process.cwd(), "src", "content", "__fixtures__");

/** роут сборки → имя прототипа */
const PAIRS: [string, string][] = [
  ["/", "landing"],
  ["/lab", "lab"],
  ["/guide", "guide"],
  ["/guide/perevalka", "guide-perevalka"],
  ["/guide/polnaya-zamena", "guide-polnaya-zamena"],
  ["/diary-signup", "diary-signup"],
  ["/privacy", "privacy"],
  ["/terms", "terms"],
  ["/collectio/monstera", "collectio-monstera"],
  ["/collectio/ficus", "collectio-ficus"],
  ["/collectio/anthurium", "collectio-anthurium"],
  ["/collectio/aglaonema", "collectio-aglaonema"],
  ["/collectio/spathiphyllum", "collectio-spathiphyllum"],
  ["/collectio/zamioculcas", "collectio-zamioculcas"],
  ["/collectio/epipremnum", "collectio-epipremnum"],
];

/* Неразрывные пробелы, разные тире и регистр сравнению мешают, смысл — нет */
const norm = (s: string) =>
  s
    .replace(/ /g, " ")
    .replace(/[–—−]/g, "—")
    .replace(/[«»"']/g, "")
    .replace(/\s+/g, " ")
    /* номер раздела в сборке лежит отдельным узлом: «1</span>. Общие» → «1. Общие» */
    .replace(/(\d)\s+\./g, "$1.")
    .trim()
    .toLowerCase();

const headingsOf = (html: string) =>
  [...mainOf(html).matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/g)]
    .map((m) => norm(m[1].replace(/<[^>]+>/g, " ")))
    .filter((s) => s.length > 2);

const fixture = (name: string) => {
  const path = resolve(FIXTURES, `${name}.prototype.txt`);
  return existsSync(path) ? norm(readFileSync(path, "utf8")) : null;
};

/*
 * Известные расхождения: заголовок есть в сборке, а в прототипе на его месте
 * другой узел. Каждое — с причиной; список держит гейт зелёным на разобранных
 * случаях и красным на новых.
 */
const KNOWN: Record<string, string[]> = {
  /*
   * Блок покупки: в прототипе он озаглавлен «Заземлить монстеру», в сборке
   * заголовок «Выбери объём» стоит над селектором, а «Заземлить …» осталось
   * надписью кнопки. Что из двух канон — решает автор копи; правка заголовка
   * редакторская, приёмкой её закрывать нельзя.
   */
  "/collectio/monstera": ["выбери объём"],
  "/collectio/ficus": ["выбери объём"],
  "/collectio/anthurium": ["выбери объём"],
  "/collectio/aglaonema": ["выбери объём"],
  "/collectio/spathiphyllum": ["выбери объём"],
  "/collectio/zamioculcas": ["выбери объём"],
  "/collectio/epipremnum": ["выбери объём"],
};

onBuild("Заголовки сборки сверены с прототипами", () => {
  it("эталон есть для каждой страницы приёмки", () => {
    const missing = PAIRS.filter(([, name]) => fixture(name) === null).map(([r]) => r);
    expect(missing).toEqual([]);
  });

  it.each(PAIRS)("%s: каждый заголовок есть в прототипе", (route, name) => {
    const html = readBuilt(route);
    const proto = fixture(name);
    expect(html, `нет сборки ${route}`).not.toBeNull();
    expect(proto, `нет эталона ${name}`).not.toBeNull();

    const known = KNOWN[route] ?? [];
    const stray = headingsOf(html as string)
      .filter((h) => !(proto as string).includes(h))
      .filter((h) => !known.includes(h));
    expect(stray, `заголовков нет в прототипе: ${stray.join(" | ")}`).toEqual([]);
  });
});

/*
 * Штампы редполитики не множатся сверх прототипа.
 *
 * PATCH-1 §6 называет «не X, а Y» и «не X. Это Y» ИИ-штампом и снимает их —
 * но в самих прототипах, которые тот же патч объявляет спекой, эти конструкции
 * есть: в hero /lab и в семи рецептурах. Это расхождение внутри канона, и
 * снимает его автор копи, а не приёмка.
 *
 * Поэтому проверка не запрещает конструкцию, а держит её на уровне прототипа:
 * сборка не должна добавлять своих. Убрать авторские — отдельное решение,
 * после которого счётчик просто опустится вместе с прототипом.
 */
/*
 * Граница слова: `\b` в JS определяется по ASCII, поэтому на кириллице
 * `\bне` не срабатывает вовсе — та же ловушка, что с `\w` в built-output.
 * Начало слова задаём явно: начало строки или не-буква перед «не».
 */
const RU_START = "(?:^|[^\\p{L}])";
const SLOP = [
  {
    name: "«не X, а Y»",
    re: new RegExp(`${RU_START}не\\s+[^.!?;]{3,60}?,\\s+а\\s+(?!не[^\\p{L}])\\p{L}`, "giu"),
  },
  {
    name: "«не X. Это Y»",
    re: new RegExp(`${RU_START}не\\s+[^.!?]{3,60}\\.\\s*это\\s`, "giu"),
  },
];

const countSlop = (text: string) =>
  SLOP.map(({ name, re }) => ({ name, n: (text.match(re) ?? []).length }));

onBuild("Штампы редполитики не множатся сверх прототипа", () => {
  it.each(PAIRS)("%s: штампов не больше, чем в прототипе", (route, name) => {
    const built = norm((mainOf(readBuilt(route) ?? "").replace(/<[^>]+>/g, " ")));
    const proto = fixture(name) as string;

    const over = countSlop(built)
      .map((b, i) => ({ ...b, proto: countSlop(proto)[i].n }))
      .filter((x) => x.n > x.proto)
      .map((x) => `${x.name}: в сборке ${x.n}, в прототипе ${x.proto}`);

    expect(over, over.join("; ")).toEqual([]);
  });
});
