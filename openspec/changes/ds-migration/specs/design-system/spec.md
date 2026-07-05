# design-system — delta (ds-migration)

## MODIFIED Requirements

### Requirement: Дизайн-токены доступны как CSS-переменные
Система SHALL транслировать токены из `../zazemli-vault/Айти/Сайт/tokens.json` v1.1.0 в CSS-переменные (`globals.css`) и Tailwind-тему: цвета (brand включая `mossInk`/`chalk`, earth, 7 SKU-цветов), типо-шкала ролей (84/52/34/24/18/15/13/12), спейсинг-шкала (space-блок), opacity-шкала, радиусы (0/2px/pill), брейкпоинты (640/768/1024/1280/1536; layout-брейкпоинт прототипов 860px). Компоненты MUST использовать только переменные/классы темы; литеральные hex-значения в компонентах запрещены.

#### Scenario: Токены подключены
- **WHEN** открыта любая страница сайта
- **THEN** на `:root` определены переменные бренд-палитры (`--color-bone: #F6F4F0`, `--color-charcoal: #1C1C1C`, `--color-moss: #4A7C59`, `--color-moss-ink: #406C4F`, `--color-chalk: #EDEBE6`) и фон страницы равен bone

#### Scenario: SKU-палитра доступна
- **WHEN** тема собрана
- **THEN** определены 7 SKU-цветов (monstera/epipremnum `#4A7C59`, ficus `#BE3A6B`, aglaonema `#7E6AAF`, zamioculcas `#C47A10`, spathiphyllum `#2878AE`, anthurium `#C03A30`)

#### Scenario: Хардкод hex отсутствует
- **WHEN** выполняется поиск hex-литералов по `src/components/` и `src/app/`
- **THEN** совпадений нет (все цвета — через тему/переменные)

### Requirement: Бренд-атомы дизайн-системы
Система SHALL предоставлять переиспользуемые атомы: `Fleuron` (❦, цвет moss), `MaterialDot` (маркер 6–7px, цвета earth-палитры), `KickerHeader` (Commissioner, letter-spacing по прототипам, КАПС), `RitualNote` (Newsreader italic + акцентный цвет; наследник CaveatNote), `<details>`-аккордеон с поворотным caret (паттерн SourceNote прототипов), кнопки `btn`/`btn--solid` (радиус 0–2px, без тени).

#### Scenario: Атомы рендерятся согласно DS
- **WHEN** атомы отрисованы в тестовом рендере
- **THEN** Fleuron выводит символ ❦ цветом moss, KickerHeader — текст в верхнем регистре шрифтом ui-роли, RitualNote — italic voice-роли с акцентным цветом, кнопка не имеет box-shadow и скругления больше 2px

#### Scenario: Аккордеон раскрывается без JS-фреймворка
- **WHEN** пользователь кликает по summary аккордеона
- **THEN** контент раскрывается нативным `<details>`, caret поворачивается

### Requirement: Запреты DS соблюдаются глобально
Система MUST NOT использовать `box-shadow` (токен `shadow: null`), скругления кроме 0/2px/pill, earth-цвета вне атома `MaterialDot`, italic вне Newsreader, SKU-цвет как цвет текста или кнопок (SKU-цвет — только декор: точки, бордеры, рукописные акценты), более одного SKU-цвета на странице.

#### Scenario: Тени и радиусы
- **WHEN** выполняется поиск `box-shadow`/`shadow-` и `rounded-` классов по `src/`
- **THEN** теней нет; радиусы только из набора {0, 2px, 9999px}

#### Scenario: SKU-цвет не используется как текстовый
- **WHEN** выполняется ds-lint по `src/`
- **THEN** SKU-цвета не применяются к body-тексту и кнопкам (допустимы только в декоративных элементах)

## ADDED Requirements

### Requirement: Два шрифтовых семейства self-hosted
Система SHALL подключать ровно два семейства через `next/font/local` из файлов репозитория: Newsreader (variable: opsz+wght 300–500, roman + italic; роль voice — заголовки, нарратив, латынь, italic-акценты) и Commissioner (variable: wght 400–500; роль ui — кикеры, кнопки, навигация, мелкий UI). Субсеттинг MUST включать кириллицу и латиницу. Третье семейство вводить MUST NOT. CSS-переменные шрифтов SHALL именоваться по ролям: `--font-voice`, `--font-ui`.

#### Scenario: Шрифты загружаются локально
- **WHEN** страница собрана static export и открыта
- **THEN** woff2-файлы отдаются с собственного домена (запросов к fonts.googleapis.com / fonts.gstatic.com нет)

#### Scenario: Семейства назначены по ролям
- **WHEN** рендерится страница с заголовком, нарративным текстом и кикером
- **THEN** заголовки и нарратив используют Newsreader (voice), кикеры/кнопки/навигация — Commissioner (ui)

#### Scenario: Кириллица отображается
- **WHEN** отрендерен русский текст обоими семействами
- **THEN** глифы кириллицы присутствуют в субсете (нет fallback на системный шрифт)

#### Scenario: Старые семейства выведены
- **WHEN** выполняется поиск `unbounded|spectral|caveat` (без учёта регистра) по `src/`
- **THEN** совпадений нет (ни файлов шрифтов, ни переменных, ни классов)

### Requirement: Контраст-политика moss-ink
Текст, ссылки и латынь на фоне bone SHALL использовать `moss-ink #406C4F` (замеренный контраст 5.5, AA) или `charcoal`; raw `moss #4A7C59` (4.43 — только large) MUST NOT применяться к тексту мельче 18pt. Исключения ≥18pt SHALL быть помечены инлайн-меткой `ds-allow: moss-large` с причиной.

#### Scenario: ds-lint защищает политику
- **WHEN** в `src/` появляется `text-moss` без метки `ds-allow: moss-large`
- **THEN** `npm run ds-lint` завершается ошибкой

#### Scenario: Ссылки на bone читаемы
- **WHEN** отрендерена текстовая ссылка на фоне bone
- **THEN** её цвет — `moss-ink` или `charcoal`, не raw `moss`

## REMOVED Requirements

### Requirement: Три шрифтовых семейства self-hosted
**Reason**: Типографика v1.1.0 (typography.md v2.0) сменила семейства: Unbounded/Spectral/Caveat выведены, Caveat остаётся только в печати.
**Migration**: См. ADDED «Два шрифтовых семейства self-hosted»; все использования font-переменных переименовываются на роли voice/ui.
