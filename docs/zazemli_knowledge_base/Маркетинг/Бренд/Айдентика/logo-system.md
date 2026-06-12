# Система логотипа · Версия: 1.0.0 · Дата: 2026-05-13 · Источник: brand-v3 (wordmark + правила лого) + brand-identity.md (display name + handle)

## Wordmark ЗАЗЕМЛИ

| Свойство | Значение |
|---|---|
| Шрифт | Unbounded |
| Вес | 500 |
| Регистр | КАПС |
| Letter-spacing | по умолчанию body 0; в display — displayTight −0.05em |
| Цвет (default) | charcoal `#1C1C1C` |
| Цвет (инверсия) | bone `#F6F4F0` на charcoal-фоне |

Wordmark — не отдельный SVG-знак, а текстовая отрисовка в Unbounded 500. Это сознательное решение: типографика и есть логотип. Никаких засечек, лигатур, авторских модификаций букв.

## Два размера ролей

| Роль | Размер | Где живёт |
|---|---|---|
| Wordmark (UI-режим) | 16 px / Unbounded 500 | Навигация, footer, favicon-подпись |
| Display (hero-режим) | 76 px / Unbounded 900 | Hero главной, hero `/about`, обложка журнала |

Размеры берутся из шкалы Major Third (см. typography.md). Промежуточных размеров «32» или «56» для wordmark — нет.

## Display name и handle

| Поле | Значение |
|---|---|
| Display name | ЗАЗЕМЛИ |
| Latin handle (опц.) | zazemli |
| Социальные | @zazemli_collectio (Telegram, Instagram) |

Display name «ЗАЗЕМЛИ» используется везде — навигация, hero, email footer, мета-теги, social. Никаких альтернатив («Zazemli», «zaZemli», «З.», «З-И») — это нарушение бренда. Подробнее в `brand-identity.md`.

## Минимальные размеры

| Контекст | Минимальный размер |
|---|---|
| Web wordmark | 14 px (мобильная навигация в сверхузких viewport) |
| Favicon | 16 × 16 px (буква З в 1-ring frame, moss) |
| App-icon | 1024 × 1024 px (буква З в 1-ring frame, moss, на bone-фоне) |

Под 14 px wordmark не уменьшается — буквы Unbounded 500 теряют читаемость.

## Охранное поле

Минимальный отступ вокруг wordmark — высота буквы «З» × 1. То есть для wordmark 16 px свободное пространство от каждой стороны — не менее 16 px. Для display 76 px — 76 px.

В охранное поле не входят: другой текст, дудлы, рамки, hairlines, фоновые цвета (кроме базового bone или charcoal).

## Запреты на трансформации

Перечисленное запрещено всегда:

1. Растяжение, сжатие, наклон wordmark (`scale`, `skew`).
2. Подмена шрифта (Inter, Helvetica, любые системные).
3. Подмена цвета: wordmark — только charcoal на bone или bone на charcoal. Никаких moss-, SKU-, earth-вариантов.
4. Drop-shadow, outline, glow вокруг wordmark.
5. Поворот на нестандартный угол. Допускается ровно 0° или 90° (вертикальный wordmark в редких heritage-композициях).
6. Анимация wordmark на главной (text-shadow flicker, разноцветный переход).
7. Использование wordmark как фонового pattern (повторяющийся знак).
8. Эмодзи или Caveat-приписка внутри охранного поля.

## Совместимость с Apothecary якорями

Wordmark часто живёт рядом с COLLECTIO kicker и N° serial. Схема композиции:

```
COLLECTIO ZAZEMLI · N° 001 · monstera     ← KickerHeader (Unbounded 500, 11–12, ls 0.18em)
M O N S T E R A                           ← Display (Unbounded 900, 76, displayTight)
Monstera deliciosa                        ← Spectral italic, moss, opacity 0.75
```

ЗАЗЕМЛИ в hero `/` использует ту же display-роль (Unbounded 900, 76 px) — это значит wordmark и имя растения говорят на одном языке. На `/collectio/[plant]` wordmark остаётся в навигации (16 px), а имя растения занимает display-слот.

## Где это работает

- Display name и handle: `01_foundations/brand-identity.md`
- Машинные значения весов и letter-spacing: `01_foundations/tokens.json` (`typography.rolesUnbounded.wordmark`, `typography.rolesUnbounded.display`)
- Запреты на трансформации: `02_voice/anti-patterns.md` (подмена шрифта, цвета, эмодзи в охранном поле)
- 1-ring frame для favicon и app-icon: `01_foundations/iconography.md` (раздел Frame-веса)
