# EmailSubscribeForm · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: DS v1.0 §5.5

Молекула слоя `03_components/molecules/`. Форма подписки на сезонную рассылку — два контекста: основная (`/`, footer) и dnevnik (после QR из коробки → `/diary-signup`).

## Что это

Frame2x-обёрнутая форма с KickerHeader, H2, описанием, полями ввода и кнопкой. Два контекстных варианта: `main` (общая подписка на коллекцию) и `dnevnik` (привязка к конкретному растению + дате пересадки).

## Роль в ДНК-четвёрке

Мост **02 «Фармацевт» ↔ 04 «Друг»**:
- Frame2x + KickerHeader — апотекарный протокол (источник 02).
- Текст в регистре «Подруга», CaveatNote — голос Насти (источник 04).

Доля источников (по dna.md §7): ≈ 30% Галерист + 30% Фармацевт + 5% Натуралист + 35% Друг.

## Состав

| Слой | Что | Атом / зависимость |
|---|---|---|
| Контейнер | `Frame2x` p-12 | atoms/Frame2x.md (Спринт 4) |
| `KickerHeader` | условно: «В КОЛЛЕКЦИЮ · ПОДПИСКА» или «ДНЕВНИК НАТУРАЛИСТА · N°001» | atoms/KickerHeader.md |
| H2 | Unbounded text-3xl, charcoal/80 | typography.md H2 |
| Description | Spectral italic, text-lg, charcoal/70, max-w-prose | typography.md Narrative-italic |
| Form fields | Email + (для dnevnik) Растение-Select + Дата-Input | atoms/Input.md, atoms/Select.md, atoms/FormField.md (Спринт 4) |
| Button | Primary «Подписаться» | atoms/Button.md |
| CaveatNote | только для dnevnik: «корни скажут спасибо» | atoms/CaveatNote.md |

**Сигнатура:**

```jsx
<EmailSubscribeForm context="main" />
// или
<EmailSubscribeForm context="dnevnik" />
```

## Два контекста

| Параметр | `main` | `dnevnik` |
|---|---|---|
| Kicker | «В КОЛЛЕКЦИЮ · ПОДПИСКА» | «ДНЕВНИК НАТУРАЛИСТА · N°001» |
| H2 | «Один год · 4 письма» | «Записала тебя в дневник.» |
| Description | «Сезонный календарь ухода. Без маркетинга, без скидок.» | «Раз в сезон напомним, что важно для твоего растения. Не больше 4 писем.» |
| Поля | Email | Email + Растение (Select 7 SKU) + Дата пересадки |
| CaveatNote | нет | «корни скажут спасибо» |

## Варианты применения

| Где | Контекст |
|---|---|
| `/` главная, footer-секция | `main` |
| `/about` футер-CTA | `main` |
| `/diary-signup` (после QR из коробки) | `dnevnik` |
| `/dnevnik` (повторный визит) | `dnevnik` |

## Правила применения

1. **Только один EmailSubscribeForm на странице.** Если форма уже в footer — не дублировать в hero.
2. **Контекст должен совпадать со страницей.** `/diary-signup` — это `dnevnik`, не `main`. На главной — `main`, не `dnevnik`.
3. **CaveatNote (только dnevnik) — макс 1 на странице.** Идёт в лимит ≤2 Caveat на коллекцию.
4. **Frame2x обязателен.** Подписочная форма без рамки теряется в фоне.
5. **Подпись «Не больше 4 писем» в dnevnik — обязательна.** Это часть обещания брендa (TOV: «забота-через-действие, не сюсюканье»).

## Что НЕ применять

- Тексты «Подпишитесь и получите −10%!» — нет скидок (см. anti-patterns.md §4.6).
- Многошаговая форма (popup сначала, потом другая страница) — одна форма, одно действие.
- Чекбокс «Согласен с маркетингом» — мы не делаем маркетинг-рассылку, см. описание.
- Эмодзи в любых полях.
- Reset-кнопка — нет смысла, форма короткая.

## Где это работает

- `01_foundations/dna.md` — мост 02↔04
- `01_foundations/iconography.md` — Frame2x, KickerHeader, CaveatNote
- `01_foundations/typography.md` — H2 / Narrative
- `02_voice/voice-principles.md` — регистр «Подруга» для текста
- `02_voice/genre-templates.md` — Welcome-email шаблон (Спринт 7 расширение)
- `02_voice/anti-patterns.md` — §4.6, §5.1, §5.3
- `03_components/atoms/Input.md`, `Select.md`, `Button.md`, `Frame2x.md` — атомы (Спринт 4)
- `03_components/templates/diary-signup.md` — page-level (Спринт 6)

## История версий

- v1.0.0 · 2026-05-14 · первая версия после декомпозиции из DS v1.0 §5.5.

## Заметка про дубль (для Спринта 11)

Полное определение в DS v1.0.md §5.5. В Спринте 11 заменяется на ссылку.
