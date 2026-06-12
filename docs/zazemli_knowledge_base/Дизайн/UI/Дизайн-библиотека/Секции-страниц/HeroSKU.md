# HeroSKU · Версия: 1.0.0 · Дата: 2026-05-14 · Источник: brand-v3 §07.04 (PRODUCT CARDS) + DS v1.0 §6.2 (контекст hero) + mock-валидация Спринта 5

Organism слоя `03_components/organisms/`. Hero-секция страницы конкретного SKU `/collectio/[plant]`.

## Что это

Hero для страницы растения: KickerHeader + крупный SerialNumber (SKU-цвет) + H1 «Заземли [Растение]» + Divider + подзаголовок Spectral italic с биотопом + Badge-row (размер · латынь · N°) + Button-pair (купить + дневник) + Caveat sku-humor + фоновый Doodle (colored).

**Отличается от HeroDefault** ответственностью:
- `HeroDefault` — главная страница, двойное прочтение «заземли растение, заземли себя».
- `HeroSKU` — страница SKU, конкретное растение с цифрами (объём, цена, размер).

**Отличается от HeroWhisper** контекстом:
- `HeroWhisper` — manifesto `/about` (тишина, без CTA-цели).
- `HeroSKU` — коммерческая страница с прямым Button «Купить на Ozon · 2 590 ₽».

## Роль в ДНК-четвёрке

Источник **02 Apothecary** (KickerHeader, SerialNumber, Badge-row, Divider) + источник **03 Naturalist** (через SKU-цвет SerialNumber, colored Doodle, Badge latin) + источник **04 Handscript** (Caveat sku-humor). См. `02_voice/dna.md` §1, §7.

## Состав

| Слой | Что | Атом / molecule |
|---|---|---|
| Контейнер | `<section bg-bone py-20 md:py-24 relative text-center>` | semantic-tokens |
| KickerHeader | `COLLECTIO ZAZEMLI · N° 001 · monstera deliciosa` | `atoms/KickerHeader.md` |
| SerialNumber | `N° 001` крупно, SKU-цвет | `atoms/SerialNumber.md` |
| H1 | «Заземли Монстеру» (Unbounded bold, clamp) | `01_foundations/typography.md` |
| Divider | decorative, w-14 | `atoms/Divider.md` |
| Подзаголовок | «Грунт под биотоп...» (Spectral italic, charcoal/60) | `01_foundations/voice-principles.md` |
| Badge-row | размер «3.5 л» + латынь `monstera deliciosa` + solid `N° 001` (SKU-color) | `atoms/Badge.md` × 3 |
| Button-pair | primary «Купить на Ozon · цена» + secondary «Подписаться на дневник» | `atoms/Button.md` × 2 |
| Caveat | sku-humor «уже просится в большой горшок» (без восклицания) | `atoms/CaveatNote.md` |
| Doodle | фоновый, colored SKU, opacity 0.12 | `atoms/Doodle.md` (способ A) |

```jsx
function HeroSKU({ sku }) {
  // sku = { number, name, latin, size, volume, price, doodle, biotope }
  return (
    <section class="bg-bone py-20 md:py-24 relative text-center">
      <div class="max-w-screen-xl mx-auto px-6">
        <KickerHeader brand="COLLECTIO ZAZEMLI" serial={sku.number} slug={sku.latin} />

        <SerialNumber serial={sku.number} accent={sku.color} />

        <h1
          class="font-unbounded font-bold text-charcoal/80 leading-none tracking-tight mt-6"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
        >
          Заземли<br/>{sku.name}
        </h1>

        <Divider variant="decorative" class="my-10 mx-auto w-14" />

        <p class="font-spectral italic text-lg md:text-xl text-charcoal/60 max-w-prose mx-auto">
          {sku.biotope}
        </p>

        <div class="flex gap-2 justify-center flex-wrap mt-6">
          <Badge>{sku.size}</Badge>
          <Badge variant="latin">{sku.latin}</Badge>
          <Badge variant="solid" accent={sku.color}>{sku.number}</Badge>
        </div>

        <div class="mt-12 flex flex-wrap justify-center gap-4">
          <Button variant="primary">Купить на Ozon · {sku.price} ₽</Button>
          <Button variant="secondary">Подписаться на дневник</Button>
        </div>

        <CaveatNote variant="sku-humor" accent={sku.color}>
          {sku.caveat}
        </CaveatNote>

        <img
          src={`/assets/doodles/colored/${sku.slug}-${sku.color}.svg`}
          class="absolute top-1/2 right-8 w-56 opacity-12 -translate-y-1/2 hidden md:block pointer-events-none"
          alt=""
        />
      </div>
    </section>
  )
}
```

## Правила применения

- **Только** на `/collectio/[plant]`. На `/` — `HeroDefault`. На `/about` — `HeroWhisper`.
- H1 — фиксированный паттерн «Заземли [Имя]» (винительный падеж: Монстеру, Фикус, Спатифиллум). Не подменять.
- SerialNumber — обязательный крупный акцент, SKU-цвет.
- Badge-row — ровно 3 бейджа: размер · латынь · N°. Не добавлять «хит» / «new» / другие маркетинговые (см. `atoms/Badge.md`).
- Button primary — содержит цену из финмодели: «Купить на Ozon · 1 890 ₽» / «· 2 190 ₽» / «· 2 590 ₽» в зависимости от формата.
- Caveat sku-humor — короткая фраза БЕЗ восклицаний (TOV blacklist), 18-24px в зависимости от SKU-WCAG (см. `atoms/CaveatNote.md` §WCAG).
- Doodle — colored под SKU, opacity 0.12 для bg, hidden md:block (на mobile скрыт).
- Mobile padding `py-20`, desktop `py-24`.
- Focus-state на Button — единое правило (см. `atoms/Button.md`).

## Что НЕ применять

См. `02_voice/anti-patterns.md`:
- 3+ Button в hero (только pair: купить + дневник).
- «В корзину» вместо «Купить на Ozon» (нет корзины на запуске).
- Восклицания в Caveat.
- Фото растения в hero (только doodle).
- SerialNumber в charcoal — всегда SKU-цвет.
- H1 в SKU-цвете (всегда charcoal/80, акцент SKU держит SerialNumber).
- Carousel изображений / галерея SKU.

## Где это работает

- `01_foundations/dna.md` — мосты 02↔03 (SKU-цвет SerialNumber, colored Doodle).
- `01_foundations/color-system.md` — SKU-палитра.
- `01_foundations/semantic-tokens.md` — `--accent-sku` (динамическая переменная по странице).
- `01_foundations/typography.md` — Unbounded bold clamp.
- `03_components/atoms/`: KickerHeader, SerialNumber, Divider, Badge (×3), Button (×2), CaveatNote, Doodle.
- Используется в template `/collectio/[plant]` (Спринт 6).

## История версий

- v1.0.0 · 2026-05-14 · первый draft. Найден на mock-валидации Спринта 5 как архитектурный пробел: HeroDefault для главной, HeroWhisper для `/about`, но для `/collectio/[plant]` нужен **третий тип hero** с другой ответственностью (конкретное растение vs двойное прочтение vs манифесто).

## Заметка про дубль (для Спринта 11)

В DS v1.0 §6.2 отсутствует явное определение HeroSKU — добавится строка в индекс §6.2 с ссылкой `→ 03_components/organisms/HeroSKU.md`. Это **новый organism сверх явного перечня DS** — фиксируется в плане v2 как корректировка (план v2 §Спринт 5: «5-7 organisms» расширяется до **8 organisms + box-layers = 9 артефактов**).

brand-v3 §07.04 «PRODUCT CARDS» — пример композиции для каталога SKU, остаётся как application gallery.
