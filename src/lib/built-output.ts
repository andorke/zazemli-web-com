import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/*
 * Доступ к статическому экспорту для приёмки PATCH-1 §7.1: патч требует гонять
 * проверки по СОБРАННЫМ страницам, а не по исходникам — «правка стоит ✅ в
 * отчёте, а в файле её нет» ровно так и прошла мимо прошлой итерации.
 *
 * Сборки в рабочем дереве может не быть (`out/` в git не попадает), поэтому
 * чтение отдаёт null, а наборы проверок скипаются через hasBuild(). Смысл —
 * воспроизводимость приёмки, а не блокировка обычного прогона vitest.
 */

/** Семь карточек коллекции — отдельным списком: по ним идёт половина проверок состава. */
export const SKU_ROUTES = [
  "/collectio/monstera",
  "/collectio/ficus",
  "/collectio/anthurium",
  "/collectio/aglaonema",
  "/collectio/spathiphyllum",
  "/collectio/zamioculcas",
  "/collectio/epipremnum",
] as const;

/** 15 макетов приёмки: главная + 7 карточек + guide ×3 + lab + diary + privacy + terms. */
export const ALL_ROUTES = [
  "/",
  ...SKU_ROUTES,
  "/guide",
  "/guide/perevalka",
  "/guide/polnaya-zamena",
  "/lab",
  "/diary-signup",
  "/privacy",
  "/terms",
] as const;

/** Next static export кладёт роут файлом рядом, а не папкой с index.html (кроме корня). */
export function builtPath(route: string): string {
  const clean = route.replace(/^\/+|\/+$/g, "");
  return resolve(process.cwd(), "out", clean === "" ? "index.html" : `${clean}.html`);
}

export function readBuilt(route: string): string | null {
  const path = builtPath(route);
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}

export function hasBuild(): boolean {
  return existsSync(builtPath("/"));
}

/** Все страницы разом — для сквозных проверок по всем 15 макетам. */
export function readAllBuilt(): { route: string; html: string }[] {
  return ALL_ROUTES.map((route) => ({ route, html: readBuilt(route) ?? "" })).filter(
    (page) => page.html !== "",
  );
}

/*
 * Только отрисованный <main>: после него Next кладёт RSC-payload
 * (self.__next_f.push) — экранированную копию той же разметки. Поиск по всему
 * файлу попадает в неё, а не в страницу: там разметка закодирована как
 * ["$","a",…], поэтому проверки вида «в блоке нет <a>» становятся вечнозелёными.
 */
export function mainOf(html: string): string {
  const start = html.indexOf("<main");
  const end = html.indexOf("</main>");
  return start >= 0 && end > start ? html.slice(start, end) : "";
}

/** Текст без разметки: порядок блоков и заголовки проверяем по нему. */
export function textOf(html: string): string {
  return html.replace(/<[^>]+>/g, "\n");
}

/*
 * `\w` в JS — ASCII-класс, на кириллице он не работает: «баночк\w*\s+» не найдёт
 * «баночка угольной», и проверка молча вырождается в вечнозелёную. Словоформы
 * задаём через \p{L} с флагом u — та же ловушка, что с неразрывным пробелом.
 */
export const ru = (source: string) => new RegExp(source, "iu");

/** Цены в сборке набраны неразрывным пробелом — ищем оба варианта (PATCH-1 §6). */
export const SP = "[ \\u00A0]";

/** Кириллическая словоформа для ru(): «баночк» + W + «угольной». */
export const W = "\\p{L}*";
