# font-mulish — tasks

## 1. Шрифтовые файлы

- [x] 1.1 Получить Mulish variable (roman + italic, OFL) и субсетнуть cyrillic+latin+пунктуация с сохранением оси wght: `src/fonts/mulish-var.woff2` (300–600), `src/fonts/mulish-var-italic.woff2` (300–400)
- [ ] 1.2 Обновить `src/app/fonts.ts`: пути, weight-диапазоны, `fallback: ['Helvetica Neue','Arial','sans-serif']`, комментарий DS-контракта (убрать «временный дублёр», убрать opsz); preload оставить
- [ ] 1.3 Удалить `src/fonts/literata-var*.woff2`

## 2. Трекинг и веса

- [ ] 2.1 Добавить в `globals.css` переменные трекинга: display-hero −0.035em, display-product −0.032em, display-page −0.03em, h1 −0.028em, h2 −0.024em, take/lead −0.02em, eyebrow +0.2em; body/small/caption 0
- [ ] 2.2 Применить токены трекинга к заголовочным ролям и eyebrow в компонентах (нулевой трекинг на display/h1/h2 недопустим)
- [ ] 2.3 Сверить веса крупных заголовков с прототипами (300–400, не 600); h2 — кеглем h1, отдельного токена нет

## 3. Чистка и тесты

- [ ] 3.1 Прогнать поиск `literata|newsreader` (без регистра) по `src/` — 0 совпадений; обновить ds-lint-паттерн старых семейств (`unbounded|spectral|caveat|literata|newsreader`)
- [ ] 3.2 Обновить `globals-tokens.test.ts`: наличие переменных трекинга, запрет нулевого трекинга заголовков
- [ ] 3.3 `npm run typecheck && npm run test && npm run build` — зелёные

## 4. Приёмка и доки

- [ ] 4.1 Приёмка по PATCH-1 §1: имя voice-файла в `/_next/media/` содержит `mulish`; Network пуст по `fonts.googleapis.com`; заголовки с отрицательным трекингом; стык h2 → body различим на глаз
- [ ] 4.2 Обновить `DEVELOPMENT.md` (источник типографики: typography.md v3.0 + прототипы; веса по прототипу) и записать решение 30.07 в `CONTEXT.md` (включая отставание tokens.json v1.1.0 — флаг Насте)
