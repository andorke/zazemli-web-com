# guide (`/guide`) · Версия: 1.0.0 · Дата: 2026-05-16 · Источник: DS v1.0 §7.5

Template слоя `03_components/templates/`. Гайд по пересадке — 15-минутный ритуал.

## Что это

Универсальный гайд пересадки (не зависит от SKU). 4 шага ритуала + что подготовить + что после. Цель — снять страх перед пересадкой, дать чёткий план, сконвертировать в подписку на дневник.

## Роль в ДНК-четвёрке + канал обучения

Источник **02 Apothecary** (нумерация 00/01/02/03) + источник **03 Naturalist** (физические материалы как тактильные клейма) + источник **04 Handscript** (Caveat «корни скажут спасибо», hint в RitualStep). Канал обучения: **сайт — глубоко обучаем**, гайд балансирует /lab — там интеллект, тут ритуал. См. `02_voice/dna.md` §1, §7 + master-brief §7.5.

**v2+ note:** В будущем `/guide` превращается в hub `/rituals/` с дочерними `/rituals/peresadka`, `/rituals/podkormka`, `/rituals/ukorenenie`, `/rituals/reanimatsiya` (см. dna.md §1.1.1 линейка ритуалов). На MVP — единственная страница про пересадку.

## URL + SEO meta

| Поле | Значение |
|---|---|
| URL | `/guide` (v2+ → `/rituals/peresadka`) |
| `<title>` | `Пересадка растения за 15 минут · ритуал · ЗАЗЕМЛИ` |
| `<meta description>` | `Гайд по пересадке. 4 шага. 15 минут. Перчатки, корневин, дренаж, грунт. Растение спасибо скажет.` |
| OG image | `/og/guide-1200x630.jpg` (4 RitualStep карточки) |
| canonical | `https://zazemli.com/guide` |
| Schema.org | `HowTo` (totalTime: PT15M, steps: 4 HowToStep) |

## Композиция organisms

```
<SiteHeader />
<section class="bg-bone hero-simple">                    // упрощённый hero, регистр Наставник
  <KickerHeader brand="РИТУАЛ ПЕРЕСАДКИ" />
  <h1>Пересадка растения за 15 минут</h1>
  <p class="font-spectral italic">Четыре шага. Перчатки в комплекте. Без паники.</p>
</section>

<section class="bg-bone">                                 // «Что приготовить», регистр Наставник
  <h3>Что подготовить</h3>
  <ol>
    <li>Пустой горшок (на размер больше)</li>
    <li>Газета на стол</li>
    <li>Стакан воды</li>
  </ol>
</section>

<RitualSequence
  steps={transplantSteps}
  closing="Поставь растение в полутень на 3–5 дней. Дальше — наблюдай."
  ctaPrimary="Посмотреть коллекцию"
  ctaSecondary="Подписаться на дневник"
/>                                                        // organism — основной блок, chalk
<ApothecaryBar />

<section class="bg-bone">                                 // «После пересадки», регистр Подруга
  <h3>Дальше</h3>
  <p class="font-spectral italic">3–5 дней в полутени. Не поливать сразу. Не дёргать — пусть приживается.</p>
  <CaveatNote variant="brand-signature">корни скажут спасибо</CaveatNote>
  <Button variant="primary" as="a" href="/diary-signup">Подписаться на дневник</Button>
</section>

<SiteFooter />
```

## Page-specific data

- `transplantSteps` — массив 4 RitualStep (универсальный, см. `organisms/RitualSequence.md`).
- HowTo Schema.org — структурирована так, чтобы Google показал steps в выдаче (rich snippet).

## Правила применения

- Schema.org `HowTo` обязателен — даст rich-snippet в Google «Как пересадить растение?».
- Без SKU-привязки (`data-sku` неактивен, `--accent-sku` дефолт moss).
- Аналитика: `view_guide`, `scroll_to_step_{00-03}`, `click_diary_from_guide`, `click_collectio_from_guide`.
- UTM: на CTA-кнопках («Подписаться на дневник», «Посмотреть коллекцию») — `utm_source=site&utm_medium=guide&utm_campaign=ritual_peresadka`. Параметр `utm_content` различает CTA-источник внутри страницы (`hero`, `closing`, `aftercare`).
- Caveat-лимит: 1 в content-zone («корни скажут спасибо»).
- В v2+ — добавятся другие ритуалы под маршрутом `/rituals/`. Этот template станет parent-layout для `/rituals/peresadka`.

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Видеоинструкция (на MVP только текст + 4 step-card).
- Чекбоксы «отметить выполнено» (это не TODO).
- Progress-bar / wizard-UI.
- Stepper с круглыми точками между шагами.
- «Купи бокс прямо сейчас» — на этой странице sells мягко (Подписаться на дневник first).

## Где это работает

- Organism `RitualSequence.md` — основной блок.
- Organism `SiteHeader.md` / `SiteFooter.md`.
- Atom `KickerHeader.md`, `CaveatNote.md`, `Button.md`, `ApothecaryBar.md`.
- Molecule `RitualStep.md` (внутри RitualSequence).
- `01_foundations/dna.md` §1.1.1 — линейка ритуалов (v2+).
- `02_voice/voice-principles.md` — регистр Наставник + Подруга.
- Master-brief §7.5 — канал обучения = сайт глубоко.

## История версий

- v1.0.0 · 2026-05-16 · первый draft, источник DS v1.0 §7.5. Закрыт минор M2 (Спринт 6 ревью): UTM-схема дописана.

## Заметка про дубль (для Спринта 11)

DS v1.0 §7.5 → ссылка `→ 03_components/templates/guide.md`.
