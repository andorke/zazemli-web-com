# RitualSequence · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §6.4 + brand-v3 §15 (ритуал-нумерация)

Organism слоя `03_components/organisms/`. Универсальный контейнер ритуала — 4-сетка шагов + ApothecaryBar + closing.

## Что это

Принимает массив `steps`, рендерит grid из `RitualStep` molecules + apothecary-разделитель + Spectral italic closing + Button-pair. Универсален для любого ритуала линейки (пересадка, подкормка, укоренение). MVP — 4 шага пересадки.

## Роль в ДНК-четвёрке

Источник **02 Apothecary** (ApothecaryBar, серийная нумерация 00/01/02/03) + источник **04 Handscript** (через RitualStep hint в Caveat) + источник **03 Naturalist** (привязка к физическим материалам коробки). См. `02_voice/dna.md` §1, §7.

## Состав

| Слой | Что | Атом / molecule |
|---|---|---|
| Контейнер | `<section py-24 bg-chalk>` | semantic-tokens (`--surface-chalk`) |
| Grid | 1col mobile / 2col tablet / 4col desktop, gap-2 | `molecules/RitualStep.md` × N |
| Apothecary-разделитель | `<ApothecaryBar />` | `atoms/ApothecaryBar.md` |
| Closing | Spectral italic «Поставь растение в полутень...» | `01_foundations/voice-principles.md` |
| Button-pair | primary + secondary | `atoms/Button.md` × 2 |

```jsx
function RitualSequence({ steps, closing, ctaPrimary, ctaSecondary }) {
  return (
    <section class="py-24 bg-chalk">
      <div class="max-w-screen-xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {steps.map(s => <RitualStep key={s.number} {...s} />)}
        </div>

        <ApothecaryBar />

        <div class="text-center">
          <p class="font-spectral italic text-lg text-charcoal/70 max-w-prose mx-auto">
            {closing}
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <Button variant="primary">{ctaPrimary}</Button>
            <Button variant="secondary">{ctaSecondary}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**MVP-набор шагов (4):**
- 00 ПРИХОД — «Достань коробку. Поставь на стол. Выдохни.» hint: «можно не торопиться» — `isFirst={true}` (moss-фон)
- 01 ЗАБОТА ДЛЯ КОРНЕЙ И РУК — «Надень перчатки. Приготовь корневин.» hint: «перчатки + корневин»
- 02 НАДЁЖНЫЙ ДРЕНАЖ — «Уложи керамзит слоем 1.5–2 см.» hint: «белый пакет без окошка»
- 03 ВКУСНЫЙ ГРУНТ — «Засыпь смесь на 2/3 объёма. Посади. Полей.» hint: «белый пакет с окошком»

> **MVP-уточнение:** «00 ПРИХОД» (льняной мешочек) — **v2** со следующей партии. В партии 0 ритуал начинается с 01, и `isFirst` переезжает на 01.

## Правила применения

- **Heading не входит в organism** — KickerHeader + H2 даёт page-level template (например, /guide или /collectio/[plant]). Это позволяет переиспользовать RitualSequence на разных страницах с разными заголовками.
- Минимум 3 шага (иначе теряет «ритуальность»), максимум 6 (иначе перестаёт читаться в grid).
- На /guide — closing «Поставь растение в полутень на 3–5 дней. Дальше — наблюдай.»
- На /collectio/[plant] (блок «что в боксе») — closing зависит от SKU.
- `isFirst` — ровно один шаг (стартовый получает moss-фон).
- Mobile — 1 column. Tablet — 2 column (по 2 шага в ряд). Desktop — 4 column в ряд.
- Focus-state на Button — единое правило (см. `atoms/Button.md`).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Заголовок секции внутри organism (это даёт template).
- Анимация появления шагов на scroll.
- Stepper с круглыми точками / прогресс-баром (это не wizard, а ритуал-описание).
- Carousel шагов (всегда видны все одновременно).
- Чекбоксы / «отметить выполнено» (не TODO-лист).
- Длинные description (>2 предложений на шаг — см. `RitualStep.md` правила).

## Где это работает

- `03_components/molecules/RitualStep.md` — шаги.
- `03_components/atoms/`: ApothecaryBar, Button.
- `01_foundations/dna.md` §1.1.1 — линейка ритуалов.
- `05_production/box-layers.md` — физическое соответствие шагов уровням коробки (00 ↔ уровень 06, 01 ↔ уровень 04 чёрный конверт, 02 ↔ уровень 02 дренаж, 03 ↔ уровень 03 грунт).
- Используется в templates: `/guide`, `/collectio/[plant]` (Спринт 6).

**Пример page-level использования (template `/guide`):**

```jsx
<KickerHeader brand="ГАЙД" serial="N° 001" slug="пересадка" />
<h1 class="font-unbounded font-bold text-4xl md:text-5xl text-center mt-6 mb-4">
  Ритуал пересадки
</h1>
<p class="font-spectral italic text-lg text-charcoal/60 text-center max-w-prose mx-auto mb-16">
  Четыре шага. Двадцать минут. Растение спасибо скажет.
</p>

<RitualSequence
  steps={transplantSteps}
  closing="Поставь растение в полутень на 3–5 дней. Дальше — наблюдай."
  ctaPrimary="Посмотреть коллекцию"
  ctaSecondary="Подписаться на дневник"
/>
```

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §6.4.

## Заметка про дубль (для Спринта 11)

DS v1.0 §6.4 → ссылка `→ 03_components/organisms/RitualSequence.md`. brand-v3 §15 «ритуал-нумерация 00-03» — пример composition остаётся, добавляется cross-ref на этот organism.
