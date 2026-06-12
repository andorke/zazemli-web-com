# ЗАЗЕМЛИ · Дизайн-система · v1.0 CANDIDATE-2

> **Назначение:** единая дизайн-система для сайта zazemli.com. Источник правды по визуальному языку в digital.
>
> **Версия:** v1.0 CANDIDATE-2 (после второго самоервью — этапы 1–12 завершены + дополнительный QA-проход). Ждёт финальный ОК Насти (этап 13).
>
> **Дата фиксации:** 2026-05-03. **Автор:** рабочая группа Cowork (CDO ведёт, CMO + CPO ассистируют).
>
> **Связанные документы:**
> - `Заземли рабочую группу/2026-05-03_DS_RESEARCH_v1.md` — этапы 1–4 (ресёч, выводы)
> - `СД/Дизайн/Бренд-фундамент/brand-v3.html` — источник правды primitive токенов (§01, §02, §03.5, §04, §05, §07, §08, §15, §18)
> - `СД/Маркетинг/ZAZEMLI_TOV_v1.2.md` — связь TOV → визуальная плотность
> - `Заземли рабочую группу/2026-05-03_BRIEF_FOR_CTO_SITE_v1.md` — список 7 страниц сайта
>
> **Дедлайн финала:** 11 мая 2026. **Применение:** refactor сайта 12–15 мая.

---

## 0. Как пользоваться этим документом

1. **Если ты СТО / разработчик** — иди в §2 (primitive tokens) для `tailwind.config.ts`, потом в §3 (semantic tokens) для CSS-переменных, потом в §4–6 (компоненты) для реализации.
2. **Если ты CMO / копирайтер** — §1 (принципы), §9 (регистры → визуальная плотность), §10 (правила добавления компонентов — фильтр для предложений).
3. **Если ты CDO / Настя** — весь документ. §8 (консистентность с печатью) — ключевой для проверки.

**Правило source-of-truth конфликтов:** при расхождении DS ↔ брендбук v3 — брендбук v3 побеждает (DS его обслуживает, не заменяет). При расхождении DS ↔ TOV v1.2 — TOV побеждает в копирайт-вопросах, DS — в визуальных.

---

## 1. Принципы DS

### 1.1 Главный принцип

> **«Каждая страница — экспонат в музее. Лишнее не входит. Тишина дороже громкости. Типографика говорит, цвет молчит (кроме momentaries SKU-акцентов на странице конкретного продукта).»**

Зафиксировано Настей 2026-05-03 (этап 5 ОК).

### 1.1.1 Рамка продукта: линейка ритуалов заботы

> **Уточнение от Насти 2026-05-03 (после этапа 9):** «Бренд — линейка ритуалов заботы о растении И о себе, не только пересадка. Дневник — уже окошко в следующие коллекции.»

**Архитектурное следствие для DS:** DS строится не под «один продукт-пересадку», а под **расширяемую линейку ритуалов заботы**. Пересадка — первый и пока единственный в MVP, но архитектурно DS поддерживает горизонт:

| Ритуал | Когда | SKU-формат |
|---|---|---|
| **Пересадка** | MVP (2026 апрель) | Текущий: 7 растений × 2–3 размера |
| Подкормка | бэклог I.6 — подписка | Подписочные капсулы / порции |
| Укоренение черенков | бэклог Master Brief §1 этап 02 | Стартер для черенка + субстрат |
| Реанимация заболевшего | бэклог Master Brief §1 этап 02 | Восстанавливающая смесь |
| Размножение | бэклог | Семена / черенки / клубни |
| Сезонная подготовка | потенциал | Зимняя / летняя смесь |
| Ритуалы для **человека** | потенциал (§01 ДНК-двойное дно) | «Заземлись» — чай, тактильные предметы |

**Что это значит для DS на этом этапе:**
- `RitualSequence` (§6.4) — параметризован, не «4 шага пересадки», а **любое число шагов любого ритуала**
- `/guide` template (§7.5) — в v2+ превращается в hub `/rituals/` с дочерними `/rituals/peresadka`, `/rituals/podkormka` и т.д.
- `/diary-signup` (§7.7) — не «дневник пересадки», а **«дневник растения = окно в коллекции»**. Email-цепочка из EMAIL_DIARY_LOGIC уже частично это делает (письмо «+365 дней» ведёт на повторную пересадку — это и есть «окошко в следующую коллекцию»). В v2 добавляются триггеры под подкормку (+30 дней), укоренение, реанимацию.
- Двойное дно «ЗАЗЕМЛИ растение × ЗАЗЕМЛИ себя» (§01 брендбука) — должно быть видно на главной не только через H1, но и через **визуальное равенство** двух смыслов: «забота о растении» = «забота о себе».

**Prior-art подтверждение (от Насти 2026-05-03 — этап 10):** [Rituals.com](https://www.rituals.com/) — нидерландский бренд, €2.43bn revenue 2025, делает **ровно ту же концептуальную рамку** — превращает рутины в ритуалы. URL-pattern Rituals: `/collectio/sakura`, `/collectio/karma`, `/collectio/mehr`, `/collectio/hammam`, `/collectio/jing`, `/collectio/ayurveda`, `/collectio/amsterdam`. Каждая серия — свой мир с нарративом, цветом, тематикой.

**Параллель архитектуры:**

| Rituals | ЗАЗЕМЛИ |
|---|---|
| `/collectio/sakura` — Hanami-нарратив | `/rituals/peresadka` — «руки в землю» |
| `/collectio/karma` — Ayurveda balance | `/rituals/podkormka` — «питание корней» |
| `/collectio/hammam` — turkish spa refresh | `/rituals/ukorenenie` — «новая жизнь» |
| Две оси: серия × категория продукта | Две оси: ритуал × растение (SKU) |
| Refill program (sustainability) | Дневник остаётся + повторная пересадка через год |

**Что берём:** подтверждение URL-pattern, идея «нарратива на ритуал», двухосевая архитектура каталога.
**Что НЕ берём:** восточные мотивы (Sakura/Hammam/Ayurveda — не наш мир, у нас славянский апотекарь XIX в.), фото-баннеры в hero (у нас типографика-первая), масс-сегмент позиционирование.

### 1.2 Четыре ДНК-источника (из §01 брендбука)

Каждая страница должна показывать **минимум 3 из 4**:

| # | Источник | Что значит в вебе |
|---|---|---|
| 1 | Галерейная строгость (MMOMA) | Большие отступы, один объект «на постаменте», минимум элементов |
| 2 | Минимализм + мода (Aesop) | Fashion-типографика, крупные буквы, уверенный ритм |
| 3 | Материалы грунта | Земляные тона как акценты-точки, не фон. Aluminium-чувство |
| 4 | Рукописная наивность (Caveat) | Редкие приписки, дудлы как «шёпот», лёгкий rotate |

### 1.3 Три оси контраста (из §01 брендбука)

Должны быть видны на каждой странице. **Как проявляются на конкретных страницах:**

| Ось | Как видна |
|---|---|
| **Премиум × Наивное** | Unbounded строгий H1 + Caveat-приписка снизу (на каждой странице) |
| **Цифровое × Материальное** | Clean UI grid (Tailwind) + земляные `MaterialDot` в `/lab` + бумажная текстура bone-фона |
| **Интеллект × Ритуал** | `/lab` (deep content, 80+ источников) ↔ `/guide` (15-min ритуал 00/01/02/03) — две страницы балансируют друг друга |

**Применение на каждой странице** (контроль на этапе 12):

- `/` — Премиум×Наивное (Hero строгий + Caveat снизу) · Цифровое×Материальное (clean grid + moss-fleuron)
- `/collectio` — Премиум×Наивное (KickerHeader структурный + Caveat на product card SKU-humor)
- `/collectio/[plant]` — все три: Премиум (SerialNumber + строгий H1) · Материальное (SKU-дудл + MaterialsGrid preview) · Ритуал (4 RitualStep блок «что в боксе»)
- `/lab` — Премиум×Наивное (WhisperHero) · Интеллект (полный content)
- `/guide` — Интеллект×Ритуал (RitualSequence) · Материальное (RitualStep с цифрами как тактильные клейма)
- `/about` — Премиум×Наивное (WhisperHero + Manifesto Caveat) · Цифровое×Материальное (Frame2x + текст)
- `/diary-signup` — Премиум (KickerHeader + строгая форма) · Наивное (Caveat-success state)

### 1.4 Восемь якорей переноса печать→веб

Фундамент DS (из этапа 1 ресёча):

1. **ДНК-четвёрка одновременно** (см. §1.2)
2. **Слоган-матрёшка** (§02 брендбука → §8.3 DS)
3. **Apothecary 4 якоря** (§03.5 → §4.3 + §4.4 DS)
4. **Правило палитры 60/30/10** (§04 → §2.1 DS, жёстко)
5. **Иерархия Unbounded-весов** (§05 → §2.2 DS)
6. **Editorial Whisper mode** (§07 → §5.3 + §6.2 DS)
7. **Ритуал 00/01/02/03** (§15 → §5.2 + §6.4 DS)
8. **§18 токены** (opacity, letter-spacing, frames, fleuron → §2.4 / §2.5 / §2.6 / §4.4 DS)

### 1.5 Три анти-принципа (зафиксированы этапом 5)

- **Светлые фоны главные** — bone основной, chalk вторичный. Земля = акценты-точки, не подложка секций.
- **Острые углы 0–2px max** — отказ от mainstream-веба (SaaS-дружелюбие).
- **Без drop-shadows** — тонкие линии вместо лифтов. Глубина через opacity-шкалу и рамки, не через тени.

### 1.6 Что DS не делает

- Не переписывает брендбук v3 — расширяет его веб-применение.
- Не предписывает контент — только визуальную систему.
- Не предписывает технологии — стек (Next.js + TS + Tailwind) уже выбран в брифе СТО.
- Не покрывает email-шаблоны, IG-форматы, печать (это вне скоупа MVP, см. этап 5 ОК).
- **Не определяет конкретные ритуалы помимо пересадки** (подкормка, укоренение и т.д.) — это работа продуктовой команды (CPO). DS только предоставляет **архитектурный слой** для добавления новых ритуалов (§10.5).

---

## 2. Primitive tokens

> Сырые значения. Источник — §04 палитра, §05 типографика, §18 правила брендбука v3.
> Маппинг — на Tailwind CSS как основной канал реализации.

### 2.1 Цвет

#### 2.1.1 Палитра — полная таблица

| Категория | Имя | HEX | RGB | Где живёт |
|---|---|---|---|---|
| **Бренд** | charcoal | `#1C1C1C` | 28, 28, 28 | Основной текст, dark-секции (редкий режим) |
| | bone | `#F6F4F0` | 246, 244, 240 | Основной фон страниц |
| | moss | `#4A7C59` | 74, 124, 89 | Signature accent — fleuron, латынь, hover-state |
| **Альтернативный фон** | chalk | `#EDEBE6` | 237, 235, 230 | Вторичный фон секций (для ритма) |
| **Материалы** (только точки/детали) | graphite | `#2E2E2E` | 46, 46, 46 | Иконки-точки, dark-альтернатива charcoal |
| | soil | `#6B4D35` | 107, 77, 53 | MaterialDot для компонента «уголь»/«биочар» |
| | ceramsite | `#B08C5A` | 176, 140, 90 | MaterialDot для «керамзит» |
| | pumice | `#B5AFA3` | 181, 175, 163 | MaterialDot для «пемза» |
| | sand | `#C8B8A8` | 200, 184, 168 | MaterialDot для «песок» |
| | gravel | `#D2C9B8` | 210, 201, 184 | MaterialDot для «гравий», подложка для индикаторов |
| **SKU-акценты** (только на странице конкретного SKU) | cosmos | `#BE3A6B` | 190, 58, 107 | Фикус |
| | iris | `#7E6AAF` | 126, 106, 175 | Аглаонема |
| | buttercup | `#C47A10` | 196, 122, 16 | Замиокулькас |
| | sky | `#2878AE` | 40, 120, 174 | Спатифиллум |
| | poppy | `#C03A30` | 192, 58, 48 | Антуриум |
| | moss (≡) | `#4A7C59` | 74, 124, 89 | Монстера + Эпипремнум (общий) |

#### 2.1.2 Правило 60 / 30 / 10 — главное (§04 брендбука)

| Канал | Цвет | % | На каждой странице |
|---|---|---|---|
| 60% | bone | основной фон + неконтрастный контент | везде |
| 30% | charcoal | текст + dark-блоки (редко) | везде |
| 10% | moss | fleuron, латынь, accent-кнопки, hover | везде |
| 0% (default) | SKU-цвета | — | **только** на `/collectio/[plant]` соответствующего растения |

**Запрещено:**
- ❌ Использовать 2+ SKU-цвета на одной странице (стрипа из 6 цветов в hero, разноцветные KPI-цифры).
- ❌ Земляные тона (`soil`/`ceramsite`/`pumice`/`sand`/`gravel`) как **фон секции**. Только как `MaterialDot` или мелкие декоративные элементы.

#### 2.1.3 Tailwind config (фрагмент)

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // ── Бренд ──
        charcoal: '#1C1C1C',
        bone:     '#F6F4F0',
        moss:     '#4A7C59',

        // ── Альтернативный фон ──
        chalk:    '#EDEBE6',

        // ── Материалы (только акценты-точки) ──
        graphite:  '#2E2E2E',
        soil:      '#6B4D35',
        ceramsite: '#B08C5A',
        pumice:    '#B5AFA3',
        sand:      '#C8B8A8',
        gravel:    '#D2C9B8',

        // ── SKU (только на /collectio/[plant]) ──
        cosmos:    '#BE3A6B',
        iris:      '#7E6AAF',
        buttercup: '#C47A10',
        sky:       '#2878AE',
        poppy:     '#C03A30',
      },
    },
  },
}
```

### 2.2 Типографика

#### 2.2.1 Шрифты

| Шрифт | Веса | Использование |
|---|---|---|
| **Unbounded** | 300, 400, 500, 700, 800, 900 | Wordmark, заголовки, кнопки, навигация, UI-текст |
| **Spectral** (italic only) | 400, 700 | Латинские названия, narrative, описания, цитаты, kicker'ы |
| **Caveat** | 400 | Handscript-приписки. **Максимум 2 на одну страницу** (см. §4.3.3 интерпретация TOV §1.3 для веба) |

#### 2.2.2 Modular Scale Major Third (×1.25)

Базовый размер 16px = 1rem. Шкала размеров:

| Token | px | rem | Tailwind | Роль |
|---|---|---|---|---|
| text-xs | 12 | 0.75 | `text-xs` | caption, мета, KickerHeader-текст |
| text-sm | 14 | 0.875 | `text-sm` | small text, footer-links |
| text-base | 16 | 1.0 | `text-base` | body, UI, кнопки |
| text-lg | 20 | 1.25 | `text-lg` | lead, Spectral italic подзаголовок |
| text-xl | 24 | 1.5 | `text-xl` | H4, sub-heading |
| text-2xl | 30 | 1.875 | `text-2xl` | H3 |
| text-3xl | 38 | 2.375 | `text-3xl` | H2 страниц |
| text-4xl | 48 | 3.0 | `text-4xl` | H1 страниц (не hero) |
| text-5xl | 60 | 3.75 | `text-5xl` | Compressed-hero, RitualStep-цифра |
| text-6xl | 76 | 4.75 | `text-6xl` | Display, hero растений |

**Hero-clamp** для главной — fluid type:

```css
font-size: clamp(2.5rem, 5vw, 4.75rem);   /* H1 главной — 40–76px */
font-size: clamp(1.5rem, 3vw, 2.375rem);  /* H1 внутренних — 24–38px */
```

#### 2.2.3 Иерархия Unbounded-весов (из §05 брендбука)

| Роль | Вес Unbounded | Размер | Где |
|---|---|---|---|
| Wordmark | 500 | `text-base` (16) | SiteHeader-лого |
| Display | 900 | `text-6xl` (76) | Hero растения wordmark, ритуал-цифры |
| Compressed-hero | 800–900 | `text-5xl` (60) | RitualStep-цифры (00/01/02/03) |
| Body-hero | 700 | `text-4xl` (48) — `text-3xl` (38) | H1 страниц, hero-заголовки |
| H2 | 500 | `text-xl` (24) | подзаголовки секций |
| Body | 400 | `text-base` (16) | UI-текст, навигация, кнопки |
| Caption | 400 | `text-xs` (12) | KickerHeader-text, метки, footer-links |

#### 2.2.4 Line-height

| Контекст | line-height |
|---|---|
| Display (76px) | 1.0 |
| Hero (48–60px) | 1.05 |
| H1 / H2 (24–38px) | 1.15 |
| Body Unbounded (16px) | 1.5 |
| Long-form Spectral italic | 1.65 |
| Caveat (любой размер) | 1.3 |

#### 2.2.5 Tailwind config (фрагмент)

```ts
// tailwind.config.ts
extend: {
  fontFamily: {
    unbounded: ['Unbounded', 'sans-serif'],
    spectral:  ['Spectral', 'serif'],
    caveat:    ['Caveat', 'cursive'],
  },
  fontSize: {
    'xs':   ['12px', { lineHeight: '1.5' }],
    'sm':   ['14px', { lineHeight: '1.5' }],
    'base': ['16px', { lineHeight: '1.5' }],
    'lg':   ['20px', { lineHeight: '1.4' }],
    'xl':   ['24px', { lineHeight: '1.25' }],
    '2xl':  ['30px', { lineHeight: '1.2' }],
    '3xl':  ['38px', { lineHeight: '1.15' }],
    '4xl':  ['48px', { lineHeight: '1.05' }],
    '5xl':  ['60px', { lineHeight: '1.0' }],
    '6xl':  ['76px', { lineHeight: '1.0' }],
  },
}
```

### 2.3 Spacing

#### 2.3.1 Шкала 8pt grid

| Token | px | rem | Tailwind | Использование |
|---|---|---|---|---|
| space-1 | 4 | 0.25 | `p-1` | внутри micro-элементов |
| space-2 | 8 | 0.5 | `p-2` | tight gap |
| space-3 | 12 | 0.75 | `p-3` | input padding |
| space-4 | 16 | 1.0 | `p-4` | item gap |
| space-6 | 24 | 1.5 | `p-6` | block padding |
| space-8 | 32 | 2.0 | `p-8` | block gap |
| space-12 | 48 | 3.0 | `p-12` | section gap (mobile) |
| space-16 | 64 | 4.0 | `p-16` | section gap (desktop) |
| space-24 | 96 | 6.0 | `p-24` | section padding (Редактор-регистр) |
| space-32 | 128 | 8.0 | `p-32` | hero padding (manifesto) |

**Запрещено:** произвольные значения (36/56/72) — только из шкалы. Если нужно «между» — выбирай ближайшее меньшее.

#### 2.3.2 Семантические уровни spacing

| Уровень | Значение | Где |
|---|---|---|
| `--section-padding-y` | 96 (desktop) / 64 (mobile) | Вертикальный отступ внутри `<section>` |
| `--section-gap` | 64 (desktop) / 48 (mobile) | Между секциями |
| `--block-gap` | 32 | Между блоками внутри секции |
| `--item-gap` | 16 | Между элементами в списке/grid |
| `--tight-gap` | 8 | Микро-отступы, между чипами/иконками |

### 2.4 Opacity (из §18 брендбука)

#### 2.4.1 Шкала ролей

| Opacity | Token | Роль |
|---|---|---|
| 0.8 | `--text-display` | H1, titles |
| 0.75 | `--text-latin` | Латинские названия (Spectral italic) |
| 0.7 | `--text-narrative` | Long-form body |
| 0.5 | `--text-secondary` | Подписи |
| 0.4 | `--text-caption` | Captions, hints, метки |
| 0.3 | `--border-divider` | Dividers, hairlines |

#### 2.4.2 Специальные уровни

| Opacity | Где |
|---|---|
| 0.85 | Caveat handwritten — чуть насыщеннее narrative |
| 0.55 | Лёгкие подложки, day-labels |
| 0.06–0.2 | Watermarks, ultra-faint фоновые дудлы |

#### 2.4.3 Tailwind utilities

```html
<!-- H1 на bone -->
<h1 class="font-unbounded text-4xl text-charcoal/80">Заземли Монстеру</h1>

<!-- Spectral italic латынь -->
<span class="font-spectral italic text-lg text-moss/75">monstera</span>

<!-- Body narrative -->
<p class="font-unbounded text-base text-charcoal/70">...</p>

<!-- Divider -->
<hr class="border-t border-charcoal/30">
```

### 2.5 Letter-spacing (из §18 брендбука)

| Tracking | Tailwind | Где |
|---|---|---|
| 1.6–2.24 (~3.2–5.5pt) | `tracking-widest` (Tailwind) или custom `tracking-[0.18em]` | COLLECTIO kicker, KickerHeader |
| 2.5 | `tracking-[0.25em]` custom | Caption-uppercase, мета-метки |
| 0 | `tracking-normal` | Body |
| −0.5 | `tracking-tight` (Tailwind −0.025em) | H2, subheading |
| −1 to −1.5 (display) | `tracking-[-0.05em]` или `tracking-[-0.075em]` custom | Hero-имена, Unbounded 900 |

### 2.6 Border

#### 2.6.1 Hairline + Frame

| Token | Width | Opacity | Где |
|---|---|---|---|
| `--border-hairline` | 1px | 0.3 | Базовый divider |
| `--border-frame-outer` | 1px | 0.5 | Внешняя apothecary рамка |
| `--border-frame-inner` | 0.5px | 0.3 | Внутренняя apothecary рамка |
| `--border-input` | 1px | 0.15 | Граница инпутов |
| `--border-input-focus` | 1px | 1 (moss) | Граница инпута в фокусе |
| `--frame-gap` | 6px | — | Между outer и inner в Frame2x |

#### 2.6.2 Radius

| Token | Value | Где |
|---|---|---|
| `--radius-flat` | 0 | Большинство компонентов (карточки, секции) |
| `--radius-tight` | 2px | Кнопки, инпуты |
| `--radius-pill` | 999px | Чипы/badges (только если pill-форма явно нужна) |

**Запрещено:** `--radius` 4px+. Никаких «дружелюбных» 8–12px скруглений.

#### 2.6.3 No shadows

DS **не предусматривает** `box-shadow`. Все случаи, где mainstream-веб использует тень (карточки, дроп-листы, модалки), у нас решаются:
- `border-divider` (hairline) — для разделения слоёв
- `Frame2x` (двойная apothecary рамка) — для важных карточек
- Сменой фона (bone → chalk) — для подложек

### 2.7.5 Доступность (WCAG 2.1 AA)

> Зафиксировано на этапе 12 после проверки конкретных контрастов.

**Проверенные сочетания** (`#FOREGROUND × #BG = ratio → WCAG-level`):

| Сочетание | Ratio | WCAG | Применение |
|---|---|---|---|
| charcoal × bone | 15.5 : 1 | AAA | весь основной текст |
| charcoal × chalk | 13.2 : 1 | AAA | текст на chalk-фоне |
| bone × charcoal | 15.5 : 1 | AAA | текст на dark-секциях |
| moss × bone | 5.2 : 1 | AA для любого размера | латынь, fleuron, accent |
| sky × bone | 5.0 : 1 | AA для любого размера | SKU-латынь спатифиллум |
| poppy × bone | 5.5 : 1 | AA для любого размера | SKU-латынь антуриум |
| **cosmos × bone** | 3.8 : 1 | **AA-large only (≥18pt)** | SKU-латынь фикус — только в крупных текстах |
| **iris × bone** | 3.5 : 1 | **AA-large only** | SKU-латынь аглаонема — только в крупных текстах |
| **buttercup × bone** | 3.5 : 1 | **AA-large only** | SKU-латынь замиокулькас — только в крупных текстах |

**Правило для small text (<18pt = <24px) на SKU-страницах:**
- ✅ Латинь Spectral italic ВСЕГДА в `--text-latin = moss` (не SKU-цвет). Это **переопределяет** наивную интуицию «латынь в цвете SKU».
- ✅ SKU-цвета cosmos / iris / buttercup используются только для:
  - Декоративных элементов (дудлы, accent-полосы, рамки)
  - Крупного текста ≥24px (например SerialNumber 60px — OK, Hero H1 48px+ — OK)
  - Графических акцентов (border, background большой плашки)

**Запрещено:**
- ❌ Латынь Spectral italic 14–16px в cosmos / iris / buttercup на bone-фоне.
- ❌ Body text (charcoal 0.7) на цветных фонах cosmos / iris / buttercup — теряется читабельность.

**Проверка opacity-шкалы § 2.4 на WCAG:**
- charcoal × bone × opacity 0.7 (text-narrative) = ~11 : 1 — AAA ✅
- charcoal × bone × opacity 0.5 (text-secondary) = ~7.8 : 1 — AAA ✅
- charcoal × bone × opacity 0.4 (text-caption) = ~6.2 : 1 — AAA ✅
- bone × charcoal × opacity 0.7 (inverted narrative) = ~11 : 1 — AAA ✅

Все opacity-уровни §2.4 проходят AA/AAA.

### 2.7 Motion

#### 2.7.1 Easing

```css
--easing-standard:   cubic-bezier(0.4, 0, 0.2, 1);     /* основное — для всего */
--easing-emphasized: cubic-bezier(0.2, 0, 0, 1);       /* для page transitions */
```

#### 2.7.2 Duration

| Token | Value | Где |
|---|---|---|
| `--duration-fast` | 150ms | Очень мелкие изменения (badge hover) |
| `--duration-base` | 200ms | UI hover, focus |
| `--duration-medium` | 300ms | State transitions, открытие dropdown |
| `--duration-slow` | 400ms | Section fade-up при появлении |
| `--duration-page` | 600ms | Page transitions |

#### 2.7.3 Что анимируется vs нет

| ✅ Анимируется | ❌ НЕ анимируется |
|---|---|
| opacity | font-size |
| transform: translateY (5–10px) | color (резкие смены) — только через opacity |
| transform: scale (max 1.02) | display |
| border-color | margin, padding (layout reflow) |
| background-color (тонко) | width, height (если меняет layout) |

#### 2.7.4 Стандартные паттерны

```css
/* Hover на карточке */
.card {
  transition: transform var(--duration-base) var(--easing-standard),
              border-color var(--duration-base) var(--easing-standard);
}
.card:hover {
  transform: translateY(-2px);
  border-color: var(--charcoal-50);  /* 0.5 opacity */
}

/* Fade-up при появлении секции */
.section-reveal {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity var(--duration-slow) var(--easing-emphasized),
              transform var(--duration-slow) var(--easing-emphasized);
}
.section-reveal.is-visible {
  opacity: 0.8;       /* по шкале H1 из §2.4 */
  transform: translateY(0);
}

/* Кнопка hover */
.btn-primary {
  transition: opacity var(--duration-base) var(--easing-standard),
              transform var(--duration-base) var(--easing-standard);
}
.btn-primary:hover {
  opacity: 0.85;
  transform: translateY(-2px);
}
```

---

## 3. Semantic tokens

Уровень поверх primitive. Семантические роли — то, как видит цвет/типографику/spacing компонент.

```css
:root {
  /* ─── SURFACE ─── */
  --surface-paper:      var(--bone);              /* основной фон страниц */
  --surface-warm:       var(--chalk);             /* вторичный фон секций (ритм) */
  --surface-deep:       var(--charcoal);          /* dark-секции (РЕДКО) */

  /* ─── TEXT ─── */
  --text-display:       rgba(28, 28, 28, 0.8);    /* H1-H2 */
  --text-narrative:     rgba(28, 28, 28, 0.7);    /* body, long-form */
  --text-secondary:     rgba(28, 28, 28, 0.5);    /* подписи */
  --text-caption:       rgba(28, 28, 28, 0.4);    /* мета, hints */
  --text-latin:         var(--moss);              /* латинские названия — ВСЕГДА moss, не SKU (см. §2.7.5 WCAG) */
  --text-inverted:      var(--bone);              /* текст на dark-секциях */

  /* ─── ACCENT ─── */
  --accent-fleuron:     var(--moss);              /* ❦, signature accent */
  --accent-active:      var(--moss);              /* hover, focus states */
  --accent-sku:         currentColor;             /* подставляется per-SKU из page-level CSS var */

  /* ─── BORDER ─── */
  --border-divider:     rgba(28, 28, 28, 0.3);    /* линии-разделители */
  --border-frame-outer: rgba(28, 28, 28, 0.5);    /* внешняя apothecary */
  --border-frame-inner: rgba(28, 28, 28, 0.3);    /* внутренняя apothecary */
  --border-input:       rgba(28, 28, 28, 0.15);   /* граница инпутов */
  --border-input-focus: var(--moss);              /* фокус инпута */
}

/* Page-level SKU-override на /collectio/[plant] */
[data-sku="monstera"]    { --accent-sku: var(--moss); }
[data-sku="ficus"]       { --accent-sku: var(--cosmos); }
[data-sku="anturium"]    { --accent-sku: var(--poppy); }
[data-sku="aglaonema"]   { --accent-sku: var(--iris); }
[data-sku="spatifillum"] { --accent-sku: var(--sky); }
[data-sku="zamiokulkas"] { --accent-sku: var(--buttercup); }
[data-sku="epipremnum"]  { --accent-sku: var(--moss); }
```

---

## 4. Atoms

### 4.1 Button

#### 4.1.1 Варианты

| Variant | Background | Text | Border | Где |
|---|---|---|---|---|
| `primary` | charcoal | bone | none | Главный CTA («Купить на Ozon», «Подписаться») |
| `secondary` | transparent | charcoal | 1px charcoal/0.15 | Вторичный CTA («Подробнее», «Посмотреть коллекцию») |
| `ghost` | transparent | charcoal | none, underline on hover | Третичный, в списках/footer |
| `accent` | moss | white | none | Signature actions (редко — «Подписаться на дневник») |
| `inverted` | bone | charcoal | none | Только на dark-секциях |

#### 4.1.2 Состояния

| Состояние | Изменения |
|---|---|
| default | базовый |
| hover | opacity → 0.85; translateY −2px; 200ms standard easing |
| focus | outline 2px moss; outline-offset 2px (вместо glow) |
| active | translateY 0px (возврат); opacity 0.95 |
| disabled | opacity 0.4; cursor not-allowed; no transform |
| loading | spinner внутри + opacity 0.6; disabled-логика |

#### 4.1.3 Размеры

| Size | Padding | Text | Height |
|---|---|---|---|
| `sm` | 8/16 | text-sm (14) | 36px |
| `base` | 12/24 | text-base (16) | 44px |

#### 4.1.4 Пример (Tailwind)

```jsx
// Primary
// ВАЖНО: явно перечисляем свойства для transition (по §2.7.3 запрет на transition-all)
<button class="
  inline-flex items-center justify-center
  px-6 py-3                                /* padding-base 24/12 */
  bg-charcoal text-bone
  font-unbounded text-base
  rounded-sm                               /* radius-tight 2px */
  transition-[opacity,transform,border-color]
  duration-200 ease-out
  hover:opacity-85 hover:-translate-y-0.5  /* hover */
  focus:outline-2 focus:outline-moss focus:outline-offset-2
  active:translate-y-0 active:opacity-95
  disabled:opacity-40 disabled:cursor-not-allowed
">
  Купить на Ozon
</button>

// Secondary
<button class="
  inline-flex items-center justify-center
  px-6 py-3
  bg-transparent text-charcoal
  border border-charcoal/15
  font-unbounded text-base
  rounded-sm
  transition-[opacity,transform,border-color]
  duration-200 ease-out
  hover:border-charcoal/50 hover:-translate-y-0.5
  focus:outline-2 focus:outline-moss focus:outline-offset-2
  active:translate-y-0
  disabled:opacity-40 disabled:cursor-not-allowed
">
  Подробнее
</button>
```

#### 4.1.5 Что писать на кнопках

**Можно** (TOV §1.3 — глаголы императива):
- «Купить на Ozon»
- «Подписаться»
- «Заземли Монстеру»
- «Посмотреть коллекцию»
- «Открыть лабораторию»
- «Скачать рецептуры»

**Запрещено:**
- ❌ «В корзину» / «Добавить в корзину» (нет корзины)
- ❌ «Заказать» (мы не магазин)
- ❌ «Купи прямо сейчас!» (TOV §3 blacklist)
- ❌ Восклицательные знаки

### 4.2 Input / Label / FormField

#### 4.2.1 Input

```jsx
<input
  type="email"
  placeholder="hello@zazemli.com"
  aria-busy={isSubmitting}
  class="
    w-full
    px-3 py-3                              /* padding 12 */
    bg-bone
    text-charcoal text-base font-unbounded
    border border-charcoal/15
    rounded-sm                             /* radius-tight 2px */
    transition-colors duration-200 ease-out
    placeholder:text-charcoal/40
    focus:outline-none focus:border-moss
    disabled:opacity-40
    aria-busy:opacity-60                   /* loading state */
  "
/>

{/* Состояния Input:
    - default: charcoal/15 border
    - hover: charcoal/30 border
    - focus: moss border + outline none
    - disabled: opacity 0.4
    - error: poppy/60 border + error-line ниже (Spectral italic poppy/80)
    - loading: opacity 0.6 (aria-busy=true)
*/}
```

#### 4.2.2 Label

```jsx
<label class="
  block
  font-unbounded text-xs              /* 12px */
  uppercase
  tracking-[0.25em]                   /* letter-spacing 2.5 */
  text-charcoal/40                    /* caption opacity */
  mb-2
">
  Email
</label>
```

#### 4.2.3 FormField (composition)

```jsx
<div class="flex flex-col gap-2">
  <Label>Email</Label>
  <Input />
  {error && <span class="font-spectral italic text-sm text-poppy/80">{error}</span>}
</div>
```

### 4.3 KickerHeader / SerialNumber / CaveatNote

#### 4.3.1 KickerHeader (из §03.5 якорь 01 COLLECTIO)

3-part composition: brand-name + N° + slug.

```jsx
<div class="
  flex items-center justify-center gap-3
  font-unbounded font-medium               /* 500 */
  text-xs                                  /* 12px */
  uppercase
  tracking-[0.18em]                        /* letter-spacing 1.6 */
  text-charcoal/75                         /* latin opacity */
  mb-6
">
  <span>COLLECTIO ZAZEMLI</span>
  <span class="opacity-50">·</span>
  <span class="font-spectral italic normal-case tracking-normal">N° 001</span>
  <span class="opacity-50">·</span>
  <span class="font-spectral italic normal-case tracking-normal">monstera</span>
</div>
```

#### 4.3.2 SerialNumber (из §03.5 якорь 02)

Spectral italic, формула `N°[партия][SKU]`.

```jsx
<div class="
  font-spectral italic
  text-5xl                                 /* 60px ~ 36pt */
  tracking-wide                            /* +1px ~ §03.5 */
  text-[var(--accent-sku)]                 /* SKU-color per page */
">
  N° 001
</div>
```

#### 4.3.3 CaveatNote

3 контекстных варианта через `variant` prop. React-компонент:

```jsx
function CaveatNote({ variant = 'brand-signature', children }) {
  const variants = {
    'brand-signature': 'text-charcoal/85 -rotate-1 text-2xl',      // 24px charcoal — для footer, hero
    'sku-humor':       'text-[var(--accent-sku)]/85 rotate-1 text-lg',  // 18px — только moss/sky/poppy (см. §2.7.5)
    'journal-pair':    'text-moss/85 -rotate-1 text-xl',           // 20px moss — для манифеста, success state
  }
  return <span class={`font-caveat inline-block ${variants[variant]}`}>{children}</span>
}
```

Примеры использования:

```jsx
// Brand signature
<span class="
  font-caveat text-2xl                     /* 22px */
  text-charcoal/85
  -rotate-1
  inline-block
">
  заземли себя
</span>

// SKU-humor
// ⚠️ WCAG-ограничение (§2.7.5): для SKU = cosmos / iris / buttercup использовать
// минимум text-2xl (24px) или переходить на moss/charcoal. Иначе текст уходит ниже AA.
// SKU = moss / sky / poppy → text-lg (18px) OK.
<span class="
  font-caveat text-lg                      /* 18px — только для moss/sky/poppy SKU */
  text-[var(--accent-sku)]/85
  rotate-1
  inline-block
">
  она уже лезет из горшка!
</span>

// Journal pair
<span class="
  font-caveat text-xl                      /* 20px */
  text-moss/85
  -rotate-1
  inline-block
">
  корни скажут спасибо
</span>
```

**Правило (TOV §1.3 интерпретация для веба):** не больше **2 Caveat-приписок на одну страницу** в **контентной зоне** (между header и footer). 

**Не считаются в счёт «2 на страницу»:**
- Caveat в `SiteHeader` (если используется — глобальная chrome)
- Caveat в `SiteFooter` (глобальная chrome)
- Caveat в favicon / app-icon (не текстовая)

**Считаются в счёт «2 на страницу»:**
- Caveat в Hero (любой вариант)
- Caveat в content-секциях
- Caveat в product cards
- Caveat в inline-success/error states
- Caveat в Manifesto-блоке

**Контроль на этапе 12 (консистентность):** при проверке каждого шаблона §7 — сколько контентных Caveat-приписок. Если 3+ — сокращаем до 2 наиболее ценных.

### 4.4 Divider / ApothecaryBar / Fleuron

#### 4.4.1 Divider

```jsx
// Полная ширина
<hr class="border-t border-charcoal/30 my-12" />

// Decorative центрированный
<div class="flex justify-center my-12">
  <hr class="w-14 border-t border-charcoal/40" />
</div>
```

#### 4.4.2 ApothecaryBar (из §03.5 якорь 04)

Паттерн `hairline · dot · ❦ · dot · hairline`. SVG-компонент.

```jsx
function ApothecaryBar({ width = 320 }) {
  return (
    <svg viewBox="0 0 320 60" width={width} className="my-12 mx-auto block">
      <line x1="20" y1="30" x2="120" y2="30" stroke="#1C1C1C" strokeWidth="0.75" opacity="0.3"/>
      <circle cx="135" cy="30" r="1.5" fill="#1C1C1C" opacity="0.5"/>
      <text x="160" y="38" textAnchor="middle" fontFamily="Spectral, serif" fontSize="22" fill="#4A7C59" opacity="0.8">❦</text>
      <circle cx="185" cy="30" r="1.5" fill="#1C1C1C" opacity="0.5"/>
      <line x1="200" y1="30" x2="300" y2="30" stroke="#1C1C1C" strokeWidth="0.75" opacity="0.3"/>
    </svg>
  )
}
```

Используется между секциями страниц как «вдох».

#### 4.4.3 Fleuron

```jsx
<span class="
  font-spectral
  text-4xl                                 /* 48px ~ 36pt */
  text-moss/80
  inline-block
">
  ❦
</span>
```

**Запреты:**
- ❌ Не красить в SKU-цвет (всегда moss)
- ❌ Не использовать как замену wordmark в hero
- ❌ Не уменьшать меньше 14px

**Где используется как самостоятельный atom** (минимум 3 места — для прохождения чек-листа §11.3):

1. Favicon — ❦ moss на bone (16×16, 32×32, как `favicon.svg`)
2. SiteHeader — мелкий ❦ перед wordmark «ЗАЗЕМЛИ» (опционально, 12pt)
3. WhisperHero center — над/под wordmark, 36–48pt (см. §5.3.2)
4. Внутри ApothecaryBar (см. §4.4.2)

### 4.5 Doodle / MaterialDot / Badge

#### 4.5.1 Doodle

```jsx
// SKU-дудл (цветной)
<img
  src="/assets/doodles/colored/monstera-moss.svg"
  alt=""
  class="w-32 h-32 opacity-90"
/>

// Универсальный (ч-б, как фоновый акцент)
<img
  src="/assets/doodles/листик.svg"
  alt=""
  class="absolute top-8 right-8 w-16 h-16 opacity-15"
/>
```

Opacity:
- SKU-дудл крупно: 0.8–1.0
- Фоновый: 0.1–0.25
- Декоративный акцент: 0.5–0.7

#### 4.5.2 MaterialDot

```jsx
function MaterialDot({ material, size = 28 }) {
  const colors = {
    soil:      'bg-soil',
    ceramsite: 'bg-ceramsite',
    pumice:    'bg-pumice',
    sand:      'bg-sand',
    gravel:    'bg-gravel',
    moss:      'bg-moss',
    charcoal:  'bg-charcoal',
  }
  return (
    <div
      class={`rounded-full ${colors[material]}`}
      style={{ width: size, height: size }}
    />
  )
}
```

Используется в `/lab` для иконок компонентов.

#### 4.5.3 Badge

```jsx
// Outline (по умолчанию)
<span class="
  inline-block
  px-3 py-1                                /* 12/4 */
  font-unbounded text-xs                   /* 12px */
  uppercase
  tracking-[0.16em]                        /* 2px */
  text-charcoal/60
  border border-charcoal/15
  rounded-none
">
  1.2 л
</span>

// Solid
<span class="
  inline-block
  px-3 py-1
  font-unbounded text-xs
  uppercase
  tracking-[0.16em]
  bg-moss text-bone
  rounded-none
">
  N° 001
</span>
```

**Что можно** на badge:
- Размер «1.2 л», «2.2 л», «3.5 л»
- Серийник «N° 001»
- Латинь «monstera» (Spectral italic, без uppercase)
- Партия «партия 0» (Spectral italic)

**Запрещено:**
- ❌ «хит» / «new» / «sale» / «last chance» — TOV §3 blacklist
- ❌ «скидка» / «-30%»

### 4.6 Frame2x (опциональный wrapper)

Веб-версия двойной apothecary рамки.

```jsx
function Frame2x({ children }) {
  return (
    <div class="relative p-2">
      {/* Outer 1px opacity 0.5 */}
      <div class="absolute inset-0 border border-charcoal/50 pointer-events-none" />
      {/* Inner 0.5px opacity 0.3, отступ 6px */}
      <div class="absolute inset-[6px] border-[0.5px] border-charcoal/30 pointer-events-none" />
      <div class="relative">{children}</div>
    </div>
  )
}
```

Применяется к:
- Карточкам растений на `/collectio` (опционально)
- Hero-блоку `/about` (для «обложечного» эффекта)
- Финал-блоку email-подписки

---

## 5. Molecules

### 5.1 ProductCardMini / ProductCardFull

#### 5.1.1 ProductCardMini (для `/collectio`)

```jsx
<a href="/collectio/monstera" class="
  group
  flex flex-col
  bg-bone p-8
  border border-charcoal/15
  transition-[transform,border-color] duration-200 ease-out
  hover:-translate-y-1 hover:border-charcoal/40
">
  {/* SKU-дудл */}
  <img src="/assets/doodles/colored/monstera-moss.svg" alt="" class="h-32 w-32 mb-6" />

  {/* Латынь */}
  <span class="font-spectral italic text-sm text-moss/75 mb-1">monstera</span>

  {/* Русское имя */}
  <h3 class="font-unbounded font-medium text-2xl text-charcoal/80 mb-3">Заземли Монстеру</h3>

  {/* Размеры */}
  <div class="flex gap-1 mb-4">
    <Badge>2.2 л</Badge>
    <Badge>3.5 л</Badge>
  </div>

  {/* Цена */}
  <div class="mt-auto pt-4 border-t border-charcoal/15 flex items-baseline justify-between">
    <span class="font-spectral italic text-xs text-charcoal/40">от</span>
    <span class="font-unbounded text-lg">2 190 ₽</span>
  </div>
</a>
```

#### 5.1.2 ProductCardFull (для `/collectio/[plant]`)

Composition top→bottom:

1. `KickerHeader` («COLLECTIO ZAZEMLI · N° 001 · monstera»)
2. `H1` «Заземли Монстеру» (Unbounded 700, text-4xl)
3. `SerialNumber` (Spectral italic 60px, цвет SKU)
4. Hero-картинка: крупный SKU-дудл или фотография коробки (на `var(--surface-warm)` фоне)
5. Размер-селектор (3 chip-badges 1.2 / 2.2 / 3.5 л, выбор обновляет цену)
6. Цена (Unbounded 700, text-4xl)
7. Кнопки: primary «Купить на Ozon» + secondary «Открыть лабораторию»
8. CaveatNote SKU-humor (например «она уже лезет из горшка!»)

### 5.2 RitualStep (из §15 ритуала)

> **Обобщён 2026-05-03** после уточнения Насти про линейку ритуалов заботы.
> `RitualStep` — это **универсальный шаг любого ритуала**, не только пересадки. В MVP используется для 4 шагов пересадки (00 / 01 / 02 / 03). В v2+ переиспользуется для других ритуалов с произвольным числом шагов: подкормка (3 шага), укоренение (5 шагов), реанимация (6 шагов) и т.д.

```jsx
function RitualStep({ number, title, description, hint, isFirst = false }) {
  const bgClass = isFirst ? 'bg-moss text-bone' : 'bg-charcoal text-bone'
  const numberClass = isFirst ? 'text-bone/95' : 'text-moss'

  return (
    <div class={`flex flex-col p-8 min-h-[260px] ${bgClass}`}>
      <div class={`font-unbounded font-black text-5xl leading-none ${numberClass}`}>
        {number}
      </div>
      <div class="font-unbounded font-black text-base mt-4 leading-tight">
        {title}
      </div>
      <p class="font-spectral italic text-sm opacity-90 mt-auto pt-4 leading-relaxed">
        {description}
      </p>
      <div class="font-caveat text-lg text-buttercup mt-2">
        → {hint}
      </div>
    </div>
  )
}

// Использование
<RitualStep
  number="00"
  title="ПРИХОД"
  description="Достань коробку, поставь на стол, выдохни. Ритуал начался."
  hint="можно не торопиться"
  isFirst={true}
/>
```

### 5.3 WhisperPhrase / WhisperHero

#### 5.3.1 WhisperPhrase

```jsx
function WhisperPhrase({ text, color = 'moss', rotation = -1, direction = 'right' }) {
  const colorMap = {
    moss:      'text-moss',
    cosmos:    'text-cosmos',
    iris:      'text-iris',
    sky:       'text-sky',
    buttercup: 'text-buttercup',
    poppy:     'text-poppy',
  }
  const arrow = direction === 'left' ? '←' : '→'
  const arrowFirst = direction === 'right'

  return (
    <div
      class={`font-spectral italic text-lg ${colorMap[color]}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {arrowFirst ? `${arrow} ${text}` : `${text} ${arrow}`}
    </div>
  )
}
```

#### 5.3.2 WhisperHero (из §07 Editorial Whisper Mode)

```jsx
function WhisperHero({ title, slogan }) {
  return (
    <section class="relative bg-bone py-24">
      {/* Левые шёпоты */}
      <div class="absolute left-0 top-1/4">
        <WhisperPhrase text="подышать землёй" color="cosmos" rotation={-2} direction="right" />
      </div>
      <div class="absolute left-0 bottom-1/4">
        <WhisperPhrase text="11 компонентов внутри" color="buttercup" rotation={1.5} direction="right" />
      </div>

      {/* Центр */}
      <div class="text-center max-w-2xl mx-auto py-12">
        <h1 class="font-unbounded font-black text-6xl text-charcoal/80 leading-none">{title}</h1>
        <Divider />
        <p class="font-spectral italic text-lg text-moss/75 mt-6">{slogan}</p>
      </div>

      {/* Правые шёпоты */}
      <div class="absolute right-0 top-1/4">
        <WhisperPhrase text="монстера, фикус, антуриум" color="sky" rotation={1} direction="left" />
      </div>
      <div class="absolute right-0 bottom-1/4">
        <WhisperPhrase text="всё для одной пересадки" color="poppy" rotation={-1.5} direction="left" />
      </div>

      {/* Фоновые дудлы (opacity 10-15%) */}
      <Doodle src="/assets/doodles/листик.svg" position="top-8 right-1/3" opacity={0.12} />
      <Doodle src="/assets/doodles/звездочка.svg" position="bottom-8 left-1/3" opacity={0.1} />
    </section>
  )
}
```

### 5.4 MaterialsGrid (для `/lab`)

```jsx
function MaterialsGrid() {
  const materials = [
    { dot: 'soil',      name: 'Торф нейтральный', role: 'основа · влагоудержание', source: 'EDIS UF/IFAS' },
    { dot: 'soil',      name: 'Торф кислый',      role: 'для антуриума · pH 4.5–5.5', source: 'POWO Kew' },
    { dot: 'ceramsite', name: 'Керамзит',         role: 'дренаж · аэрация', source: '—' },
    { dot: 'sand',      name: 'Кокос',            role: 'влагоёмкость · структура', source: 'Caron' },
    { dot: 'pumice',    name: 'Диатомит',         role: 'аэрация · pH-стабилизация', source: 'Atiyeh' },
    { dot: 'gravel',    name: 'Цеолит',           role: 'катионообмен · удержание азота', source: 'Mumpton' },
    { dot: 'pumice',    name: 'Пеностекло',       role: 'лёгкая аэрация · долговечность', source: '—' },
    { dot: 'moss',      name: 'Мох сфагнум',      role: 'влагоудержание · pH-кислота', source: 'POWO Kew' },
    { dot: 'charcoal',  name: 'Биочар',           role: 'сорбент · защита от гниения', source: 'Lehmann' },
    { dot: 'sand',      name: 'Кварц / песок',    role: 'дренаж · структура', source: '—' },
    { dot: 'soil',      name: 'Биогумус',         role: 'питательная база · микрофлора', source: 'Семенова' },
  ]
  return (
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {materials.map(m => (
        <div class="flex flex-col gap-3 p-6 border border-charcoal/15">
          <MaterialDot material={m.dot} size={32} />
          <h4 class="font-unbounded text-base text-charcoal/80">{m.name}</h4>
          <p class="font-spectral italic text-sm text-charcoal/60">{m.role}</p>
          {m.source !== '—' && (
            <span class="font-spectral italic text-xs text-charcoal/40 mt-auto">— {m.source}</span>
          )}
        </div>
      ))}
    </div>
  )
}
```

### 5.5 EmailSubscribeForm

```jsx
function EmailSubscribeForm({ context = 'main' }) {
  // context: 'main' (главная) или 'dnevnik' (после QR)
  const isDnevnik = context === 'dnevnik'

  return (
    <Frame2x>
      <div class="p-12">
        <KickerHeader>
          {isDnevnik ? 'ДНЕВНИК НАТУРАЛИСТА · N°001' : 'В КОЛЛЕКЦИЮ · ПОДПИСКА'}
        </KickerHeader>

        <h2 class="font-unbounded text-3xl text-charcoal/80 mb-4">
          {isDnevnik ? 'Записала тебя в дневник.' : 'Один год · 4 письма'}
        </h2>

        <p class="font-spectral italic text-lg text-charcoal/70 mb-8 max-w-prose">
          {isDnevnik
            ? 'Раз в сезон напомним, что важно для твоего растения. Не больше 4 писем.'
            : 'Сезонный календарь ухода. Без маркетинга, без скидок.'}
        </p>

        <form class="flex flex-col gap-4 max-w-md">
          <FormField label="Email">
            <Input type="email" placeholder="hello@zazemli.com" />
          </FormField>

          {isDnevnik && (
            <>
              <FormField label="Растение">
                <Select>
                  <option>Монстера</option>
                  <option>Фикус</option>
                  {/* ... все 7 */}
                </Select>
              </FormField>
              <FormField label="Дата пересадки">
                <Input type="date" />
              </FormField>
            </>
          )}

          <Button variant="primary">Подписаться</Button>
        </form>

        {isDnevnik && (
          <CaveatNote variant="brand-signature" class="mt-8">
            корни скажут спасибо
          </CaveatNote>
        )}
      </div>
    </Frame2x>
  )
}
```

---

## 6. Organisms

### 6.1 SiteHeader / SiteFooter

#### 6.1.1 SiteHeader

```jsx
function SiteHeader() {
  return (
    <header class="sticky top-0 z-50 bg-bone border-b border-charcoal/15">
      <div class="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" class="font-unbounded font-medium text-base tracking-tight text-charcoal/80">
          ЗАЗЕМЛИ
        </a>

        {/* Nav */}
        <nav class="flex gap-8">
          <a href="/collectio" class="font-unbounded text-sm text-charcoal/70 hover:text-charcoal">коллекция</a>
          <a href="/lab"        class="font-unbounded text-sm text-charcoal/70 hover:text-charcoal">лаборатория</a>
          <a href="/guide"      class="font-unbounded text-sm text-charcoal/70 hover:text-charcoal">гайд</a>
          <a href="/about"      class="font-unbounded text-sm text-charcoal/70 hover:text-charcoal">о бренде</a>
        </nav>

        {/* Кnockout Caveat (опционально) */}
        <span class="font-caveat text-base text-moss/60 hidden md:inline-block -rotate-1">
          заземлись
        </span>
      </div>
    </header>
  )
}
```

#### 6.1.2 SiteFooter (один из 1–2 dark-секций)

```jsx
function SiteFooter() {
  return (
    <footer class="bg-charcoal text-bone">
      <div class="max-w-screen-xl mx-auto px-6 py-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Wordmark */}
          <div>
            <div class="font-unbounded font-black text-3xl">ЗАЗЕМЛИ</div>
            <div class="font-spectral italic text-base text-bone/55 mt-3">
              Заземли себя.
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 class="font-unbounded text-xs uppercase tracking-[0.25em] text-bone/40 mb-4">
              Коллекция
            </h4>
            <ul class="flex flex-col gap-2 font-unbounded text-sm">
              <li><a href="/collectio" class="text-bone/70 hover:text-bone">все растения</a></li>
              <li><a href="/lab" class="text-bone/70 hover:text-bone">лаборатория</a></li>
              <li><a href="/guide" class="text-bone/70 hover:text-bone">гайд по пересадке</a></li>
              <li><a href="/about" class="text-bone/70 hover:text-bone">о бренде</a></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 class="font-unbounded text-xs uppercase tracking-[0.25em] text-bone/40 mb-4">
              Связь
            </h4>
            <ul class="flex flex-col gap-2 font-unbounded text-sm">
              <li><a href="https://instagram.com/zazemli" class="text-bone/70 hover:text-bone">Instagram</a></li>
              <li><a href="https://t.me/zazemli" class="text-bone/70 hover:text-bone">Telegram</a></li>
              <li><a href="mailto:hello@zazemli.com" class="text-bone/70 hover:text-bone">hello@zazemli.com</a></li>
            </ul>
          </div>
        </div>

        <ApothecaryBar />

        <div class="flex items-center justify-between text-xs text-bone/40 font-unbounded">
          <span>© 2026 ИП Заземли · Москва</span>
          <span class="font-caveat text-base text-moss/60 -rotate-1">
            корни скажут спасибо
          </span>
        </div>
      </div>
    </footer>
  )
}
```

### 6.2 Hero (default + Whisper)

#### 6.2.1 Hero.default (для главной)

```jsx
function HeroDefault() {
  return (
    <section class="bg-bone py-24 md:py-32 relative">
      <div class="max-w-screen-xl mx-auto px-6 text-center">
        <KickerHeader>COLLECTIO ZAZEMLI · N°001 · ПАРТИЯ 0</KickerHeader>

        <h1 class="
          font-unbounded font-bold
          text-charcoal/80
          leading-none tracking-tight
          mt-6
        "
        style={{ fontSize: 'clamp(2.5rem, 5vw, 4.75rem)' }}>
          Заземли растение,<br/>заземли себя.
        </h1>

        <Divider class="my-10 mx-auto w-14" />

        <p class="font-spectral italic text-lg md:text-xl text-moss/75 max-w-prose mx-auto">
          Чем больше цифры — тем важнее земля.
        </p>

        <div class="mt-12 flex flex-wrap justify-center gap-4">
          <Button variant="primary">Посмотреть коллекцию</Button>
          <Button variant="secondary">Подписаться на дневник</Button>
        </div>

        {/* Фоновый дудл */}
        <img
          src="/assets/doodles/colored/monstera-moss.svg"
          class="absolute top-1/2 left-8 w-32 opacity-15 -translate-y-1/2 hidden md:block"
          alt=""
        />

        {/* Caveat снизу */}
        <span class="font-caveat text-lg text-moss/60 mt-12 inline-block -rotate-1">
          руки в землю — голова свободна
        </span>
      </div>
    </section>
  )
}
```

#### 6.2.2 Hero.Whisper (альтернативный, для `/about`)

См. `WhisperHero` в §5.3.2.

### 6.3 CollectionGrid / CollectionPreview

#### 6.3.1 CollectionGrid (для `/collectio`)

```jsx
function CollectionGrid() {
  const plants = [/* 7 растений */]
  return (
    <section class="py-24 bg-bone">
      <div class="max-w-screen-xl mx-auto px-6">
        <KickerHeader>КОЛЛЕКЦИЯ · N°001–007</KickerHeader>
        <h2 class="font-unbounded font-bold text-3xl md:text-4xl text-charcoal/80 mt-4 mb-2 text-center">
          7 растений · 16 рецептур
        </h2>
        <p class="font-spectral italic text-lg text-charcoal/60 text-center max-w-prose mx-auto">
          Каждая рецептура — под биотоп конкретного растения. 80+ источников.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {plants.map(p => <ProductCardMini {...p} />)}
        </div>
      </div>
    </section>
  )
}
```

#### 6.3.2 CollectionPreview (для главной)

То же, но 4 карточки + ссылка «все 7 →» внизу.

### 6.4 RitualSequence (универсальный контейнер ритуала)

> **Обобщён 2026-05-03.** Не «для /guide пересадки», а для **любого ритуала линейки**. В MVP содержит 4 шага пересадки. В v2+ может содержать любое число шагов любого ритуала.

**Архитектура:** organism принимает массив `steps` и опциональный `kicker` (если page-level template не даёт собственный KickerHeader). Каждый step = `RitualStep` atom с number / title / description / hint / isFirst (для moss-фона).

```jsx
// ВАЖНО: RitualSequence — это только «грид из 4 шагов».
// Heading (KickerHeader + H2) даётся page-level template, не organism'ом.
// Это позволяет переиспользовать RitualSequence на /collectio/[plant]
// (блок «что в боксе») с другими heading'ами.

function RitualSequence({ steps }) {
  return (
    <section class="py-24 bg-chalk">
      <div class="max-w-screen-xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <RitualStep
            number="00"
            title="ПРИХОД"
            description="Достань коробку. Поставь на стол. Выдохни. Ритуал начался."
            hint="можно не торопиться"
            isFirst={true}
          />
          <RitualStep
            number="01"
            title="ЗАБОТА ДЛЯ КОРНЕЙ И РУК"
            description="Надень перчатки. Приготовь корневин. Достань растение из старого горшка."
            hint="перчатки + корневин"
          />
          <RitualStep
            number="02"
            title="НАДЁЖНЫЙ ДРЕНАЖ"
            description="Уложи керамзит слоем 1.5–2 см на дно нового горшка."
            hint="белый пакет без окошка"
          />
          <RitualStep
            number="03"
            title="ВКУСНЫЙ ГРУНТ"
            description="Засыпь смесь на 2/3 объёма. Посади растение. Досыпь, утрамбуй, полей."
            hint="белый пакет с окошком"
          />
        </div>

        <ApothecaryBar />

        <div class="text-center">
          <p class="font-spectral italic text-lg text-charcoal/70 max-w-prose mx-auto">
            Поставь растение в полутень на 3–5 дней. Дальше — наблюдай.
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <Button variant="primary">Посмотреть коллекцию</Button>
            <Button variant="secondary">Подписаться на дневник</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

## 7. Templates (wireframes 7 страниц)

Для каждой страницы — порядок organisms + опции + регистр.

### 7.1 `/` (главная)

```
SiteHeader (bone)
HeroDefault (bone · padding 96/128 desktop)         · регистр: Редактор
ApothecaryBar
CollectionPreview (bone, 4 карточки + «все →»)      · регистр: Наставник
ApothecaryBar
section "Лаб-тизер" (chalk, alterning bg)           · регистр: Наставник
  - KickerHeader «11 КОМПОНЕНТОВ»
  - H2 «В каждом боксе — 11 компонентов»
  - 2 строки Spectral italic
  - Button «Открыть лабораторию»
ApothecaryBar
section "Гайд-тизер" (bone)                          · регистр: Наставник
  - KickerHeader «РИТУАЛ ПЕРЕСАДКИ · 4 ШАГА»
  - H2 «Пересадка за 15 минут»
  - 3 RitualStep preview-mini
  - Button «Полный гайд»
ApothecaryBar
EmailSubscribeForm (context=main, bone)              · регистр: Подруга
SiteFooter (charcoal)
```

### 7.2 `/collectio` (витрина)

```
SiteHeader
KickerHeader «КОЛЛЕКЦИЯ»                              · регистр: Наставник
H1 «7 растений · 16 рецептур»
Подзаголовок (Spectral italic)
CollectionGrid (7 карточек)
ApothecaryBar
EmailSubscribeForm
SiteFooter
```

### 7.3 `/collectio/[plant]` (страница растения · пример: monstera)

`data-sku="monstera"` на body — переключает `--accent-sku` в moss.

```
SiteHeader
ProductCardFull (bone, опционально Frame2x)            · регистр: Наставник
  - KickerHeader «COLLECTIO ZAZEMLI · N° 001 · monstera»
  - H1 «Заземли Монстеру»
  - SerialNumber (moss-цвет)
  - Hero-картинка (SKU-дудл крупно или фото) на chalk-фоне
  - Селектор размера (Badge × 3)
  - Цена + Button «Купить на Ozon»
  - CaveatNote SKU-humor

section "Что в боксе" (chalk-фон)                       · регистр: Наставник
  - KickerHeader «СОСТАВ БОКСА · 4 УРОВНЯ»
  - 4 RitualStep компактных (00 приход / 01 защита / 02 дренаж / 03 грунт)

section "Мини-рецептура" (bone)                         · регистр: Наставник
  - KickerHeader «РЕЦЕПТУРА monstera»
  - MaterialsGrid в компактной версии (8–10 компонентов с %)
  - Button secondary «Открыть полную лабораторию»

section "Контекст растения" (chalk)                     · регистр: Редактор
  - H3 «Биотоп монстеры»
  - 2–3 абзаца Spectral italic narrative (источник: Заземли_научное_обоснование_рецептур.md)

ApothecaryBar
section "Связанное"                                      · регистр: Подруга
  - Button primary «Купить на Ozon»
  - Button secondary «Полный гайд по пересадке»
  - Ссылка-link «о бренде →» (одна строка, Spectral italic, ведёт на /about)
EmailSubscribeForm
SiteFooter
```

### 7.4 `/lab` (лаборатория)

```
SiteHeader
WhisperHero «Лаборатория грунта»                        · регистр: Редактор
  - Whisper-фразы вокруг: «11 компонентов внутри», «80+ источников», «биотоп каждого SKU», «curated»

ApothecaryBar

section "11 компонентов" (bone)                          · регистр: Наставник
  - KickerHeader «АТОМЫ ГРУНТА»
  - H2 «11 компонентов»
  - 2 абзаца Spectral italic про принцип «рецептура под биотоп»
  - MaterialsGrid (полные 11 карточек)

ApothecaryBar

section "7 растений · краткие карточки" (chalk)          · регистр: Наставник
  - KickerHeader «РЕЦЕПТУРЫ · N°001–007»
  - 7 мини-карточек растений с anchor-id (#monstera, #ficus, ...)
  - Каждая: SKU-дудл + русское имя + биотоп 1 строка + Spectral italic %-таблица

ApothecaryBar

section "Полное обоснование" (bone)                      · регистр: Наставник
  - H3 «Научное обоснование рецептур»
  - Spectral italic про 343 строки / 80+ источников / POWO Kew / EDIS UF/IFAS / Aroid Society
  - Button primary «Скачать PDF (343 строки)»

EmailSubscribeForm
SiteFooter
```

### 7.5 `/guide` (гайд)

```
SiteHeader
section Hero (bone, упрощённый)                          · регистр: Наставник
  - KickerHeader «РИТУАЛ ПЕРЕСАДКИ»
  - H1 «Пересадка растения за 15 минут»
  - Spectral italic подзаголовок

section "Что приготовить" (bone)                          · регистр: Наставник
  - H3 «Что подготовить»
  - Список (нумерованный): пустой горшок · газета · стакан воды

RitualSequence (chalk-фон) — основной блок              · регистр: Наставник
  - 4 RitualStep

ApothecaryBar

section "После пересадки" (bone)                          · регистр: Подруга
  - H3 «Дальше»
  - Spectral italic про 3–5 дней в полутени
  - CaveatNote «корни скажут спасибо»
  - Button «Подписаться на дневник»

SiteFooter
```

### 7.6 `/about` (о бренде)

```
SiteHeader
WhisperHero «ЗАЗЕМЛИ»                                    · регистр: Редактор
  - Hero-цитата основателя (Цитата 1 из TOV §7)
  - Caveat снизу

ApothecaryBar

section "Манифест" (bone, в Frame2x)                     · регистр: Редактор
  - Цитата 1 (полная) Spectral italic 22px
  - Подпись «— Настя, основательница»

ApothecaryBar

section "Для кого" (chalk)                                · регистр: Редактор
  - Цитата 2 (про аудиторию) Spectral italic 18px
  - Заметка про инсайт «материальная эстетика через труд и грязь»

ApothecaryBar

section "Принципы бренда" (bone)                          · регистр: Наставник
  - KickerHeader «ЧЕТЫРЕ ПРИНЦИПА»
  - 4 принципа в grid (из §06 брендбука):
    - Строгость + подмигивание
    - Наивность ≠ инфантильность
    - Ритуал, не рутина
    - Говорим как друг
  - Каждый принцип: H4 + Spectral italic объяснение

ApothecaryBar

section "Где нас найти" (chalk)                          · регистр: Подруга
  - IG, TG, email
  - Button «Подписаться на дневник»

SiteFooter
```

### 7.7 `/diary-signup` (подписка)

URL-ключ: `data-sku` неактивен (без SKU-цвета).

```
SiteHeader
section "Приветствие" (bone)                              · регистр: Подруга
  - KickerHeader «ДНЕВНИК НАТУРАЛИСТА · N°001»
  - H1 «Привет. Записала тебя в дневник.» (Unbounded 700 38px)
  - Spectral italic подзаголовок (TOV §4.4 шаблон)

EmailSubscribeForm (context=dnevnik, в Frame2x)         · регистр: Подруга
  - Email + Растение (select) + Дата пересадки (date)
  - Button primary «Подписаться»

section "Что будет в письмах" (chalk)                     · регистр: Наставник
  - KickerHeader «4 ПИСЬМА ЗА ГОД» (или больше — см. EMAIL_DIARY_LOGIC §1.2 — Настя 2026-05-03: «рассылки чуть чаще»)
  - 4 карточки с триггерами (MVP):
    - +14 дней: «Растение освоилось»
    - +90 дней: «Первый сезон позади»
    - +180 дней: «Полгода рядом»
    - +365 дней: «Прошёл год · пора в новую землю» — **окошко в следующую коллекцию** (по уточнению Насти 2026-05-03)
  - В v2 добавляются триггеры для других ритуалов линейки: +30 дней «пора подкормить», +60 дней «черенки готовы», и т.д. (см. §10.5)

ApothecaryBar

section "Inline-успех" (отображается после submit)
  - CaveatNote «корни скажут спасибо»
  - Spectral italic «Подтвердили подписку. Первое письмо через 14 дней.»
  - Spectral italic «Пока — открой дневник на стр II.»

SiteFooter
```

---

## 8. Правила консистентности с печатью

### 8.1 Типографика — мост между медальоном/листовкой и веб-страницей

| Печать | Веб-эквивалент | Связь |
|---|---|---|
| Медальон ⌀100мм wordmark «МОНСТЕРА» (Unbounded 900 ~22pt) | H1 страницы растения (Unbounded 700 text-4xl 48px) | Одна и та же воспринимаемая «громкость» при разных кеглях |
| Листовка «РУКИ В ЗЕМЛЮ» (Unbounded 700) | Hero лвл-2 на главной (опция) | Слоган-матрёшка Lvl 2 |
| COLLECTIO ZAZEMLI на дневнике (Unbounded 500 11pt ls 2) | `KickerHeader` атом | Та же шапка, тот же tracking |
| N° 001 на медальоне (Spectral italic 36pt) | `SerialNumber` атом | Один и тот же стиль и формула |
| Caveat «корни скажут спасибо» на листовке | `CaveatNote` атом | Один и тот же rotate −1°, один и тот же кегль |

### 8.2 Apothecary якоря — пятёрка переходов

| Печать (§03.5) | Веб-компонент | Где живёт в DS |
|---|---|---|
| COLLECTIO-шапка | KickerHeader | §4.3.1 |
| N°[партия][SKU] | SerialNumber | §4.3.2 |
| 2-frame рамка | Frame2x | §4.6 |
| Apothecary-bar (hairline·dot·❦·dot·hairline) | ApothecaryBar | §4.4.2 |
| Fleuron ❦ | Fleuron | §4.4.3 |

### 8.3 Слоган-матрёшка — Lvl по страницам

| Lvl | Слоган | Веб-страница |
|---|---|---|
| 0 | «Заземли себя.» | SiteFooter, favicon-подпись |
| 1 | «Ритуал пересадки.» | Подзаголовок секции `/collectio` |
| 2 | «Руки в землю. Голова свободна.» | Опционально в hero (альтернатива) |
| 3 | «Заземли растение, заземли себя.» (без префикса «Ритуал пересадки:» — выбор Насти) | H1 главной `/` · эпиграф `/about` |
| 4 | Манифест 4 строки | Тело `/about` |

### 8.4 Дудлы — единый язык

Один и тот же набор SVG (`assets/doodles/colored/` для SKU + `assets/doodles/` для универсальных) используется и в печати, и в вебе. В вебе: opacity 10–25% для фона, 50–80% для акцента, 80–100% для hero/карточек.

---

## 9. Регистры (TOV → визуальная плотность)

Брендбук §06 + TOV §1.2 фиксируют 3 регистра. DS добавляет визуальное соответствие:

### 9.1 Редактор (эстетичный минималист)

**Визуальная плотность:**
- `--section-padding-y` = 96px (desktop) / 64px (mobile)
- Максимум воздуха между блоками
- Использование `Hero.Whisper` в приоритете над `Hero.default`
- Spectral italic — основной шрифт narrative
- Caveat — редкая пасхалка (1 на страницу макс)
- Максимум 1 цветной элемент на страницу
- ApothecaryBar между всеми секциями

**Где:** `/`, `/about`, `/lab` (intro)

### 9.2 Наставник (деловой айтишник + тёплая внимательность)

**Визуальная плотность:**
- `--section-padding-y` = 64px (desktop) / 48px (mobile)
- Структурированные блоки: grid / list / table
- Unbounded для всех заголовков
- Spectral italic — только описания, не narrative
- KickerHeader над каждой H1/H2
- Возможны 2–3 цветных элемента (если страница привязана к SKU)

**Где:** `/lab` (основной), `/guide`, `/collectio`, `/collectio/[plant]`

### 9.3 Подруга (деловая знакомая, вкус к заботе)

**Визуальная плотность:**
- `--section-padding-y` = 48px / 32px
- Чуть плотнее, чем Наставник
- Прямой императив на CTA
- Caveat-приписки чаще (но в рамках «макс 2 на коллекцию страниц»)
- Inline-success-сообщения с CaveatNote

**Где:** `/diary-signup`, success/error states форм, email-templates (вне MVP)

---

## 10. Правила добавления компонентов в DS

Чтобы DS не разрасталась хаосом, любое предложение нового компонента — через 5 фильтров:

### Фильтр 1 — Уже есть?

Этот компонент уже есть в atoms / molecules / organisms? Если да — почему не подходит существующий? Если нужна **вариация** — расширяем существующий через `variant` prop, не создаём новый.

### Фильтр 2 — Уровень atomic design?

Какому уровню относится: atom / molecule / organism / template? Если не можешь определить — это **не самостоятельный компонент**, а композиция существующих.

### Фильтр 3 — Какие токены?

Какие токены он использует из §2–3? Все ли из существующих — или нужен новый primitive/semantic? Если нужен новый — сначала добавляется в §2.x или §3, потом компонент.

### Фильтр 4 — 6 состояний?

Все ли состояния покрыты:
- default / hover / focus / active / disabled / loading-or-error

Если нет — компонент не готов к DS, нужно довести.

### Фильтр 5 — Соответствует главному принципу?

Соответствует ли §1.1 («каждая страница — экспонат в музее»)? Если добавление компонента ломает тишину или вводит «громкость» (агрессивные акценты, лишние цвета, drop-shadows, скруглённые углы) — отказ.

### 10.5 Правила расширения линейки ритуалов

> Зафиксировано 2026-05-03 после уточнения Насти про линейку ритуалов заботы (§1.1.1).

Чтобы добавить **новый ритуал** в линейку (например, «подкормка», «укоренение», «реанимация») без полной переделки DS:

#### Шаг 1 — Определить ритуал

| Что | Где живёт |
|---|---|
| Название ритуала | RU + латынь-эквивалент, если есть |
| Слаг URL | транслит (`/rituals/podkormka`) |
| Число шагов | 3–7 (универсально). Каждый шаг = `RitualStep` atom |
| Цветовой режим | bone-основной + dark-блок (если есть). SKU-цвета — если ритуал привязан к конкретному растению, иначе только moss |
| Связь с дневником | Какой триггер из EMAIL_DIARY_LOGIC активирует промо этого ритуала |

#### Шаг 2 — Добавить контент в `/content/rituals/[name].ts`

Структура файла:

```ts
export const ritualPodkormka = {
  slug: 'podkormka',
  nameRu: 'Подкормка',
  nameLat: undefined,                            // не у всех ритуалов есть латынь
  kicker: 'РИТУАЛ ПОДКОРМКИ · N ШАГОВ',
  h1: 'Подкормка растения за 5 минут',
  subtitle: 'Раз в сезон. После пересадки.',
  narrative: 'Питание корней',                   // концепция ритуала (по образцу Rituals.com — каждая серия со своим нарративом)
  steps: [
    { number: '00', title: 'ПРИГОТОВЛЕНИЕ', description: '...', hint: '...' },
    { number: '01', title: '...', description: '...', hint: '...' },
    // и т.д.
  ],
  relatedSkus: ['monstera', 'ficus', ...],       // на каких SKU применимо
  emailTrigger: '+90',                            // какой email-триггер из EMAIL_DIARY_LOGIC активирует
}
```

**Образец нарративов** (см. Rituals.com — каждая серия со своей историей):

| Ритуал | Нарратив (1 строка) |
|---|---|
| peresadka | Руки в землю — голова свободна |
| podkormka | Питание корней — спокойная сила |
| ukorenenie | Новая жизнь из старого листа |
| reanimaciya | Спасение через паузу |
| razmnozhenie | Один лист — много жизней |
| sezonnaya-podgotovka | Готовы к зимнему сну |

#### Шаг 3 — Использовать существующие компоненты

Никаких новых atoms / molecules / organisms не нужно. Используем:
- `RitualSequence` — контейнер шагов (organism)
- `RitualStep` — каждый шаг (atom/molecule)
- `KickerHeader` (atom)
- `ApothecaryBar` (atom)
- `Button` (atom)

#### Шаг 4 — Добавить template `/rituals/[name]`

Структура страницы повторяет `/guide` (§7.5), только с другим контентом из `ritualPodkormka`.

#### Шаг 5 — Обновить hub `/rituals/`

Hub-страница `/rituals/` (в v2) — это grid карточек со всеми ритуалами линейки. Каждая карточка — `ProductCardMini`-like, но не для SKU, а для ритуала: KickerHeader («РИТУАЛ N°X») + название + 2–3 строки описания + Button «Открыть».

#### Шаг 6 — Обновить навигацию

`SiteHeader` (§6.1.1) меняет ссылку «гайд» → «ритуалы» (множественное число). Сам `/guide` либо редиректит на `/rituals/peresadka` (legacy), либо остаётся как алиас.

#### Шаг 7 — Тест на чек-лист §11

Новый ритуал проходит чек-лист консистентности. Если ломает — фикс или отказ.

---

## 11. Чек-лист консистентности

Применяется на этапе 12. После проверки каждого пункта — DS можно отдавать СТО.

### 11.1 Токены и спеки

- [ ] Каждый token DS ссылается на конкретный раздел брендбука v3
- [ ] Размеры из modular scale Major Third (12/14/16/20/24/30/38/48/60/76)
- [ ] Spacing из 8pt grid (4/8/12/16/24/32/48/64/96/128)
- [ ] Opacity из §18 шкалы (0.3 / 0.4 / 0.5 / 0.7 / 0.75 / 0.8 + спец)
- [ ] Letter-spacing из §18 шкалы (1.6 / 0 / −1 / 2.5)
- [ ] Цвета только из §04 палитры (никаких новых hex)

### 11.2 Принципы

- [ ] Правило 60/30/10 соблюдено на каждом шаблоне (§7)
- [ ] SKU-цвета только на `/collectio/[plant]` — не на других страницах
- [ ] Острые углы (radius 0–2px max) — нигде нет скруглений 4px+
- [ ] Нет drop-shadows нигде
- [ ] Все 4 ДНК-источника §01 видимы на каждой странице (минимум 3 из 4)
- [ ] Все 3 оси контраста видимы на каждой странице
- [ ] Земляные тона — только акценты-точки, не фон

### 11.3 Apothecary якоря

- [ ] KickerHeader используется минимум на 5 страницах
- [ ] SerialNumber — на `/collectio/[plant]` всех 7 SKU
- [ ] ApothecaryBar — между секциями на каждой странице
- [ ] Fleuron ❦ — минимум в 3 organisms
- [ ] Frame2x — опционально, но если используется, то по правилу

### 11.4 TOV и язык

- [ ] Нет blacklist-слов TOV §3 в текстах примеров («корзина», «хит», «купите!»)
- [ ] Нет эмодзи нигде (TOV §1.3)
- [ ] Caveat-приписки — макс 2 на коллекцию страниц
- [ ] Латынь — только род растения (monstera, ficus, ...)
- [ ] Слоган-матрёшка §02 — правильный Lvl на каждой странице

### 11.5 Компоненты

- [ ] **Interactive atoms** (Button, Input, Select, Link) покрыты 6 состояниями (default/hover/focus/active/disabled/loading). **Не-interactive atoms** (Divider, Fleuron, MaterialDot, CaveatNote, Badge, KickerHeader, SerialNumber, ApothecaryBar, Doodle, Frame2x) — состояний не имеют, проверяется только корректность variants
- [ ] Все molecules имеют пример использования
- [ ] Все organisms ссылаются на правильные molecules
- [ ] Все templates ссылаются на правильные organisms

### 11.6 Технические

- [ ] Mobile-first, проверено на 375 / 768 / 1280 (минимум)
- [ ] WCAG 2.1 AA для всех текстовых сочетаний (charcoal/bone OK, moss/bone проверить, SKU/bone — только large text)
- [ ] Motion: opacity + translateY + 200–300ms (нет анимации color/font-size/layout)
- [ ] Hero-clamp вместо media-queries для фluид-типа

---

## 12. История версий

- **v0.6 STRUCTURE** (2026-05-03) — этап 6: скелет 10 разделов.
- **v0.7 FILLED** (2026-05-03) — этап 7: наполнение конкретными значениями. Primitive токены, semantic токены, 6 групп atoms с примерами Tailwind, 5 molecules с компонентами, 4 organisms, 7 templates с порядком секций, правила консистентности с печатью, регистры → визуальная плотность, 5 фильтров добавления компонентов, чек-лист консистентности на 30+ пунктов.
- **v0.8 SELF-REVIEWED** (2026-05-03) — этап 8 (самоервью CDO) + этап 9 (правки). 8 находок и фиксов:
  1. Конфликт двойного KickerHeader в RitualSequence + /guide template — RitualSequence теперь без своего heading, page-level template отвечает.
  2. Caveat-правило переопределено: «макс 2 на ОДНУ страницу» (было «на всю коллекцию» — двусмысленно).
  3. 3 оси контраста §1.3 — расписаны конкретно для каждой из 7 страниц.
  4. Fleuron — добавлены 4 места использования как самостоятельного atom (favicon, header, whisper-hero, внутри ApothecaryBar).
  5. Input — добавлено loading-состояние (`aria-busy`).
  6. Button — `transition-all` заменён на `transition-[opacity,transform,border-color]`.
  7. Чек-лист §11.5 — разделение interactive/non-interactive atoms.
  8. `/collectio/[plant]` template — добавлена ссылка «о бренде →» в блок «Связанное».
- **v0.9 LINEAGE-READY** (2026-05-03) — внеплановое обновление по новой стратегической рамке Насти: «бренд = линейка ритуалов заботы о растении И о себе, не только пересадка. Дневник = окошко в следующие коллекции». Изменения:
  1. §1.1.1 — новый раздел «Рамка продукта: линейка ритуалов заботы» с таблицей будущих ритуалов и архитектурными следствиями для DS.
  2. §1.6 — добавлено: DS не определяет конкретные ритуалы (это работа CPO), но предоставляет архитектурный слой для их добавления.
  3. §5.2 RitualStep — переобобщён как универсальный шаг любого ритуала (не только пересадки).
  4. §6.4 RitualSequence — переобобщён как универсальный контейнер ритуала, параметризован через `steps`.
  5. §7.7 /diary-signup — переинтерпретирован как «дневник = окошко в линейку коллекций»; добавлены упоминания будущих триггеров для других ритуалов.
  6. §10.5 — новый раздел «Правила расширения линейки ритуалов» с 7-шаговой процедурой добавления нового ритуала в DS.
- **v0.10 RITUALS-AWARE** (2026-05-03) — этап 10 ревью рабочей группы. По указанию Насти изучен бренд [Rituals.com](https://www.rituals.com/) (нидерландский, €2.43bn revenue 2025). Найдена **прямая концептуальная параллель** — Rituals превращает рутины в ритуалы в категории cosmetics. URL-pattern «The Ritual of [Name]» (sakura, karma, mehr, hammam, jing, ayurveda, amsterdam) подтверждает направление нашей `/rituals/[name]` архитектуры. Изменения:
  1. §1.1.1 — добавлен Rituals.com как prior-art подтверждение направления, таблица параллелей архитектуры.
  2. §10.5 — добавлено поле `narrative` в описание ритуала (по образцу Rituals — каждая серия со своим нарративом), образец 6 нарративов для будущих ритуалов.
  3. Анти-список: восточные мотивы / фото-баннеры в hero / масс-сегмент — что НЕ берём от Rituals, чтобы сохранить наш славянский апотекарный код.
- **v1.0 CANDIDATE** (2026-05-03) — этап 12 проверка консистен