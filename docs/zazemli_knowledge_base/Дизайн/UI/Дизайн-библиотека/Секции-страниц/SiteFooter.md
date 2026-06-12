# SiteFooter · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §6.1.2

Organism слоя `03_components/organisms/`. Глобальный footer на charcoal-фоне.

## Что это

Одна из 1–2 dark-секций сайта. 3-grid (wordmark+слоган / nav / контакты) + ApothecaryBar + копирайт + Caveat-приписка.

## Роль в ДНК-четвёрке

Источник **02 Apothecary** (dark-фон, музейная серьёзность) + источник **04 Handscript** (Caveat «корни скажут спасибо», Spectral italic слоган). Использует apothecary-якорь 04 (`ApothecaryBar`). См. `02_voice/dna.md` §1, §7.

## Состав

| Слой | Что | Атом / molecule / token |
|---|---|---|
| Контейнер | `<footer bg-charcoal text-bone>` | `--surface-deep` |
| Wordmark + слоган | «ЗАЗЕМЛИ» (Unbounded black 3xl) + «Заземли себя.» (Spectral italic) | `logo-system.md` + `slogan-matrix.md` |
| Nav (2 колонки: Коллекция / Связь) | Списки ссылок | Label-стиль из `typography.md` (uppercase 0.25em) |
| Apothecary-разделитель | `<ApothecaryBar />` | `03_components/atoms/ApothecaryBar.md` |
| Bottom-row | копирайт + Caveat «корни скажут спасибо» | `03_components/atoms/CaveatNote.md` |

```jsx
function SiteFooter() {
  return (
    <footer class="bg-charcoal text-bone">
      <div class="max-w-screen-xl mx-auto px-6 py-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div class="font-unbounded font-black text-3xl">ЗАЗЕМЛИ</div>
            <div class="font-spectral italic text-base text-bone/55 mt-3">Заземли себя.</div>
          </div>
          <div>
            <h4 class="font-unbounded text-xs uppercase tracking-[0.25em] text-bone/40 mb-4">Коллекция</h4>
            <ul class="flex flex-col gap-2 font-unbounded text-sm">
              <li><a href="/collectio" class="text-bone/70 hover:text-bone">все растения</a></li>
              <li><a href="/lab" class="text-bone/70 hover:text-bone">лаборатория</a></li>
              <li><a href="/guide" class="text-bone/70 hover:text-bone">гайд по пересадке</a></li>
              <li><a href="/about" class="text-bone/70 hover:text-bone">о бренде</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-unbounded text-xs uppercase tracking-[0.25em] text-bone/40 mb-4">Связь</h4>
            <ul class="flex flex-col gap-2 font-unbounded text-sm">
              <li><a href="https://instagram.com/zazemli_collectio" class="text-bone/70 hover:text-bone">Instagram</a></li>
              <li><a href="https://t.me/zazemli_collectio" class="text-bone/70 hover:text-bone">Telegram</a></li>
              <li><a href="mailto:hello@zazemli.com" class="text-bone/70 hover:text-bone">hello@zazemli.com</a></li>
            </ul>
          </div>
        </div>

        <ApothecaryBar />

        <div class="flex items-center justify-between text-xs text-bone/40 font-unbounded">
          <span>© 2026 ИП Заземли · Москва</span>
          <span class="font-caveat text-base text-moss/60 -rotate-1">корни скажут спасибо</span>
        </div>
      </div>
    </footer>
  )
}
```

## Правила применения

- На странице **ровно 1 footer** (нижний). Не дублируется.
- Caveat в footer **НЕ считается** в счёт «2 Caveat на страницу» (глобальная chrome).
- Handle IG/TG обновлены 2026-05-13: `@zazemli_collectio` (см. master-brief §7.7).
- Опасити-шкала bone: bone/40 (captions) → bone/55 (слоган) → bone/70 (links default) → bone (hover/wordmark).
- Слоган «Заземли себя.» — Lvl 2 из `slogan-matrix.md`. Не подменять другими вариантами.
- Focus-state на всех ссылках — `outline 2px moss outline-offset 2px` (единое правило, см. `atoms/Button.md`).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- 3+ columns — на mobile 1 column, на desktop 3.
- Цветные ссылки.
- Newsletter-форма внутри footer (форма — отдельный organism `EmailSubscribeForm` molecule + Frame2x, в pre-footer секции).
- Декоративные иконки соцсетей (только текстовое название).
- Social-media follow-counts.

## Где это работает

- `01_foundations/logo-system.md` — wordmark.
- `01_foundations/slogan-matrix.md` — слоган «Заземли себя.» (Lvl 2).
- `01_foundations/typography.md` — Unbounded black 3xl, Spectral italic, uppercase tracking.
- `01_foundations/color-system.md` — charcoal, bone, moss.
- `03_components/atoms/ApothecaryBar.md` — apothecary якорь.
- `03_components/atoms/CaveatNote.md` — приписка.
- `03_components/atoms/Button.md` — единое правило focus-state.
- `01_foundations/brand-identity.md` — handle IG/TG.
- Используется в **каждом** template (Спринт 6).

## История версий

- v1.0.0 · 2026-05-14 · первый draft, источник DS v1.0 §6.1.2.

## Заметка про дубль (для Спринта 11)

DS v1.0 §6.1.2 → ссылка `→ 03_components/organisms/SiteFooter.md`.
