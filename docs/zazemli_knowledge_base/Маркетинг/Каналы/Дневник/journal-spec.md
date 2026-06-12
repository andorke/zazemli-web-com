# journal-spec · Версия: 1.0.0 · Дата: 2026-05-16 · Источник: dnevnik-{sku}-final.html × 7 SKU + master-brief §3.1 + §10.C

Production-спека слоя `05_production/`. Дневник растения «Один год рядом» — **template на 7 SKU**. Шаблон + variations (по образцу `organisms/HeroSKU.md`).

## Что это

Дневник в коробке (уровень 05 по `box-layers.md`). Содержательная единица: 1 общий шаблон страниц + 7 SKU-вариаций (наполнение специфичное для растения).

## Роль в ДНК-четвёрке

Все 4 источника ДНК: **01 Natural-Botanical** (биотоп растения) + **02 Apothecary** (KickerHeader, SerialNumber, страницы по аптекарскому ритму) + **03 Naturalist** (печать на uncoated, тактильность) + **04 Handscript** (Caveat-приписки в SKU-цвете). См. `02_voice/dna.md` §1, §7.

## Структура (1 общий шаблон, ~22 страницы)

| # | Страница | Назначение | SKU-специфика |
|---|---|---|---|
| **I** | Обложка | Wordmark «ЗАЗЕМЛИ» + SerialNumber N° + название SKU + Caveat-приписка | Имя + N° + дудл + Caveat |
| **II** | Welcome + QR | «Привет. Записала тебя в дневник.» + QR `diary-signup` | Имя растения |
| **III** | Биотоп | Spectral italic narrative (2-3 абзаца) про природный биотоп | Биотоп конкретного SKU |
| **IV-V** | Рецептура | MaterialsGrid 11 компонентов с % для этого SKU | % компонентов |
| **VI** | Ритуал пересадки | 4 RitualStep в печатном формате (00 ПРИХОД / 01 / 02 / 03) | Универсально |
| **VII** | Календарь ухода | 12 месяцев + что делать (поливать, удобрять, пересаживать) | По SKU |
| **VIII-XI** | Дневник (4 разворота) | Пустые страницы для записей наблюдений (1 страница на сезон) | Универсально |
| **XII** | Признаки тревоги | Что НЕ норма (пожелтение, пятна, опадание). Spectral italic | По SKU частично |
| **XIII-XX** | Дневник продолжение (8 разворотов) | Пустые страницы наблюдений | Универсально |
| **XXI** | «Через год» | «+365 дней — пора в новую землю» + QR `collectio` | Универсально |
| **XXII** | Колофон | Tech specs, кто делал, год | Универсально |

## 7 SKU-вариаций (фактически в `~/Documents/.../ЗАЗЕМЛИ/`)

| SKU | Файл (HTML мокап) | Размер | Дата |
|---|---|---|---|
| 001 Монстера | `dnevnik-monstera-final.html` | 69 KB | 2026-05-16 13:24 |
| 002 Фикус | `dnevnik-ficus-final.html` | 72 KB | 2026-05-16 12:32 |
| 003 Антуриум | `dnevnik-anturium-final.html` | 71 KB | 2026-05-16 12:32 |
| 004 Аглаонема | `dnevnik-aglaonema-final.html` | 72 KB | 2026-05-16 12:32 |
| 005 Спатифиллум | `dnevnik-spatifillum-final.html` | 70 KB | 2026-05-16 12:32 |
| 006 Замиокулькас | `dnevnik-zamiokulkas-final.html` | 67 KB | 2026-05-16 13:56 |
| 007 Эпипремнум | `dnevnik-epipremnum-final.html` | 70 KB | 2026-05-16 12:32 |

## Производственные параметры

| Параметр | Значение |
|---|---|
| Формат | A5 (148×210 мм) |
| Объём | ~22 страницы (11 разворотов) |
| Бумага обложки | Плотный uncoated 300 гр (тот же лён, что у листовки) |
| Бумага внутренних | Uncoated 120-150 гр (для записей шариковой/гелевой ручкой) |
| Печать | Двусторонняя (CMYK FOGRA39L) |
| Переплёт | Скрепка (центральная), 4 скобы |
| Стоимость | **~212.73 ₽/шт** (master-brief §6.5 — крупнейшая позиция, 35% продуктовых) |
| Тираж партии 0 | 550 шт = 117 000 ₽ |
| Оптимизация | 🟡 master-brief §6.5: если урезать до ~100 ₽/шт → +5 п.п. маржи + ~62к ₽ экономии. Решается по партии 1+. |

## Variation system (по образцу HeroSKU)

```jsx
function Dnevnik({ sku }) {
  // sku = { number, name, latin, color, biotope, recipe, calendar, anxietySigns }
  return (
    <Book>
      <PageCover sku={sku} />                    // I
      <PageWelcome sku={sku} />                  // II
      <PageBiotope text={sku.biotope} />         // III
      <PageRecipe materials={sku.recipe} />      // IV-V
      <PageRitual />                              // VI (универсально)
      <PageCalendar months={sku.calendar} />     // VII
      <PageDiary count={4} />                     // VIII-XI (пустые)
      <PageAnxiety signs={sku.anxietySigns} />   // XII
      <PageDiary count={8} />                     // XIII-XX
      <PageThroughYear />                         // XXI (универсально)
      <PageColophon />                            // XXII
    </Book>
  )
}
```

**Source of truth для variations:**
- `sku.biotope` — `Продукт/Рецептуры/Заземли_научное_обоснование_рецептур.md` (343 строки)
- `sku.recipe` — то же
- `sku.calendar` — TBD (нужен экспертный input от Насти, агро-гид)
- `sku.anxietySigns` — TBD (то же)

## Правила применения

- **Один template на 7 SKU** — 7 финальных PDF генерируются из одного исходника через `sku` config.
- **SKU-цвет** проявляется через: обложка-Caveat + биотоп-headline + Caveat на стр XXI.
- **Универсальные страницы** (VI, VIII-XI, XIII-XX, XXI, XXII) — идентичны для всех 7 SKU.
- **QR `diary-signup`** на стр II — обязательно, ведёт на `/diary-signup` с UTM `utm_source=qr&utm_medium=dnevnik&utm_content={sku}`.
- **QR `collectio`** на стр XXI — обязательно для «окошка в следующую коллекцию» (dna §1.1.1).
- **Стр XII «Признаки тревоги»** — частично SKU-специфична (биология растения), частично универсальна (общие симптомы переувлажнения).
- Все типографские правила — по `typography-print.md` (Charcoal split, Ё, fonts subset).
- Все pre-press — по `prepress-workflow.md` (если генерируется через build_prepress).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Глянцевая бумага (только uncoated — apothecary-тактильность).
- Цветной фон страниц (только bone/chalk).
- Маркетинговые блоки внутри дневника («купите ещё»).
- QR без подписи (см. `qr-system.md` правила).
- 7 разных дизайнов под 7 SKU (только variations через config).
- Жёсткий переплёт (нет на MVP — скрепка достаточно).

## Где это работает

- `~/Documents/.../ЗАЗЕМЛИ/dnevnik-{sku}-final.html` × 7 — actuell HTML-мокапы.
- `Продукт/Рецептуры/Заземли_научное_обоснование_рецептур.md` — биотоп + recipe.
- `05_production/box-layers.md` — уровень 05 в коробке.
- `05_production/typography-print.md` — Charcoal split + Ё.
- `05_production/prepress-workflow.md` — automation.
- `05_production/qr-system.md` — QR `diary-signup` + QR `collectio`.
- `03_components/molecules/MaterialsGrid.md` — для стр IV-V.
- `03_components/molecules/RitualStep.md` — для стр VI.
- `01_foundations/dna.md` §1.1.1 — «дневник = окошко в следующие коллекции».
- master-brief §6.5 — стоимость + оптимизация.

## История версий

- v1.0.0 · 2026-05-16 · первый draft. 7 SKU финальных HTML собраны 2026-05-16 (monstera + zamiokulkas — последние). Закрывается brand-v3 §15.5 как устаревший.

## Заметка про дубль (для Спринта 11)

brand-v3 §15.5 «Дневник натуралиста» → ссылка `→ 05_production/journal-spec.md`. 7 HTML-файлов в `~/Documents/.../ЗАЗЕМЛИ/dnevnik-{sku}-final.html` — основной источник. master-brief §3.1 (что внутри коробки, уровень дневника) — добавляется cross-ref.

**Кандидаты на v1.1:** TBD-секции `sku.calendar` и `sku.anxietySigns` нуждаются в агро-экспертном input. Записать в бэклог.
