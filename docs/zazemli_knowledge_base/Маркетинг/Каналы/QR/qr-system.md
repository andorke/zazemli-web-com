# qr-system · Версия: 1.0.0 · Дата: 2026-05-16 · Источник: assets-v5/qr-*.svg + master-brief §5.5 + brand-v3 §12 (устарел)

Production-спека слоя `05_production/`. Система QR-кодов: какие, куда ведут, в какие материалы клеятся.

## Что это

3 актуальных QR-кода (по факту в `assets-v5/`). brand-v3 §12 упоминал 4 QR — **корректируем до 3** (см. изменения).

## Роль в ДНК-четвёрке

Источник **02 Apothecary** (sparse-метка, всегда в кадре с KickerHeader / serial). QR — мост печать → цифровая страница. См. `02_voice/dna.md` §1, §7 + `04_patterns/print-web-bridge.md`.

## 3 QR · каталог

| # | Имя файла | URL назначения | Где клеится | Цель |
|---|---|---|---|---|
| 1 | `qr-zazemli-collectio.svg` | `https://zazemli.com/collectio` | Листовка-оборот (все 7 SKU) — на «полную лабораторию» | Подъём органики сайта, заход в каталог |
| 2 | `qr-zazemli-diary-signup.svg` | `https://zazemli.com/diary-signup` | Дневник растения (все 7 SKU) на стр II + opt-in вкладыш | Захват email-базы, дневник как «окошко в следующую коллекцию» (dna §1.1.1) |
| 3 | `qr-zazemli-instagram.svg` | `https://instagram.com/zazemli_collectio` | Листовка-оборот (опционально) + банд-стикер | Подъём IG-подписчиков, обучение через ритуал |

**Изменения vs brand-v3 §12 (4 QR):** один QR убран (был `/lab` отдельно — теперь `/lab` доступен через `/collectio` → cross-link, или прямо `/lab#monstera` через UTM из IG). Если в будущем понадобится отдельный `/lab` QR — добавляется здесь.

## Где это применяется (полный mapping)

| Артефакт | Используемые QR |
|---|---|
| `leaflet-00X-{sku}-back.pdf` (7 шт) | `collectio` + `instagram` (2 QR на оборот) |
| `dnevnik-{sku}-final.html` (7 шт) | `diary-signup` (на стр II, обязательно) + опц. `collectio` |
| `band-charcoal.pdf` | `instagram` (опц.) |
| Веб-страница `/diary-signup` | — (QR ведёт сюда, не отсюда) |

## Технические правила

| Параметр | Значение |
|---|---|
| Формат файла | SVG (vector, без растеризации) |
| Минимальный размер на печати | **≥ 12 мм × 12 мм** (для смартфона с расстояния 30 см) |
| Error correction | **Level H (30%)** — позволяет частичное закрытие/повреждение |
| Внутри quiet zone | Не размещать другие элементы (4 модуля минимум вокруг) |
| Цвет | charcoal на bone (или bone на charcoal — инверсия по §16) |
| Logo поверх QR | Нет (избегаем — снижает читаемость) |

## UTM-стратегия для QR-переходов

Каждый QR содержит UTM в URL для трекинга источника:

| QR | Полный URL с UTM |
|---|---|
| `qr-zazemli-collectio` | `https://zazemli.com/collectio?utm_source=qr&utm_medium=leaflet&utm_content={sku}&utm_campaign=partia-0` |
| `qr-zazemli-diary-signup` | `https://zazemli.com/diary-signup?utm_source=qr&utm_medium=dnevnik&utm_content={sku}&utm_campaign=partia-0` |
| `qr-zazemli-instagram` | `https://instagram.com/zazemli_collectio?utm_source=qr&utm_medium={leaflet\|band}` |

**Важно:** `{sku}` варьируется по SKU в `qr-zazemli-collectio` и `qr-zazemli-diary-signup` — это значит **7 вариантов** SVG для каждого QR (или 1 SVG + динамическая подстановка через redirect-сервис). На MVP — 1 SVG, UTM статический `utm_content=partia-0` без SKU.

## Правила применения

- **Никогда без подписи рядом.** QR без текста = непонятно куда ведёт. Подпись: «Лаборатория грунта», «Подписаться на дневник», «@zazemli_collectio».
- **Подпись — Unbounded uppercase text-xs**, tracking 0.16em, charcoal/60.
- **Quiet zone обязательна** (4 модуля минимум).
- **На печати — минимум 12 мм.** На веб (если используется) — минимум 80px.
- **Перед заказом тиража** — проверить QR через 3 устройства (iPhone, Android, читалка типа Yandex).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- QR без подписи.
- QR в SKU-цвете (только charcoal/bone — иначе теряется контраст).
- Logo поверх QR.
- QR <12 мм (не считывается).
- Carousel QR (несколько подряд без явного разделения).
- QR на background-image (теряется контраст).
- QR без UTM (теряется аналитика источника).

## Где это работает

- `assets-v5/qr-zazemli-*.svg` — финальные файлы (3 шт).
- `05_production/print-brief.md` — где какой QR клеится.
- `05_production/journal-spec.md` — `diary-signup` QR на стр II дневника.
- `04_patterns/navigation-patterns.md` — UTM-стратегия (общий формат для QR + веб).
- `01_foundations/brand-identity.md` — handle IG/TG `@zazemli_collectio`.
- Templates: `/collectio`, `/diary-signup` (целевые страницы QR).

## История версий

- v1.0.0 · 2026-05-16 · первый draft. Источник: actuell SVG в `assets-v5/` (3 QR) + master-brief §5.5. Корректировка vs brand-v3 §12 (4 → 3 QR).

## Заметка про дубль (для Спринта 11)

brand-v3 §12 «4 QR (/lab, /guide, /collectio, /diary-signup)» → **устаревший**, заменяется на ссылку `→ 05_production/qr-system.md` (3 QR актуально). `/lab` отдельно НЕ нужен — доступен через `/collectio` + UTM из IG.
