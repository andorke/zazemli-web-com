# design-system

## Purpose

Дизайн-система ЗАЗЕМЛИ: токены из БЗ (tokens.json v1.1.0) как CSS-переменные и Tailwind-тема, ровно два self-hosted шрифтовых семейства по ролям (voice/ui), контраст-политика moss-ink, бренд-атомы и глобальные DS-запреты (без теней, ограниченные радиусы, earth-цвета только в `MaterialDot`, italic только в voice-роли).
## Requirements
### Requirement: Дизайн-токены доступны как CSS-переменные
Система SHALL транслировать токены из `../zazemli-vault/Айти/Сайт/tokens.json` v1.1.0 в CSS-переменные (`globals.css`) и Tailwind-тему: цвета (brand включая `mossInk`/`chalk`, earth, 7 SKU-цветов), **ролевую типо-шкалу по `typography.md` v3.0** (display в трёх уровнях 88/70/64, h1 52, h2 34, take/lead 24–26, body 18, small 15, caption 13, eyebrow 12, ui 14–16), спейсинг-шкалу (space-блок), opacity-шкалу, радиусы (0/2px/pill), брейкпоинты (640/768/1024/1280/1536; layout-брейкпоинт прототипов 860px). Компоненты MUST использовать только переменные/классы темы; литеральные hex-значения в компонентах запрещены. Параллельных шкал кегля быть не должно: числовая шкала общего назначения (`xs … 6xl`) в теме отсутствует.

#### Scenario: Токены подключены
- **WHEN** открыта любая страница сайта
- **THEN** на `:root` определены переменные бренд-палитры (`--color-bone: #F6F4F0`, `--color-charcoal: #1C1C1C`, `--color-moss: #4A7C59`, `--color-moss-ink: #406C4F`, `--color-chalk: #EDEBE6`) и фон страницы равен bone

#### Scenario: SKU-палитра доступна
- **WHEN** тема собрана
- **THEN** определены 7 SKU-цветов (monstera/epipremnum `#4A7C59`, ficus `#BE3A6B`, aglaonema `#7E6AAF`, zamioculcas `#C47A10`, spathiphyllum `#2878AE`, anthurium `#C03A30`)

#### Scenario: Хардкод hex отсутствует
- **WHEN** выполняется поиск hex-литералов по `src/components/` и `src/app/`
- **THEN** совпадений нет (все цвета — через тему/переменные)

#### Scenario: Шкала кегля ролевая и единственная
- **WHEN** выполняется поиск токенов кегля в `globals.css`
- **THEN** определены только ролевые токены шкалы `typography.md` v3.0, а числовых токенов общего назначения (`--text-xs`, `--text-sm`, `--text-base`, `--text-lg`, `--text-xl`, `--text-2xl` … `--text-6xl`) нет

#### Scenario: Три уровня display и не больше
- **WHEN** страница отрисована на десктопе шириной ≥ 1440
- **THEN** hero главной набран 88 px, hero карточки товара — 70 px, hero объясняющих страниц (`/lab`, `/guide`, `/diary-signup`) — 64 px; четвёртого уровня display на сайте нет, юр-страницы `/privacy` и `/terms` живут по своему шаблону и исключением не считаются

### Requirement: Два шрифтовых семейства self-hosted

Система SHALL подключать ровно два семейства через `next/font/local` из файлов репозитория: **Mulish** (variable wght, roman 300–600 + italic 300–400; роль voice — display/h1/h2/h3, тейки, латынь, нарисованный курсив) и Commissioner (variable: wght 400–500; роль ui — кикеры, кнопки, навигация, мелкий UI). Субсеттинг MUST включать кириллицу и латиницу. Оптическая ось (`opsz`) в контракте отсутствует. Fallback voice-роли SHALL быть `'Helvetica Neue', Arial, sans-serif`; серифные fallback (Georgia) MUST NOT применяться. Курсив SHALL использовать italic-файл семейства; `font-style: oblique` и `transform: skew` MUST NOT применяться. Третье семейство вводить MUST NOT. CSS-переменные шрифтов SHALL именоваться по ролям: `--font-voice`, `--font-ui`.

#### Scenario: Шрифты загружаются локально
- **WHEN** страница собрана static export и открыта
- **THEN** woff2-файлы отдаются с собственного домена (запросов к fonts.googleapis.com / fonts.gstatic.com нет) и имя voice-файла в `/_next/media/` содержит `mulish`

#### Scenario: Семейства назначены по ролям
- **WHEN** рендерится страница с заголовком, нарративным текстом и кикером
- **THEN** заголовки и нарратив используют Mulish (voice), кикеры/кнопки/навигация — Commissioner (ui)

#### Scenario: Кириллица отображается
- **WHEN** отрендерен русский текст обоими семействами
- **THEN** глифы кириллицы присутствуют в субсете (нет fallback на системный шрифт)

#### Scenario: Старые семейства выведены
- **WHEN** выполняется поиск `unbounded|spectral|caveat|literata|newsreader` (без учёта регистра) по `src/`
- **THEN** совпадений нет (ни файлов шрифтов, ни переменных, ни классов)

#### Scenario: Веса крупных заголовков — по прототипу
- **WHEN** отрендерены display-заголовки и h1/h2
- **THEN** их вес — 300–400 (строй Haeckels по прототипам), не 600 из typography.md v3.0 (известное расхождение канона, источник — прототип)

### Requirement: Контраст-политика moss-ink
Текст, ссылки и латынь на фоне bone SHALL использовать `moss-ink #406C4F` (замеренный контраст 5.5, AA) или `charcoal`; raw `moss #4A7C59` (4.43 — только large) MUST NOT применяться к тексту мельче 18pt. Исключения ≥18pt SHALL быть помечены инлайн-меткой `ds-allow: moss-large` с причиной.

#### Scenario: ds-lint защищает политику
- **WHEN** в `src/` появляется `text-moss` без метки `ds-allow: moss-large`
- **THEN** `npm run ds-lint` завершается ошибкой

#### Scenario: Ссылки на bone читаемы
- **WHEN** отрендерена текстовая ссылка на фоне bone
- **THEN** её цвет — `moss-ink` или `charcoal`, не raw `moss`

### Requirement: Бренд-атомы дизайн-системы

Система SHALL предоставлять переиспользуемые атомы: `Fleuron` (❦, цвет moss), `MaterialDot` (маркер 6–7px, цвета earth-палитры), `KickerHeader` (Commissioner, letter-spacing по прототипам, КАПС), `RitualNote` (voice-italic — Mulish 300/400 нарисованный курсив + акцентный цвет; наследник CaveatNote), `<details>`-аккордеон с поворотным caret (паттерн SourceNote прототипов), кнопки `btn`/`btn--solid` (радиус 0–2px, без тени).

#### Scenario: Атомы рендерятся согласно DS
- **WHEN** атомы отрисованы в тестовом рендере
- **THEN** Fleuron выводит символ ❦ цветом moss, KickerHeader — текст в верхнем регистре шрифтом ui-роли, RitualNote — italic voice-роли (Mulish) с акцентным цветом, кнопка не имеет box-shadow и скругления больше 2px

#### Scenario: Аккордеон раскрывается без JS-фреймворка
- **WHEN** пользователь кликает по summary аккордеона
- **THEN** контент раскрывается нативным `<details>`, caret поворачивается

### Requirement: Запреты DS соблюдаются глобально
Система MUST NOT использовать `box-shadow` (токен `shadow: null`), скругления кроме 0/2px/pill, earth-цвета вне атома `MaterialDot`, italic вне voice-семейства, SKU-цвет как цвет текста или кнопок (SKU-цвет — только декор: точки, бордеры, рукописные акценты), более одного SKU-цвета на странице.

#### Scenario: Тени и радиусы
- **WHEN** выполняется поиск `box-shadow`/`shadow-` и `rounded-` классов по `src/`
- **THEN** теней нет; радиусы только из набора {0, 2px, 9999px}

#### Scenario: SKU-цвет не используется как текстовый
- **WHEN** выполняется ds-lint по `src/`
- **THEN** SKU-цвета не применяются к body-тексту и кнопкам (допустимы только в декоративных элементах)

### Requirement: Трекинг-шкала voice-роли

Система SHALL определять трекинг как токены (CSS-переменные) и применять их к ролям типографики: display-hero `−0.035em`, display-product `−0.032em`, display-page `−0.03em`, h1 `−0.028em`, h2 `−0.024em`, take/lead `−0.02em`, eyebrow (капс) `+0.2em`, body/small/caption `0`. Заголовочные роли (display/h1/h2) MUST NOT рендериться с нулевым трекингом. Различие заголовков и тела на стыке h2 → body SHALL держаться весом и трекингом (оба семейства — гротески); при нечитаемой границе усиливается трекинг заголовка, семейство не меняется.

#### Scenario: Трекинг задан токенами
- **WHEN** тема собрана
- **THEN** на `:root` определены переменные трекинга для ролей display-hero/display-product/display-page/h1/h2/take/eyebrow и заголовочные компоненты ссылаются на них

#### Scenario: Нулевой трекинг на заголовке — ошибка
- **WHEN** display/h1/h2-заголовок отрендерен с `letter-spacing: 0` или без применённого токена
- **THEN** проверка сборки (тест токенов/ds-lint) завершается ошибкой

#### Scenario: Eyebrow разрежен
- **WHEN** отрендерен eyebrow-кикер (12px, капс)
- **THEN** его letter-spacing равен `+0.2em`

### Requirement: Кегль задаётся только ролевым токеном
Система MUST NOT задавать размер текста произвольным значением: утилиты вида `text-[…]` с литеральным кеглем и точечные `clamp()` в местах применения запрещены. Адаптивность display выражается внутри токена, а не в классе на элементе. Запрет проверяется автоматически наравне с действующими запретами DS (hex-литералы, выведенные семейства, нулевой трекинг заголовков).

#### Scenario: Произвольный кегль в разметке
- **WHEN** выполняется ds-lint по `src/`
- **THEN** каждое вхождение `text-[…]` с литеральным размером или `clamp()` помечено как нарушение

#### Scenario: Ролевой класс проходит
- **WHEN** элемент набран ролевым классом шкалы (`text-display-hero`, `text-h2`, `text-body`, `text-caption` и прочие роли v3.0)
- **THEN** ds-lint нарушений не находит

### Requirement: Motion-токены и границы анимации
Система SHALL транслировать duration-токены из `tokens.json.motion` в CSS-переменные `globals.css` рядом с существующими easing-токенами: `--duration-fast: 150ms`, `--duration-base: 200ms`, `--duration-medium: 300ms`, `--duration-slow: 400ms`, `--duration-page: 600ms`. Компоненты SHALL использовать токены длительности/easing вместо магических чисел.

Анимируемые свойства ограничены списком: `opacity`, `transform`, `background-color`, `border-color`. Layout-свойства (`width`, `height`, `margin`, `padding`, `font-size`, `top`, `left`) MUST NOT анимироваться.

Точечные расширения принципа «MVP без анимации» (решение владельца, интервью 2026-08-01):
- Sequential reveal (каскад с лесенкой задержек) SHALL допускаться только для entrance-хореографии capability `welcome-choreography`; для hover-эффектов и произвольного скролл-декора он остаётся запрещённым.
- Расширенные амплитуды SHALL допускаться только внутри entrance: `translateY` до высоты строки (~110%) исключительно внутри маски `overflow: hidden`; `scaleX`/`scaleY` в диапазоне 0↔1 исключительно для прорисовки линий и полосок. Вне entrance действуют базовые токены (`translateY` 5–10px, `scale` ≤ 1.02).
- Vanilla rAF-цикл SHALL допускаться только в слое capability `cursor-companion`.

JS-библиотеки анимации (GSAP, Motion/Framer Motion, Lenis, AOS, anime.js и аналоги) MUST NOT добавляться в зависимости. `prefers-reduced-motion: reduce` SHALL полностью отключать все перечисленные анимации. Запреты DS (тени, радиусы, hex-литералы в компонентах) распространяются на motion-слой без исключений.

#### Scenario: Duration-токены определены
- **WHEN** собрана тема (`globals.css`)
- **THEN** определены переменные `--duration-fast/base/medium/slow/page` со значениями 150/200/300/400/600ms и существующие `--ease-standard`/`--ease-emphasized`

#### Scenario: Анимационные библиотеки отсутствуют
- **WHEN** выполняется поиск `gsap|framer-motion|motion|lenis|aos|animejs` по `package.json`
- **THEN** совпадений в зависимостях нет

#### Scenario: Каскад не применяется вне entrance
- **WHEN** проводится ревью секций вне entrance-хореографии (hover-состояния, скролл-декор)
- **THEN** лесенки задержек (sequential reveal) в них отсутствуют

#### Scenario: ds-lint остаётся зелёным
- **WHEN** выполняется `npm run ds-lint` после внедрения motion-слоя
- **THEN** проверка проходит без ошибок (нет теней, недопустимых радиусов, hex-литералов в `.tsx`)

#### Scenario: Reduced motion отключает всё
- **WHEN** включён `prefers-reduced-motion: reduce`
- **THEN** entrance-хореография, прорисовки линий/полосок и cursor-companion полностью отключены

