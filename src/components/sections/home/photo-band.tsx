import Image from "next/image";

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
      <Image
        src="/band-bark.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
    </section>
  );
}
