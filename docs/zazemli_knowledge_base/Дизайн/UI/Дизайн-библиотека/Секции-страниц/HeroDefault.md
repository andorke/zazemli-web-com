# HeroDefault · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §6.2.1 + brand-v3 §07.03 (WEB HERO LIGHT)

Organism слоя `03_components/organisms/`. Hero-секция главной страницы (light-вариант).

## Что это

Полноширокий hero на bone-фоне: KickerHeader + H1 (двойное прочтение) + Divider + Spectral italic подзаголовок + Button-pair + фоновый Doodle + закрывающий Caveat.

## Роль в ДНК-четвёрке

Источник **02 Apothecary** (KickerHeader, Divider, Spectral italic) + источник **04 Handscript** (Caveat + рукописный фоновый Doodle). Минимум 4 из 4 источников ДНК — это canonical hero (двойное прочтение «заземли растение, заземли себя» = воплощение dna §1). См. `02_voice/dna.md` §1, §7.

## Состав

| Слой | Что | Атом / molecule |
|---|---|---|
| Контейнер | `<section bg-bone py-24 md:py-32 relative>` | semantic-tokens |
| KickerHeader | `COLLECTIO ZAZEMLI · N°001 · ПАРТИЯ 0` | `atoms/KickerHeader.md` |
| H1 | «Заземли растение, заземли себя.» (Unbounded bold, clamp 2.5rem—4.75rem) | `01_foundations/typography.md` |
| Divider | decorative, w-14 (56px) | `atoms/Divider.md` |
| Подзаголовок | «Чем больше цифры — тем важнее земля.» (Spectral italic, moss/75) | `01_foundations/slogan-matrix.md` Lvl 3 |
| Buttons | primary + secondary | `atoms/Button.md` × 2 |
| Doodle | фоновый, SKU-цветной monstera-moss, opacity 0.15 | `atoms/Doodle.md` (способ A — `<img>`) |
| Caveat | «руки в землю — голова свободна» (brand-signature, lg, moss/60) | `atoms/CaveatNote.md` |

```jsx
function HeroDefault() {
  return (
    <section class="bg-bone py-24 md:py-32 relative">
      <div class="max-w-screen-xl mx-auto px-6 text-center">
        <KickerHeader brand="COLLECTIO ZAZEMLI" serial="N°001" slug="ПАРТИЯ 0" />

        <h1
          class="font-unbounded font-bold text-charcoal/80 leading-none tracking-tight mt-6"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4.75rem)' }}
        >
          Заземли растение,<br/>заземли себя.
        </h1>

        <Divider variant="decorative" class="my-10 mx-auto w-14" />

        <p class="font-spectral italic text-lg md:text-xl text-moss/75 max-w-prose mx-auto">
          Чем больше цифры — тем важнее земля.
        </p>

        <div class="mt-12 flex flex-wrap justify-center gap-4">
          <Button variant="primary">Посмотреть коллекцию</Button>
          <Button variant="secondary">Подписаться на дневник</Button>
        </div>

        <img
          src="/assets/doodles/colored/monstera-moss.svg"
          class="absolute top-1/2 left-8 w-32 opacity-15 -translate-y-1/2 hidden md:block"
          alt=""
        />

        <span class="font-caveat text-lg text-moss/60 mt-12 inline-block -rotate-1">
          руки в землю — голова свободна
        </span>
      </div>
    </section>
  )
}
```

## Правила применения

- **Только** на `/` (главная). Для других templates — другие Hero (HeroWhisper для `/about`, KickerHeader+H1 для SKU-страниц).
- H1 — двойное прочтение, фиксированный текст из `slogan-matrix.md`. Не подменять.
- Caveat считается **1 на страницу** в контентной зоне. Если на главной появляется ещё Caveat в другой секции — здесь убрать.
- KickerHeader — слаг «ПАРТИЯ 0» меняется при выпуске новых партий (через переменную окружения).
- Mobile: padding `py-24`, desktop `py-32`. Doodle скрыт на mobile.
- Focus-state на Button — единое правило (см. `atoms/Button.md`): `outline 2px moss outline-offset 2px`.

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Видео-фон в hero.
- Параллакс / анимация на scroll.
- 3+ Button в hero (только pair).
- Картинку продукта в hero (только doodle).
- H1 в SKU-цвете (всегда charcoal/80).

## Где это работает

- `01_foundations/dna.md` §1 — canonical hero (двойное прочтение).
- `01_foundations/slogan-matrix.md` — H1 Lvl 1 + подзаголовок Lvl 3.
- `01_foundations/typography.md` — Unbounded bold clamp.
- `01_foundations/color-system.md` — bone, charcoal/80, moss/75.
- `03_components/atoms/`: KickerHeader, Divider, Button, Doodle, CaveatNote.
- Используется только в template `/` (Спринт 6).

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §6.2.1.

## Заметка про дубль (для Спринта 11)

DS v1.0 §6.2.1 → ссылка `→ 03_components/organisms/HeroDefault.md`. brand-v3 §07.03 «WEB HERO LIGHT» — пример композиции остаётся как application gallery.
