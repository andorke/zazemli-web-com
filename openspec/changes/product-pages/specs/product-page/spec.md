# product-page — spec (new)

## ADDED Requirements

### Requirement: Семь статических страниц товара
Система SHALL отдавать 7 страниц `/collectio/[slug]` (slug: monstera, ficus, anthurium, aglaonema, spathiphyllum, zamioculcas, epipremnum) через `generateStaticParams`; `npm run build` (static export) SHALL порождать HTML каждой. Несуществующий slug SHALL отдавать 404.

#### Scenario: Все семь страниц собираются
- **WHEN** выполняется `npm run build`
- **THEN** в `out/collectio/` присутствуют HTML всех 7 slug

#### Scenario: Неизвестный slug
- **WHEN** пользователь открывает `/collectio/ficus-lyrata`
- **THEN** рендерится 404

### Requirement: Структура страницы по прототипам collectio-*.html
Каждая страница SHALL содержать блоки в порядке прототипа: hero (kicker «Collectio Zazemli · Партия 0 · N°…», H1 «Заземли {растение}.», латынь рода italic, описание грунта, CTA «Заземлить {растение} →», строка объёмов/цены) → «Зачем именно эта земля» (+ SourceNote-аккордеон с рецензируемым источником + колба-схема процентов + мост «Весь состав и источники → в лаборатории» на `/lab`) → состав по компонентам с MaterialDot → «Что в боксе» → «Уход мы расписали за тебя» с дневник-панелью → Ритуал (RitualNote-фраза SKU) → buybar (размер-селектор + Ozon-CTA) → founder-quote «Для тех, кто создаёт цифровое, а руками тянется к земле.» → футер-мост «← Вся коллекция» на `/#collectio`. Тексты SHALL браться из `product-description.md` v1.1.1 (hero — вариант A), контент — в `src/content/sku.ts`, литералы в компонентах MUST NOT.

#### Scenario: Блоки страницы монстеры
- **WHEN** отрендерена `/collectio/monstera`
- **THEN** присутствуют H1 «Заземли монстеру.», блок «Зачем именно эта земля», состав с MaterialDot, «Что в боксе», care-блок с дневник-панелью, размер-селектор, founder-quote и ссылка «← Вся коллекция»

#### Scenario: Один h1 и мост в лабораторию
- **WHEN** отрендерена любая страница товара
- **THEN** на странице ровно один `<h1>` и есть ссылка на `/lab`

### Requirement: Данные SKU типизированы и инвариантны
`src/content/sku.ts` SHALL содержать для каждого из 7 SKU: колбу-проценты (основа/воздух/влага/дренаж, сумма = 100), состав (компонент + material-цвет), содержимое бокса, care-тексты, ритуал-фразу, размеры (объём, цена, `ozonListingUrl: string | null`), source-note. Инварианты MUST проверяться тестом.

#### Scenario: Инварианты данных
- **WHEN** выполняется unit-тест контента
- **THEN** SKU ровно 7, slug уникальны, сумма процентов каждой колбы равна 100, цены положительны

### Requirement: SKU-цвет — только декор, один на страницу
Страница SHALL устанавливать CSS-переменную `--sku` своего SKU и применять её только в декоративных элементах (kicker-акцент, бордер дневник-панели, RitualNote, MaterialDot). Текст и кнопки SHALL использовать moss-ink/charcoal. Более одного SKU-цвета на странице MUST NOT быть.

#### Scenario: Цвет декоративен
- **WHEN** отрендерена `/collectio/ficus`
- **THEN** `--sku` равен цвету фикуса (`#BE3A6B`), body-текст и CTA-кнопки не окрашены в SKU-цвет

### Requirement: Размер-селектор и Ozon-CTA
Buybar SHALL отображать селектор размеров (объём + цена) и кнопку «Купить {размер} на Ozon». Пока `ozonListingUrl` равен `null`, кнопка SHALL рендериться состоянием «Скоро на Ozon» без внешней ссылки; при появлении URL ссылка SHALL строиться через `lib/utm.ts` с `utm_content=sku00X`.

#### Scenario: Переключение размера
- **WHEN** пользователь выбирает другой объём
- **THEN** цена и текст CTA обновляются под выбранный размер

#### Scenario: Магазин ещё не открыт
- **WHEN** `ozonListingUrl` равен `null`
- **THEN** кнопка показывает «Скоро на Ozon» и не является ссылкой
