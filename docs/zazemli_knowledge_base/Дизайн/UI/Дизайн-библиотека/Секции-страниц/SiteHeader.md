# SiteHeader · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §6.1.1

Organism слоя `03_components/organisms/`. Sticky-шапка сайта.

## Что это

Глобальная chrome-шапка: wordmark + nav (коллекция · лаборатория · гайд · о бренде) + опциональная Caveat-приписка справа. Светлая (bone-фон).

## Роль в ДНК-четвёрке

Источник **02 Apothecary** (sparse, тонкая нижняя линия charcoal/15) + источник **04 Handscript** через опциональный Caveat «заземлись» (moss/60). См. `02_voice/dna.md` §1, §7.

## Состав

| Слой | Что | Атом / molecule / token |
|---|---|---|
| Контейнер | `<header sticky top-0 z-50 bg-bone border-b border-charcoal/15>` | semantic-tokens `--surface-page`, `--divider-color` |
| Wordmark | `ЗАЗЕМЛИ` (Unbounded medium 16px, charcoal/80) | `logo-system.md` |
| Nav | 4 ссылки. Не выносим в отдельный atom — простой `<a>` достаточно. | inline `<a>` |
| Caveat (опц.) | «заземлись» moss/60, hidden md:inline | `CaveatNote` (variant brand-signature, размер уменьшен до base) |

```jsx
function SiteHeader() {
  return (
    <header class="sticky top-0 z-50 bg-bone border-b border-charcoal/15">
      <div class="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" class="font-unbounded font-medium text-base tracking-tight text-charcoal/80">
          ЗАЗЕМЛИ
        </a>
        <nav class="flex gap-8">
          <a href="/collectio" class="font-unbounded text-sm text-charcoal/70 hover:text-charcoal">коллекция</a>
          <a href="/lab"        class="font-unbounded text-sm text-charcoal/70 hover:text-charcoal">лаборатория</a>
          <a href="/guide"      class="font-unbounded text-sm text-charcoal/70 hover:text-charcoal">гайд</a>
          <a href="/about"      class="font-unbounded text-sm text-charcoal/70 hover:text-charcoal">о бренде</a>
        </nav>
        <span class="font-caveat text-base text-moss/60 hidden md:inline-block -rotate-1">
          заземлись
        </span>
      </div>
    </header>
  )
}
```

## Правила применения

- Sticky — `top-0 z-50`. Не убирать на скролл-down (нет hide-on-scroll анимаций).
- Nav в lower-case (TOV-друг тон). На SKU-страницах не подсвечивать активный пункт цветом — только opacity (charcoal/70 → charcoal).
- Caveat в header **НЕ считается** в счёт «2 Caveat на страницу» (это глобальная chrome).
- Mobile (≤ md): nav сворачивается в drawer (реализация в Спринте 7 / templates). Caveat hidden.
- Focus-state на всех интерактивных элементах (wordmark-link, nav-links) — `outline 2px moss` (см. `atoms/Button.md` единое правило focus).
- Skip-link для a11y — на page-level template (sibling header), не в самом organism.

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Активный link в SKU-цвете (только opacity).
- Hide-on-scroll анимация.
- Дополнительные элементы (корзина, поиск, language switcher) — нет на MVP.
- Caveat в SKU-цвете в header (всегда moss).

## Где это работает

- `01_foundations/logo-system.md` — wordmark стиль.
- `01_foundations/semantic-tokens.md` — `--surface-page`, `--divider-color`.
- `01_foundations/typography.md` — Unbounded medium 16px / text-sm 14px.
- `03_components/atoms/CaveatNote.md` — опциональная приписка.
- `03_components/atoms/Fleuron.md` — может появиться перед wordmark (опционально).
- `03_components/atoms/Button.md` — единое правило focus-state.
- Используется в **каждом** template (Спринт 6).

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §6.1.1.

## Заметка про дубль (для Спринта 11)

DS v1.0 §6.1.1 → ссылка `→ 03_components/organisms/SiteHeader.md`.
