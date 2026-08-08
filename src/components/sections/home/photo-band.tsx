/*
 * Атмосферный баннер прототипа (`.photo.band`): full-bleed фото-слот
 * фиксированной высоты между «Как это работает» и «Что даёт». Высота держится
 * clamp'ом, поэтому картинка не даёт CLS.
 *
 * Кадр — собственная предметная съёмка коры, приведённая к тёмной гамме бренда.
 * Панорамирование при прокрутке живёт в globals.css (.photo-band).
 */
export function PhotoBand() {
  return (
    <section
      aria-hidden="true"
      className="photo-band bg-charcoal relative h-[clamp(280px,42vw,560px)] overflow-hidden"
    >
      {/* Баннер декоративный и лежит ниже первого экрана: грузим лениво,
          формат выбирает браузер. Ширины — под реальные брейкпоинты полосы. */}
      <picture>
        <source
          type="image/avif"
          srcSet="/img/band-bark-900.avif 900w, /img/band-bark-1400.avif 1400w, /img/band-bark-1911.avif 1911w"
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet="/img/band-bark-900.webp 900w, /img/band-bark-1400.webp 1400w, /img/band-bark-1911.webp 1911w"
          sizes="100vw"
        />
        <img
          src="/img/band-bark-1400.jpg"
          srcSet="/img/band-bark-900.jpg 900w, /img/band-bark-1400.jpg 1400w, /img/band-bark-1911.jpg 1911w"
          sizes="100vw"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </picture>
    </section>
  );
}
