# seo-meta — tasks

## 1. OG и Organization

- [x] 1.1 `opengraph-image` в layout (статический бренд-OG) + OG/Twitter-мета через `generateMetadata`; абсолютные URL от `metadataBase`
- [x] 1.2 JSON-LD `Organization` компонентом в layout (один на страницу); тест наличия и единственности

## 2. Product-разметка

- [x] 2.1 JSON-LD `Product` на `/collectio/[slug]` из `sku.ts`: name (растение + латынь), offers по трём объёмам, availability от `ozonListingUrl` (null → PreOrder)
- [x] 2.2 Тест синхронности разметки с видимыми ценами (оба варианта пробела в сверке цен)

## 3. UTM и футер

- [x] 3.1 Расширить `lib/utm.ts` на соцссылки; IG/TG в футере — через него (`utm_source=site`)
- [x] 3.2 Тест: внешние ссылки бренда в `out/` содержат UTM (кроме временной внешней статьи гайда)

## 4. Изображения

- [x] 4.1 Перевести image-слоты контентных страниц на `next/image` (`sizes`, lazy, размеры зарезервированы; `images.unoptimized` для static export)
- [x] 4.2 Колба состава: inline-SVG вместо битого `assets/vial.png`; проверить отсутствие 404 по картинкам в `out/`

## 5. Приёмка

- [x] 5.1 Валидация JSON-LD (Rich Results-совместимая структура) и OG-превью; `npm run typecheck && npm run test && npm run build` — зелёные
- [x] 5.2 Записать в `CONTEXT.md`: unoptimized-компромисс static export, статус HSTS (закрыт на nginx — сверен), FIX-71 вне волны
