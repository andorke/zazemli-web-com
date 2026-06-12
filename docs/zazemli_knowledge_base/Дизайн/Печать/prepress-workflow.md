# prepress-workflow · Версия: 1.0.0 · Дата: 2026-05-16 · Источник: PREPRESS_GUIDE.md v1.0 (26 апреля 2026)

Production-спека слоя `05_production/`. Automation pipeline генерации pre-press PDF: от SVG-функций до 33 PDF в типографию.

## Что это

Полный workflow: `build_sketches.py` → mockups + `build_prepress.py` → ICC-конверсия → qpdf post-process → pypdf TrimBox/BleedBox → push в `partia-N/`. Триггер-фразы, стек инструментов, verify checklist. **Этого workflow не было в brand-v3** — новый артефакт сверх явных источников.

## Роль в ДНК-четвёрке

Не несёт ДНК сам по себе (technical pipeline). Поддерживает источники **02 Apothecary** (sparse-правила) + **03 Naturalist** (материалы) через автоматическую генерацию. См. `02_voice/dna.md` §1, §7.

## Триггер-фразы (запускают workflow)

| Фраза | Что делать |
|---|---|
| «сделай препресс» / «сделай pre-press» | Полный pipeline §3 → §4 → §5 → §6 |
| «сделай макеты» / «подготовь для типографии» | Тот же полный pipeline |
| «обнови партию [N]» | §8 — копировать схему с новой partia-N |
| «проверь макеты» | Только §5 Verify (без regen) |
| «обнови мокапы» | Только §3 Build sketches (sketches.html) |

## Pipeline · 4 этапа

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ build_sketches  │ ──→│ sketches.html    │    │ Mockup для       │
│ .py             │    │ (sketches v5+)   │ ──→│ Насти            │
└─────────────────┘    └──────────────────┘    └──────────────────┘
         │
         │ imports
         ↓
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ build_prepress  │ ──→│ print-v6-prepress│ ──→│ brand-kit/maketi │
│ .py             │    │ (33 PDF)         │    │ /partia-0/       │
└─────────────────┘    └──────────────────┘    └──────────────────┘
```

## Стек инструментов (строго эти)

| Инструмент | Назначение |
|---|---|
| **cairosvg** (2.9+) | SVG → vector PDF (без растеризации) |
| **ghostscript** 9.55+ | RGB → CMYK FOGRA39L conversion |
| **qpdf** | uncompress / re-compress + content stream patching |
| **pypdf** 3.x | TrimBox / BleedBox в metadata |
| **fontTools** | проверка глифов в TTF (особенно Ё и ❦) |
| **FOGRA39L_coated.icc** | ICC profile (стандартный, в `/usr/share/texlive/.../colorprofiles/`) |

**Шрифты в `~/.fonts/`:** Unbounded Regular/Bold/Black/Light · Spectral Regular/Italic/SemiBold · Caveat Regular · DejaVu Sans (для ❦).

## §4 · Build prepress · что делает для каждого артефакта

1. Берёт SVG-функцию из `build_sketches.py`.
2. **`k100_text()`** — заменяет `#1C1C1C` на `#000000` внутри `<text>` (Pure K=100, см. `typography-print.md`).
3. `wrap_with_prepress()`:
   - Outer SVG `viewBox="0 0 Vw Vh"`, где Vw = trim + 6мм bleed + 14мм margin.
   - Crop marks (8 штук, длина 5мм, gap 2мм от trim, K=100).
   - Registration marks (4 угла, ⌀4мм + крест, K=100).
   - **DIECUT layer** на trim-edge (`#FF00FF`, stroke 0.75, layer name `CutContour`).
   - Info-text `Заземли · {name} · Trim ... Bleed 3mm CMYK FOGRA39L`.
4. **cairosvg** → RGB PDF (vector, embedded fonts).
5. **Ghostscript ICC conversion** FOGRA39L_coated:
   ```bash
   gs -dNOPAUSE -dBATCH -dSAFER -sDEVICE=pdfwrite
      -sProcessColorModel=DeviceCMYK
      -sColorConversionStrategy=CMYK
      -sOutputICCProfile=FOGRA39L_coated.icc
      -dEmbedAllFonts=true -dSubsetFonts=true
      -dCompatibilityLevel=1.4
      -sOutputFile=out.pdf in.pdf
   ```
6. **Post-process content stream** (qpdf uncompress + regex):
   - Pattern «rich black для текста» → `0 0 0 1` (pure K=100).
   - Pattern «#FF00FF DIECUT» → `0 1 0 0` (pure M=100).
7. qpdf re-compress.
8. **pypdf set boxes:** TrimBox = trim-зона · BleedBox = +3мм · MediaBox = +7мм margin.

## §5 · Verify checklist (после каждого regen, обязательно)

| # | Что | Команда / результат |
|---|---|---|
| 5.1 | **Boxes** в metadata | `pypdf` → TrimBox = заявленный размер, BleedBox − TrimBox = 6мм |
| 5.2 | **CMYK** в content stream | `qpdf --qdf --stream-data=uncompress` + grep на `K`/`k` операторы. Должны быть `0 0 0 1 K` (текст), `0 1 0 0 K` (DIECUT). Нет `rg/RG` (RGB). |
| 5.3 | **Шрифты embedded + Cyrillic** | `pdffonts` → все строки `emb=yes sub=yes uni=yes` |
| 5.4 | **Fleuron ❦** | `DejaVuSans` должен быть в `pdffonts` output. Spectral НЕ содержит U+2766. |
| 5.5 | **TAC** (total area coverage) | `gs -sDEVICE=inkcov` → page-avg ≤ 280%. Если >280% — откатить rich black на C60/M55/Y55/K70 = 240%. |
| 5.6 | **Финальный one-liner** | Python script — проходит 33/33 PDF (см. PREPRESS_GUIDE §5.6). |

## §6 · Push в brand-kit

После успешного verify:

```bash
DST=/sessions/.../zazemli-brand-kit/maketi/partia-0
SRC=/sessions/.../zazemli-brand/maketi/_sketches-v5/print-v6-prepress
mkdir -p $DST
rm $DST/*.pdf 2>/dev/null
cp $SRC/*.pdf $DST/
```

**Обновить MANIFEST.txt:** версия → текущая, date → today, список 33 файлов, tech specs.

## §8 · Изменения от партии-0 к партии-1+

1. Создать новую папку `brand-kit/maketi/partia-N/`.
2. Если изменились SKU → обновить `LEAF_SKUS` в `build_sketches.py`.
3. Если изменились handscript-фразы → vectorize новые в `_sketches-v5/handscript/`.
4. Запустить полный pipeline.
5. Обновить N° в `medallion_v4` (партия-N → префикс N00 / N01 / etc).

## Правила применения

- **Триггер-фразы дословные** — если пользователь пишет «сделай pre-press» — это значит полный pipeline.
- **Verify обязателен** перед `cp` в brand-kit.
- **Source of truth** — `build_sketches.py` + `build_prepress.py`. PDF — output, не source.
- **При багах** — править source, не пытаться чинить PDF post-factum.

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Использовать Spectral для ❦ (глиф отсутствует).
- DIECUT на bleed-edge (стандарт = trim).
- Bone-fill на листовке (бумага сама даёт цвет).
- `#1C1C1C` для текста (rich black + misregistration на льне).
- RGB цвета в финальном PDF (Enjoyprint отклонит на preflight).
- Шрифты без `uni=yes` (кириллица сломается).
- Регенерировать PDF без verify — может уйти в типографию с битым TrimBox.

## Где это работает

- `05_production/print-brief.md` — что генерируется (33 PDF).
- `05_production/typography-print.md` — Charcoal split + Ё + fonts subset.
- `01_foundations/tokens.json` — RGB+CMYK токены.
- `01_foundations/iconography.md` — apothecary якоря.
- `04_patterns/print-web-bridge.md` — общие правила.
- `07_runbooks/` (Спринт 10) — будут более точечные runbooks (Verify single PDF, Replace SKU, etc).

## История версий

- v1.0.0 · 2026-05-16 · первый draft, источник PREPRESS_GUIDE.md v1.0 (26 апреля 2026).

## Заметка про дубль (для Спринта 11)

PREPRESS_GUIDE.md → ссылка `→ 05_production/prepress-workflow.md`. Сам PREPRESS_GUIDE.md остаётся в `Полиграфия/Принт-бриф/` как live-source для агента (можно линковать оттуда). **Сверх явных источников brand-v3** — новый артефакт.
