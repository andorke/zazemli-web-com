# about (`/about`) · Версия: 1.0.0 · Дата: 2026-05-16 · Источник: DS v1.0 §7.6

Template слоя `03_components/templates/`. О бренде — манифест, цитаты основателя, принципы.

## Что это

Манифесто-страница: WhisperHero + 2 цитаты основателя + 4 принципа бренда + контакты. Цель — построить эмоциональную связь, не продать. Не призывает к покупке.

## Роль в ДНК-четвёрке + канал обучения

Доминирует источник **04 Handscript** (голос Насти через цитаты + Caveat) + источник **02 Apothecary** (Frame2x для манифеста, ApothecaryBar между секциями). Канал обучения: **сайт — глубоко обучаем**. Эта страница — наиболее «manifesto», без прямой коммерции. См. `02_voice/dna.md` §1, §7.

## URL + SEO meta

| Поле | Значение |
|---|---|
| URL | `/about` |
| `<title>` | `О бренде · ЗАЗЕМЛИ` |
| `<meta description>` | `Бренд про возвращение в землю. Создан Настей — IT-руководителем, для тех, кто живёт перед экраном.` |
| OG image | `/og/about-1200x630.jpg` (WhisperHero wordmark) |
| canonical | `https://zazemli.com/about` |
| Schema.org | `AboutPage` + `Person` (Настя, основатель) |

## Композиция organisms

```
<SiteHeader />
<HeroWhisper withKicker={true} withCTA={false}>          // organism, регистр Редактор
  <KickerHeader brand="MANIFESTO ZAZEMLI" serial="N° 001" slug="о бренде" />
  <WhisperHero
    wordmark="ЗАЗЕМЛИ"
    phrases=[
      'руки в землю',
      '11 компонентов внутри',
      'голова свободна',
      'премиальная коробка для подмосковья'
    ]
  />
  <CaveatNote variant="brand-signature">заземли себя</CaveatNote>
</HeroWhisper>
<ApothecaryBar />

<section class="bg-bone manifesto-frame">                 // «Манифест», регистр Редактор
  <Frame2x>                                                 // atom — двойная apothecary рамка
    <p class="font-spectral italic text-xl">
      {/* Цитата 1 (полная) из 02_voice/founder-quotes.md */}
    </p>
    <p class="font-unbounded text-sm text-charcoal/60 mt-6">— Настя, основательница</p>
  </Frame2x>
</section>
<ApothecaryBar />

<section class="bg-chalk">                                // «Для кого», регистр Редактор
  <p class="font-spectral italic text-lg">
    {/* Цитата 2 (про аудиторию) из founder-quotes.md */}
  </p>
  <aside class="font-spectral italic text-base text-charcoal/55 mt-6">
    «материальная эстетика через труд и грязь»
  </aside>
</section>
<ApothecaryBar />

<section class="bg-bone">                                 // «4 принципа», регистр Наставник
  <KickerHeader brand="ЧЕТЫРЕ ПРИНЦИПА" />
  <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
    <article>
      <h4>Строгость + подмигивание</h4>
      <p class="font-spectral italic">Музейная типографика. Caveat по делу.</p>
    </article>
    <article>
      <h4>Наивность ≠ инфантильность</h4>
      <p class="font-spectral italic">Дудлы, не Disney.</p>
    </article>
    <article>
      <h4>Ритуал, не рутина</h4>
      <p class="font-spectral italic">Пересадка — это 15 минут осознанности.</p>
    </article>
    <article>
      <h4>Говорим как друг</h4>
      <p class="font-spectral italic">На «ты». Без жаргона маркетплейсов.</p>
    </article>
  </div>
</section>
<ApothecaryBar />

<section class="bg-chalk">                                // «Где нас найти», регистр Подруга
  <p>IG: @zazemli_collectio · TG: @zazemli_collectio · hello@zazemli.com</p>
  <Button variant="secondary" as="a" href="/diary-signup">Подписаться на дневник</Button>
</section>

<SiteFooter />
```

## Page-specific data

- Цитата 1 и Цитата 2 — из `02_voice/founder-quotes.md` (canonical-источник).
- 4 принципа — из `02_voice/voice-principles.md` (§ принципы брендбука).
- Handle IG/TG — из `01_foundations/brand-identity.md` (`@zazemli_collectio`).
- WhisperHero phrases — кастомные для /about, 4 фразы (не как HeroDefault).

## Правила применения

- **Без primary Button** в hero (это manifesto, не продажа). Secondary в footer-секции допустим.
- **Caveat-лимит 2** в content-zone: HeroWhisper Caveat «заземли себя» + опциональный в footer-section. В Manifesto Frame2x — без Caveat (там цитата).
- Schema.org `AboutPage` + `Person` (Настя, основатель, role) — для индексации.
- Аналитика: `view_about`, `scroll_to_principles`, `click_diary_from_about`, `click_ig_from_about`, `click_tg_from_about`, `click_email_from_about`.
- UTM: secondary CTA «Подписаться на дневник» и контакт-ссылки — `utm_source=site&utm_medium=about&utm_campaign=manifesto`. Внешние ссылки IG/TG — `utm_content=ig` / `utm_content=tg`.
- Frame2x — только на manifesto-секции (один на странице), не в каждой секции.

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- Команда / тим-секция с фото («тим из 1 — Настя»).
- Партнёры / награды / press-mentions.
- Customer testimonials.
- «Наша миссия» в bullet-list-формате (только цитаты).
- Primary Button в hero (manifesto не продаёт hard).
- Видео-history бренда.

## Где это работает

- Organism `HeroWhisper.md` — обёртка hero.
- Molecule `WhisperHero.md` — композиция wordmark + phrases.
- Organism `SiteHeader.md` / `SiteFooter.md`.
- Atom `Frame2x.md`, `KickerHeader.md`, `CaveatNote.md`, `Button.md`, `ApothecaryBar.md`.
- `02_voice/founder-quotes.md` — основной источник контента.
- `02_voice/voice-principles.md` — 4 принципа.
- `01_foundations/brand-identity.md` — handle IG/TG.
- `01_foundations/dna.md` — двойное прочтение через WhisperPhrases.

## История версий

- v1.0.0 · 2026-05-16 · первый draft, источник DS v1.0 §7.6. Закрыт минор M2 (Спринт 6 ревью): UTM на secondary CTA и контакт-ссылки дописан.

## Заметка про дубль (для Спринта 11)

DS v1.0 §7.6 → ссылка `→ 03_components/templates/about.md`.
