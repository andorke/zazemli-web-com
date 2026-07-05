# design-system

## Purpose

Дизайн-система ЗАЗЕМЛИ: токены из БЗ как CSS-переменные и Tailwind-тема, ровно три self-hosted шрифта, бренд-атомы и глобальные DS-запреты (без теней, ограниченные радиусы, earth-цвета только в `MaterialDot`, italic только Spectral).

## Requirements

### Requirement: Дизайн-токены доступны как CSS-переменные
Система SHALL транслировать токены из `../zazemli-vault/Маркетинг/Бренд/Айдентика/tokens.json` v1.0.1 в CSS-переменные (`globals.css`) и Tailwind-тему: цвета (brand/earth/sku), типографическая шкала, спейсинг, opacity-шкала, радиусы (0/2px/pill), брейкпоинты (640/768/1024/1280/1536). Компоненты MUST использовать только переменные/классы темы; литеральные hex-значения в компонентах запрещены.

#### Scenario: Токены подключены
- **WHEN** открыта любая страница сайта
- **THEN** на `:root` определены переменные бренд-палитры (`--color-bone: #F6F4F0`, `--color-charcoal: #1C1C1C`, `--color-moss: #4A7C59`, `--color-chalk: #EDEBE6`) и фон страницы равен bone

#### Scenario: Хардкод hex отсутствует
- **WHEN** выполняется поиск hex-литералов по `src/components/` и `src/app/`
- **THEN** совпадений нет (все цвета — через тему/переменные)

### Requirement: Три шрифтовых семейства self-hosted
Система SHALL подключать ровно три семейства через `next/font/local` из файлов репозитория: Unbounded (300/400/500/700/900), Spectral (400, 400 italic, 700), Caveat (400). Четвёртое семейство вводить MUST NOT (DS-контракт «3 шрифта max»).

#### Scenario: Шрифты загружаются локально
- **WHEN** страница собрана static export и открыта
- **THEN** woff2-файлы отдаются с собственного домена (запросов к fonts.googleapis.com / fonts.gstatic.com нет)

#### Scenario: Семейства назначены по ролям
- **WHEN** рендерится страница с заголовком, нарративным текстом и рукописной припиской
- **THEN** заголовки/UI используют Unbounded, нарратив/латынь — Spectral, приписки — Caveat

### Requirement: Бренд-атомы дизайн-системы
Система SHALL предоставлять переиспользуемые атомы с именами из БЗ: `Fleuron` (❦, цвет moss), `MaterialDot` (маркер 6–7px, цвета earth-палитры), `KickerHeader` (Unbounded 10–12px, letter-spacing 0.18em, КАПС), `CaveatNote` (Caveat 400), кнопка в DS-стиле (радиус 0–2px, без тени).

#### Scenario: Атомы рендерятся согласно DS
- **WHEN** атомы отрисованы в тестовом рендере
- **THEN** Fleuron выводит символ ❦ цветом moss, KickerHeader — текст в верхнем регистре с letter-spacing 0.18em, кнопка не имеет box-shadow и скругления больше 2px

### Requirement: Запреты DS соблюдаются глобально
Система MUST NOT использовать `box-shadow` (токен `shadow: null`), скругления кроме 0/2px/pill, earth-цвета вне атома `MaterialDot`, italic вне Spectral.

#### Scenario: Тени и радиусы
- **WHEN** выполняется поиск `box-shadow`/`shadow-` и `rounded-` классов по `src/`
- **THEN** теней нет; радиусы только из набора {0, 2px, 9999px}
