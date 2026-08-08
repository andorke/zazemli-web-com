// Конвейер картинок: из мастеров в assets/ собирает набор ширин в AVIF, WebP
// и JPEG, раскладывая результат в public/img/.
//
// Зачем вручную. Static export отключает встроенный оптимизатор Next
// (`images.unoptimized`), поэтому ни srcset, ни выбор формата не генерируются —
// в сборке страница отдаёт исходный JPEG всем подряд. Здесь это делается на
// сборке: минус примерно 880 КБ на мобильном визите.
//
// Отдельная строка про AVIF: файл, собранный `sips`, браузер не рисует вовсе —
// тот энкодер режет картинку grid-тайлами и ставит irot. sharp отдаёт обычный
// одиночный av01, с ним проблемы нет.
//
// Запускается сам перед `next build` (npm-скрипт prebuild). Результат
// в git не попадает — это артефакт сборки.

import { mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { resolve } from "node:path";

import sharp from "sharp";

const SRC = resolve(process.cwd(), "assets");
const OUT = resolve(process.cwd(), "public", "img");

/*
 * Портретный вариант героя — не про вес, а про резкость. Кадр 16:9 на телефоне
 * 390×844 при DPR 3 растягивается примерно вдвое, то есть мылит; вертикальный
 * кроп той же сцены и резче, и легче. `position: attention` оставляет в кадре
 * самую контрастную часть — корневую зону справа, а не пустую землю.
 */
const JOBS = [
  { master: "hero-roots.jpg", name: "hero-roots", widths: [800, 1200, 1600, 2200] },
  {
    master: "hero-roots.jpg",
    name: "hero-roots-portrait",
    widths: [900],
    resize: { width: 900, height: 1600, fit: "cover", position: "attention" },
  },
  { master: "band-bark.jpg", name: "band-bark", widths: [900, 1400, 1911] },
];

/* q50/q72/q76 — точка, где на этих фактурах ещё не видно артефактов */
const FORMATS = [
  { ext: "avif", apply: (p) => p.avif({ quality: 50, effort: 6 }) },
  { ext: "webp", apply: (p) => p.webp({ quality: 72 }) },
  { ext: "jpg", apply: (p) => p.jpeg({ quality: 76, mozjpeg: true }) },
];

const kb = (bytes) => Math.round(bytes / 1024);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

let total = 0;

for (const job of JOBS) {
  for (const width of job.widths) {
    for (const format of FORMATS) {
      const file = `${job.name}-${width}.${format.ext}`;
      const pipeline = sharp(resolve(SRC, job.master)).resize(
        job.resize ?? { width, withoutEnlargement: true },
      );
      await format.apply(pipeline).toFile(resolve(OUT, file));
      total += statSync(resolve(OUT, file)).size;
    }
  }
}

const files = readdirSync(OUT).sort();
for (const file of files) {
  console.log(`  ${file.padEnd(30)} ${kb(statSync(resolve(OUT, file)).size)} КБ`);
}
console.log(`${files.length} файлов, ${kb(total)} КБ всего → public/img/`);
