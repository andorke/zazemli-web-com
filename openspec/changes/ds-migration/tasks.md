# ds-migration — tasks

## 1. Шрифты

- [x] 1.1 Скачать Newsreader (variable, roman + italic) и Commissioner (variable) с Google Fonts; проверить кириллическое покрытие весов 300–500 (при пробеле — стоп и вопрос Насте)
  > Пробел найден: у Newsreader v1.003 кириллицы нет вообще (GF и upstream; в прототипах русский текст фактически рендерит Georgia-фолбэк). По решению Ивана 2026-07-05 voice-роль временно закрывает **Literata** (opsz 7–72, кириллица полная); финальное семейство — вопрос Насте. Commissioner — кириллица полная, ок.
- [x] 1.2 Субсеттинг в woff2 (кириллица+латиница+пунктуация) существующим пайплайном с сохранением осей opsz/wght; при поломке осей — откат на статические экземпляры (300/400/500 + italic)
  > Оси сохранены (Literata opsz 7–72 / wght 300–600, Commissioner wght 400–500 через partial instancing); откат не понадобился. 439 КБ на 3 файла.
- [x] 1.3 Подключить через `next/font/local` в `layout.tsx` как `--font-voice` (Newsreader) и `--font-ui` (Commissioner); удалить Unbounded/Spectral/Caveat (файлы + конфигурация)
- [x] 1.4 Переименовать font-переменные во всех компонентах (механически: display/narrative → voice, ui-роли → ui); тест «старые семейства выведены» (grep-инвариант) зелёный

## 2. Токены и шкалы

- [x] 2.1 Тест: `:root` содержит `--color-moss-ink: #406C4F`, chalk, 7 SKU-цветов (сверка с `../zazemli-vault/Айти/Сайт/tokens.json` v1.1.0) — красный
- [x] 2.2 Обновить `globals.css`: moss-ink, chalk, earth-палитра, SKU-цвета, типо-шкала ролей (84/52/34/24/18/15/13/12), spacing-шкала; ссылка на источник v1.1.0 в комменте — тест зелёный
  > Плюс прототипные цвета текста `--color-text-muted #6B6862` / `--color-ink-muted #5D5A55` (в tokens.json v1.1.0 их нет — кандидаты в v1.1.1, помечены комментом) и `--tracking-eyebrow 0.22em` из прототипа.
- [x] 2.3 Обновить семантические переменные shadcn (`--accent` и ссылки на moss → пересмотреть под политику: текстовые — moss-ink)
  > `--accent` → moss-ink, `--muted-foreground` → text-muted прототипа (был charcoal/50); `--ring` остался raw moss (outline ≥3:1 — не текст).

## 3. Атомы

- [x] 3.1 Тесты атомов: RitualNote (Newsreader italic + акцент), KickerHeader на Commissioner, `<details>`-аккордеон с caret, кнопки btn/btn--solid без тени/радиус ≤2px — красные
- [x] 3.2 Реализовать/перевести атомы: CaveatNote → RitualNote (удалить старое имя), KickerHeader → ui-роль, добавить details-аккордеон и кнопки по прототипам — тесты зелёные
  > RitualNote/rename сделаны в 1.4 (grep-инвариант требовал); здесь добавлены DetailsAccordion и BrandButton (btn/btn--solid), KickerHeader переведён на .eyebrow прототипа. Попутный фикс: cn()/twMerge научен ролевым font-size (иначе text-<цвет> вытеснял text-eyebrow).

## 4. Site-компоненты

- [x] 4.1 e2e: topbar — 3 пункта (Коллекция → `/#collectio`), без Ozon-кнопки, бургер <860px с aria-expanded — красный
- [x] 4.2 Перевёрстка SiteHeader по topbar прототипа (Sheet-механика сохраняется, вид — новые токены) — e2e зелёный
- [x] 4.3 e2e: footer — 3 колонки + legal-строка, без QR и гигантского wordmark, без глобального дисклеймера — красный
- [x] 4.4 Перевёрстка SiteFooter по прототипу — e2e зелёный

## 5. ds-lint и контраст-политика

- [ ] 5.1 Обновить ds-lint: запрет `unbounded|spectral|caveat` в `src/`, запрет `text-moss` без метки `ds-allow: moss-large`, запрет SKU-цвета на body-тексте/кнопках
- [ ] 5.2 Прогнать ds-lint по всему `src/`, устранить нарушения (мелкий текст → moss-ink)

## 6. Верификация

- [ ] 6.1 Полный прогон: unit + e2e + `npm run build` (static export) зелёные
- [ ] 6.2 Визуальная проверка 5 роутов на 1440px и 360px: типографика voice/ui применена, контраст-политика соблюдена, «переходный» вид старых секций зафиксирован скриншотами
- [ ] 6.3 Обновить CONTEXT.md (журнал + текущая задача) и файл «вопросы Насте» (кириллица шрифтов — если возник, реквизиты ИП, дисклеймер весь сайт vs /lab)
