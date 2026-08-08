/*
 * Атмосферный баннер прототипа (`.photo.band`): full-bleed фото-слот
 * фиксированной высоты между «Как это работает» и «Что даёт». До съёмки —
 * нейтральная заливка без текстовой заглушки (FIX-03); высота зарезервирована
 * clamp'ом, поэтому подстановка фото не даст CLS.
 */
export function PhotoBand() {
  return (
    <section
      aria-hidden="true"
      className="bg-charcoal h-[clamp(280px,42vw,560px)] overflow-hidden"
    />
  );
}
