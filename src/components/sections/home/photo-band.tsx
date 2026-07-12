import { home } from "@/content/home";

/* Атмосферный баннер прототипа: full-bleed фото-слот фиксированной высоты (без CLS) */
export function PhotoBand() {
  const { photoBand } = home;
  return (
    <section className="bg-charcoal relative h-[clamp(280px,42vw,560px)] overflow-hidden">
      <span className="text-bone/60 absolute bottom-5 left-6 font-voice text-sm italic select-none lg:left-30">
        [ {photoBand.caption} ]
      </span>
    </section>
  );
}
