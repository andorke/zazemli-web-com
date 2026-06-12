# diary-signup (`/diary-signup`) · Версия: 1.0.0 · Дата: 2026-05-16 · Источник: DS v1.0 §7.7

Template слоя `03_components/templates/`. Подписка на email-дневник растения.

## Что это

Конверсионная страница email/подписки. Целевая страница QR-сканов из дневника (физическая книжка, dnevnik-zamiokulkas / dnevnik-monstera). Цель — собрать базу для retention и реактивации (+365 дней = новая коллекция).

## Роль в ДНК-четвёрке + канал обучения

Источник **02 Apothecary** (KickerHeader + строгая форма + Frame2x) + источник **04 Handscript** (Caveat success-state «корни скажут спасибо»). Канал обучения: **сайт — глубоко обучаем**, но эта страница — конверсионная, обучения мало, упор на форму. См. `02_voice/dna.md` §1, §7 + master-brief §7.5.

**dna.md §1.1.1:** `/diary-signup` — не «дневник пересадки», а «**дневник растения = окошко в следующие коллекции**». Email-цепочка через год ведёт на повторную пересадку (= новый бокс). В v2 — триггеры под подкормку, укоренение, реанимацию.

## URL + SEO meta

| Поле | Значение |
|---|---|
| URL | `/diary-signup` |
| `<title>` | `Дневник натуралиста · подписка · ЗАЗЕМЛИ` |
| `<meta description>` | `Запиши растение в дневник. 4 письма за год: освоилось / первый сезон / полгода рядом / время пересадки.` |
| OG image | `/og/diary-1200x630.jpg` (HeroDefault adapted: «Привет. Записала тебя в дневник.») |
| canonical | `https://zazemli.com/diary-signup` |
| Schema.org | `WebPage` (минимально — это форма, не контент) |
| `<body data-sku="">` | **неактивен** — без SKU-цвета, дефолт moss |

## Композиция organisms

```
<SiteHeader />
<section class="bg-bone greeting">                       // «Приветствие», регистр Подруга
  <KickerHeader brand="ДНЕВНИК НАТУРАЛИСТА" serial="N°001" />
  <h1 class="font-unbounded font-bold text-4xl">
    Привет. Записала тебя в дневник.
  </h1>
  <p class="font-spectral italic text-lg text-charcoal/65 mt-6">
    {/* Подзаголовок из 02_voice/genre-templates.md §4.4 */}
  </p>
</section>

<section class="bg-bone form-section">                    // регистр Подруга
  <Frame2x>                                                 // atom — двойная рамка обрамляет форму
    <EmailSubscribeForm context="dnevnik" extended={true}>
      <FormField label="Email"><Input type="email" /></FormField>
      <FormField label="Растение">
        <Select options={[
          { value: 'monstera', label: 'Монстера' },
          { value: 'ficus', label: 'Фикус' },
          { value: 'spathiphyllum', label: 'Спатифиллум' },
          { value: 'anthurium', label: 'Антуриум' },
          { value: 'zamiokulkas', label: 'Замиокулькас' },
          { value: 'aglaonema', label: 'Аглаонема' },
          { value: 'epipremnum', label: 'Эпипремнум' },
        ]} />
      </FormField>
      <FormField label="Дата пересадки"><Input type="date" /></FormField>
      <Button variant="primary">Подписаться</Button>
    </EmailSubscribeForm>
  </Frame2x>
</section>

<section class="bg-chalk">                                // «Что будет в письмах», регистр Наставник
  <KickerHeader brand="4 ПИСЬМА ЗА ГОД" />
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <article>
      <div class="serial">+14 дней</div>
      <h4>Растение освоилось</h4>
    </article>
    <article>
      <div class="serial">+90 дней</div>
      <h4>Первый сезон позади</h4>
    </article>
    <article>
      <div class="serial">+180 дней</div>
      <h4>Полгода рядом</h4>
    </article>
    <article>
      <div class="serial">+365 дней</div>
      <h4>Прошёл год · пора в новую землю</h4>
      <p class="font-spectral italic text-charcoal/55">окошко в следующую коллекцию</p>
    </article>
  </div>
</section>
<ApothecaryBar />

<section class="bg-bone success-state" hidden>          // отображается после submit, регистр Подруга
  <CaveatNote variant="brand-signature">корни скажут спасибо</CaveatNote>
  <p class="font-spectral italic mt-6">Подтвердили подписку. Первое письмо через 14 дней.</p>
  <p class="font-spectral italic">Пока — открой дневник на стр II.</p>
</section>

<SiteFooter />
```

## Page-specific data

- `extended={true}` — `EmailSubscribeForm` принимает 3 поля вместо 1 (email + Растение + Дата).
- 4 письма за год — из `EMAIL_DIARY_LOGIC` (уточнение Насти 2026-05-03 — рассылки чуть чаще, возможно 5-6).
- Success-state копирайт — из `02_voice/genre-templates.md` §4.4 (success-state pattern).

## Правила применения

- **Без SKU-привязки** (`data-sku` неактивен, дефолт moss-accent).
- Form-валидация: aria-invalid на error-state (см. `atoms/Input.md`, `atoms/Select.md`).
- Required: email + Растение (Дата опционально, для precise-timing email-триггеров).
- Аналитика: `view_diary_signup`, `submit_diary_form`, `submit_success`, `submit_error`. Источник трафика часто = QR из физического дневника — UTM `utm_source=qr&utm_medium=dnevnik&utm_content={sku}`.
- Caveat: 1 в content-zone (success-state).
- Frame2x — обрамляет только form-секцию (один на странице).
- В v2+ — добавятся 2-3 поля под другие ритуалы (тип ритуала: пересадка / подкормка / укоренение).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- «Скидка 10% на первый бокс» (нет скидок).
- Согласие на маркетинг checkbox (используем «двойной opt-in» через email).
- Соцкнопки «войти через Google» (нет аккаунтов).
- Длинная форма (>3 полей).
- Pop-up «не уходи» при exit-intent.

## Где это работает

- Molecule `EmailSubscribeForm.md` — основная форма (extended variant).
- Atom `FormField.md`, `Input.md`, `Select.md`, `Frame2x.md`, `KickerHeader.md`, `CaveatNote.md`, `Button.md`, `ApothecaryBar.md`.
- Organism `SiteHeader.md` / `SiteFooter.md`.
- `01_foundations/dna.md` §1.1.1 — «дневник = окошко в следующие коллекции».
- `02_voice/genre-templates.md` §4.4 — success-state копирайт.
- `EMAIL_DIARY_LOGIC` — триггеры писем (4 на MVP, больше в v2).

## История версий

- v1.0.0 · 2026-05-16 · первый draft, источник DS v1.0 §7.7.

## Заметка про дубль (для Спринта 11)

DS v1.0 §7.7 → ссылка `→ 03_components/templates/diary-signup.md`.
