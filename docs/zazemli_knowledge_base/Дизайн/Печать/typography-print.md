# typography-print · Версия: 1.0.0 · Дата: 2026-05-16 · Источник: PRINT_BRIEF v5.4 §5.5 + §5.9 + brand-v3 §05

Production-спека слоя `05_production/`. Печатные правила типографики. Отдельно от `01_foundations/typography.md` (веб) — разные носители требуют разной настройки.

## Что это

Как Unbounded / Spectral / Caveat ведут себя на бумаге «Лен сл. кость 300г» (листовка), бумажной самоклейке + soft-touch (медальон, мини, банд). Правила Charcoal split, шрифтовые subset, обязательные глифы.

## Роль в ДНК-четвёрке

Источник **02 Apothecary** (тонкая типографика, sparse-вес) + источник **04 Handscript** (Caveat для band и leaflet). См. `02_voice/dna.md` §1, §7 + `04_patterns/print-web-bridge.md` (Мост 1 типографика).

## Charcoal split rule (главное правило)

`charcoal #1C1C1C` имеет **двойную интерпретацию** в pre-press:

| Контекст | HEX в SVG | CMYK в PDF | Зачем |
|---|---|---|---|
| **Плашки, фоны, ground** | `#1C1C1C` | `C70 M67 Y66 K77` (rich black, TAC 277%) | Глубокий насыщенный чёрный |
| **Текст внутри `<text>`** | автозамена → `#000000` | **`K=100 pure`** | Резкость на льне, нет misregistration |

Применяется в `pdf_cmyk()` post-process: внутри тегов `<text>` все `#1C1C1C` заменяются на `#000000` **до** ghostscript-конверсии. Rich black остаётся только на `<rect>`/`<circle>` плашках.

**Зачем:** на uncoated льне 277% TAC + 4-color misregistration делает мелкий текст «грязным». Pure K=100 = одна краска, всегда в регистре, всегда резкий.

## Шрифты · subset + Cyrillic + Ё

**Subset PDF embedded (для всех 33 PDF партии 0):**

| Шрифт | Веса | Где используется |
|---|---|---|
| **Unbounded** | Regular 400, Medium 500, Bold 700, Black 900 | System text (COLLECTIO header, hero name, КАПС labels) |
| **Spectral** | Regular 400, Italic 400, Bold 700 / Bold-Italic 700 | Latin names + poetic signatures |
| **Caveat** | Regular 400 | Handwritten tagline (только band + leaflet — нет на медальоне/мини) |
| **DejaVu Sans** | Regular (системный) | Fleuron ❦ (U+2766) — Spectral его НЕ содержит! |

**⚠️ КРИТИЧНО:** Unbounded subset **обязан включать `Ё` (U+0401)**. Иначе «ЗАЗЕМЛЁН» на 6 SKU сломается. Проверено на v5.4 — Ё embedded.

**Verify:** `pdffonts file.pdf` → все строки `emb=yes sub=yes uni=yes`. Если `uni=no` — кириллица сломается.

## Минимальные размеры

| Параметр | Минимум | Замечание |
|---|---|---|
| Размер шрифта | **≥ 2.3 pt** | Меньше — не печатается на льне |
| Stroke (линия) | **≥ 0.25 мм** = 0.75 SVG units | Линии 0.1 мм пропадают на uncoated |
| Letter-spacing (uppercase Unbounded) | 0.18em–0.25em | По брендбуку §05 |
| Line-height (composition list) | **1.48** | По брендбуку §05 (выровнено в v5.4) |

## TAC (Total Area Coverage) — ограничения

| Зона | TAC | Статус |
|---|---|---|
| Bone fill (canvas) | ~8% | ✅ норма |
| Moss signature | ~192% | ✅ норма |
| **Rich black плашка** (`#1C1C1C` → C70 M67 Y66 K77) | **277.7%** | 🟡 на грани лимита 280% uncoated. Проверить пробным образцом. |
| Если page-avg > 280% | — | Откатить на `C60 M55 Y55 K70 = 240%` |

## Правила применения

- **При создании нового печатного артефакта** — сверять с этим документом и PRINT_BRIEF.
- **Charcoal split автоматический** в `pdf_cmyk()` post-process. Вручную не правится.
- **Все шрифты должны быть в `~/.fonts/`** (для агента) или эквивалентном системном месте.
- **При смене шрифта** (например, на новый Unbounded weight) — обязательно проверить Ё через `pdffonts` + `fontTools`.
- **Caveat — только на band и leaflet.** На медальоне / мини / дневнике — Unbounded или Spectral.

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- `#1C1C1C` для текста (только rich black для плашек).
- Шрифты без `uni=yes` (кириллица сломается).
- Spectral для ❦ (нет глифа U+2766 — пустой бокс).
- Stroke <0.25 мм.
- Шрифт <2.3 pt.
- Не-subset embedded fonts (раздувают PDF без необходимости).

## Где это работает

- `01_foundations/typography.md` — веб-эквивалент (Unbounded text-base 16px = Unbounded 12pt в печати).
- `01_foundations/tokens.json` — общие токены.
- `01_foundations/color-system.md` — CMYK conversion таблица.
- `04_patterns/print-web-bridge.md` — Мост 1 типографика.
- `05_production/print-brief.md` — главная pre-press спека.
- `05_production/prepress-workflow.md` — automation pipeline.

## История версий

- v1.0.0 · 2026-05-16 · первый draft, источник PRINT_BRIEF v5.4 §5.5 + §5.9.

## Заметка про дубль (для Спринта 11)

PRINT_BRIEF v5.4 §5.5+5.9 → ссылка `→ 05_production/typography-print.md`. brand-v3 §05 «Шрифты» — общая часть остаётся, добавляется cross-ref на этот pattern для печати.
