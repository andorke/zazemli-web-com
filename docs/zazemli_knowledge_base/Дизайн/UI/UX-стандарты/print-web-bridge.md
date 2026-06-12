# print-web-bridge · Версия: 1.0.0 · Дата: 2026-05-16 · Источник: DS v1.0 §8 (целиком)

Pattern слоя `04_patterns/`. Мост между печатными артефактами (медальоны, листовки, дневник) и веб-страницами. Главное правило: один и тот же воспринимаемый «вес» при разных кеглях.

## Что это

Кросс-канальная консистентность. Каждый apothecary-якорь, каждый kicker, каждый Caveat — один и тот же визуальный паттерн в печати и в вебе. Покупатель распознаёт бренд независимо от носителя.

## Роль в ДНК-четвёрке + канал обучения

Источник **02 Apothecary** (sparse-якоря, серийная нумерация, музейная строгость) + источник **03 Naturalist** (дудлы как материальный язык). Канал обучения: **этот pattern — про сам бренд-узнаваемость**, не про обучение конкретного канала. См. `02_voice/dna.md` §1, §7.

## 4 моста печать ↔ веб

### Мост 1 · Типографика

| Печать | Веб-эквивалент | Связь |
|---|---|---|
| Медальон ⌀100мм wordmark «МОНСТЕРА» (Unbounded 900 ~22pt) | H1 страницы растения (Unbounded 700 text-4xl 48px) | Одна и та же воспринимаемая «громкость» |
| Листовка «РУКИ В ЗЕМЛЮ» (Unbounded 700) | Hero Lvl-2 на главной (опция) | Слоган-матрёшка Lvl 2 |
| COLLECTIO ZAZEMLI на дневнике (Unbounded 500 11pt ls 2) | `KickerHeader` atom | Та же шапка, тот же tracking |
| N° 001 на медальоне (Spectral italic 36pt) | `SerialNumber` atom | Один и тот же стиль и формула |
| Caveat «корни скажут спасибо» на листовке | `CaveatNote` atom (brand-signature) | Один и тот же rotate −1°, тот же кегль |

### Мост 2 · Apothecary-якоря (пятёрка)

| Печать (brand-v3 §03.5) | Веб-компонент | Где живёт |
|---|---|---|
| COLLECTIO-шапка | `KickerHeader` | atoms/KickerHeader.md |
| N°[партия][SKU] | `SerialNumber` | atoms/SerialNumber.md |
| 2-frame рамка | `Frame2x` | atoms/Frame2x.md |
| Apothecary-bar (hairline·dot·❦·dot·hairline) | `ApothecaryBar` | atoms/ApothecaryBar.md |
| Fleuron ❦ | `Fleuron` | atoms/Fleuron.md |

### Мост 3 · Слоган-матрёшка (Lvl × страница)

| Lvl | Слоган | Веб-страница |
|---|---|---|
| 0 | «Заземли себя.» | `SiteFooter`, favicon-подпись |
| 1 | «Ритуал пересадки.» | Подзаголовок секции `/collectio` |
| 2 | «Руки в землю. Голова свободна.» | Опционально в hero (альтернатива) |
| 3 | «Заземли растение, заземли себя.» (без префикса «Ритуал пересадки:» — выбор Насти) | H1 главной `/` · эпиграф `/about` |
| 4 | Манифест 4 строки | Тело `/about` |

### Мост 4 · Дудлы — единый язык

Один набор SVG используется и в печати, и в вебе:
- `assets/doodles/colored/` — SKU-цветные (7 растений). В печати — на медальоне Ø100мм, на листовке. В вебе — Hero страницы SKU, фоновые акценты.
- `assets/doodles/` — универсальные ч-б (листик, корни, лопата). В вебе через inline SVG `currentColor`.

**Opacity-шкала (веб):**
- 10–25% — фон (background watermark).
- 50–80% — акцент (separator, footer-decor).
- 80–100% — hero / карточка SKU.

## Различия (что НЕ переносится)

| Веб | Печать | Почему |
|---|---|---|
| RGB hex `#1C1C1C` | CMYK halftone | Принтер не понимает RGB. Пре-пресс берёт CMYK из `01_foundations/tokens.json` поля `cmyk`. |
| Subpixel `border-[0.5px]` | 0.25pt линия | Линия <0.25pt не печатается. Минимум для print — 0.25pt. |
| `opacity 0.15` для bg-doodle | Halftone 15% | Печатник конвертирует opacity → halftone-pattern. Тёмная бумага требует выше %. |
| Hover / focus | — | В печати нет интерактивности. |
| Spectral italic 14px | 7pt Spectral italic | Печать читает мельче, минимум web 12px / print 7pt. |

## Правила применения

- **Соответствие — обязательно.** Если на странице SKU используется `KickerHeader` — на медальоне SKU должна быть та же формула «COLLECTIO ZAZEMLI · N° XXX · {latin}».
- **Опасити-шкала дудлов** — фиксированная для веба, переводится в halftone% для печати.
- **При создании нового печатного артефакта** — сверять с этим документом + `05_production/box-layers.md` (для физических уровней коробки).
- **При создании нового веб-компонента** — сверять с `01_foundations/iconography.md` apothecary семейство.

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Печатать веб-only элементы (например, hover-state на медальоне).
- Использовать в вебе шрифты, которых нет в `01_foundations/typography.md` (только Unbounded / Spectral / Caveat).
- Цветной wordmark в печати (всегда charcoal или bone).
- Halftone-узор как «текстура» (только для opacity-конверсии).

## Где это работает

- `01_foundations/tokens.json` — общие токены RGB + CMYK.
- `01_foundations/typography.md` — общая типографика.
- `01_foundations/color-system.md` — палитра + конверсия RGB↔CMYK.
- `01_foundations/iconography.md` — apothecary семейство.
- `01_foundations/slogan-matrix.md` — Lvl слоганов.
- `01_foundations/logo-system.md` — wordmark.
- `03_components/atoms/`: KickerHeader, SerialNumber, Frame2x, ApothecaryBar, Fleuron, CaveatNote, Doodle.
- `05_production/box-layers.md` — физические уровни коробки.
- `05_production/print-stickers.md` (Спринт 8) — печатные стикеры 01/02/03.
- `05_production/marketplace-card.md` (Спринт 8) — карточка Ozon с печатными медальонами.

## История версий

- v1.0.0 · 2026-05-16 · первый draft, источник DS v1.0 §8 (целиком — 4 подсекции).

## Заметка про дубль (для Спринта 11)

DS v1.0 §8 → ссылка `→ 04_patterns/print-web-bridge.md`. brand-v3 §03.5 apothecary якоря — семантика остаётся, добавляется cross-ref на этот pattern.
