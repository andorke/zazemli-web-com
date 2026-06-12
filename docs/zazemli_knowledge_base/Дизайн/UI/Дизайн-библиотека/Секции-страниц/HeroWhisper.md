# HeroWhisper · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §6.2.2 + brand-v3 §07.06 (WHISPER MODE) + molecule WhisperHero (Спринт 3)

Organism слоя `03_components/organisms/`. Hero-секция в whisper-режиме — для `/about` и манифесто-страниц.

## Что это

Тонкая section-обёртка вокруг molecule `WhisperHero` (Спринт 3). Organism отвечает за page-уровень: padding, bg, container, опциональные secondary-элементы (KickerHeader сверху, Button-row снизу). Композиция «шёпотных» фраз — внутри molecule.

**Разделение ответственностей (решение 2026-05-14):**
- `molecules/WhisperHero.md` — композиция Fleuron + WhisperPhrase × 4 + Wordmark.
- `organisms/HeroWhisper.md` — section-обёртка для template-уровня (padding, container, опциональный CTA).

## Роль в ДНК-четвёрке

Источник **04 Handscript** (доминирует — это «шёпот»: рукописная наивность через WhisperPhrase) + источник **02 Apothecary** (контейнер-section, sparse layout). См. `02_voice/dna.md` §1, §7.

## Состав

| Слой | Что | Атом / molecule |
|---|---|---|
| Контейнер | `<section bg-bone py-32 relative>` | semantic-tokens |
| KickerHeader (опц.) | для `/about` — `MANIFESTO ZAZEMLI · N° 001` | `atoms/KickerHeader.md` |
| WhisperHero molecule | Wordmark + Fleuron + 4× WhisperPhrase | `molecules/WhisperHero.md` |
| Button-pair (опц.) | для manifesto — secondary + ghost | `atoms/Button.md` × 2 |
| Фоновый Doodle (опц.) | mono inline SVG, opacity 0.10, charcoal currentColor | `atoms/Doodle.md` (способ B) |

```jsx
function HeroWhisper({ withKicker = false, withCTA = false }) {
  return (
    <section class="bg-bone py-32 relative">
      <div class="max-w-screen-xl mx-auto px-6 text-center">
        {withKicker && (
          <KickerHeader brand="MANIFESTO ZAZEMLI" serial="N° 001" slug="о бренде" />
        )}

        <WhisperHero
          wordmark="ЗАЗЕМЛИ"
          phrases={[
            { dir: 'forward', text: 'подышать землёй' },
            { dir: 'forward', text: '11 компонентов внутри' },
            { dir: 'back', text: 'монстера, фикус, калатея' },
            { dir: 'back', text: 'всё для одного горшка' },
          ]}
        />

        {withCTA && (
          <div class="mt-12 flex flex-wrap justify-center gap-4">
            <Button variant="secondary">Посмотреть коллекцию</Button>
            <Button variant="ghost">Подписаться на дневник</Button>
          </div>
        )}

        <Doodle
          variant="mono"
          name="leaf-curl"
          class="absolute bottom-12 right-12 w-24 text-charcoal opacity-10"
        />
      </div>
    </section>
  )
}
```

## Правила применения

- **Только** для `/about` и манифесто-страниц. Для `/` (главная) — `HeroDefault`.
- Если используется на `/about` — `withKicker={true}` + `withCTA={false}` (manifesto не призывает к покупке, призывает к чтению).
- Если используется на лендингах рассылок — `withCTA={true}` со secondary + ghost.
- Caveat в этом organism НЕТ — шёпот через WhisperPhrase достаточно.
- Focus-state на Button — единое правило (см. `atoms/Button.md`): `outline 2px moss outline-offset 2px`.

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Caveat внутри HeroWhisper (двойной «рукописный шум»).
- SKU-цветной Doodle (этот organism нейтральный, не привязан к SKU).
- Primary Button (это manifesto, не продажа).
- Анимация на scroll / typewriter эффекты для WhisperPhrase.
- KickerHeader с латынью «observatio» (см. anti-patterns §latin).

## Где это работает

- `03_components/molecules/WhisperHero.md` — внутренняя композиция.
- `03_components/atoms/`: KickerHeader, Button, Doodle.
- `01_foundations/dna.md` §1 — источник 04 Handscript.
- `01_foundations/typography.md` — Unbounded light для WhisperPhrase.
- Используется в templates: `/about`, лендинги рассылок (Спринт 6).

## История версий

- v1.0.0 · 2026-05-14 · первый draft. Источник DS v1.0 §6.2.2 (ссылается на WhisperHero molecule). Решение 2026-05-14: organism = тонкая обёртка для template-уровня (вариант B при выборе разделения слоёв).

## Заметка про дубль (для Спринта 11)

DS v1.0 §6.2.2 («См. WhisperHero в §5.3.2») → ссылка `→ 03_components/organisms/HeroWhisper.md`. Уточнение: в DS §6.2.2 будет 2 ссылки — на molecule (для композиции) и на organism (для section-обёртки). brand-v3 §07.06 «WHISPER MODE» — application gallery, остаётся.
