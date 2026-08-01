# design-system (delta)

## MODIFIED Requirements

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

### Requirement: Бренд-атомы дизайн-системы

Система SHALL предоставлять переиспользуемые атомы: `Fleuron` (❦, цвет moss), `MaterialDot` (маркер 6–7px, цвета earth-палитры), `KickerHeader` (Commissioner, letter-spacing по прототипам, КАПС), `RitualNote` (voice-italic — Mulish 300/400 нарисованный курсив + акцентный цвет; наследник CaveatNote), `<details>`-аккордеон с поворотным caret (паттерн SourceNote прототипов), кнопки `btn`/`btn--solid` (радиус 0–2px, без тени).

#### Scenario: Атомы рендерятся согласно DS
- **WHEN** атомы отрисованы в тестовом рендере
- **THEN** Fleuron выводит символ ❦ цветом moss, KickerHeader — текст в верхнем регистре шрифтом ui-роли, RitualNote — italic voice-роли (Mulish) с акцентным цветом, кнопка не имеет box-shadow и скругления больше 2px

#### Scenario: Аккордеон раскрывается без JS-фреймворка
- **WHEN** пользователь кликает по summary аккордеона
- **THEN** контент раскрывается нативным `<details>`, caret поворачивается

## ADDED Requirements

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
