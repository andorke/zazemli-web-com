import { Fleuron } from "@/components/ui/fleuron";
import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/*
 * «О нас» по прототипу: chalk, центр, узкая колонка, подпись «— Настя, основательница ❦»
 * (единственный фльерон страницы). Каваэт-приписки на лендинге не используются (канон Pre-publish).
 */
export function About() {
  const { about } = home;
  return (
    <section className="bg-chalk text-charcoal py-20 lg:py-28">
      <div className="mx-auto w-full max-w-[1240px] px-[clamp(1.5rem,5vw,4rem)]">
        <div className="mx-auto flex max-w-[42rem] flex-col items-center gap-6 text-center">
          <KickerHeader>{about.eyebrow}</KickerHeader>
          {about.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="text-charcoal/85 font-voice text-[clamp(1.15rem,1vw+0.85rem,1.45rem)] leading-normal font-light"
            >
              {paragraph}
            </p>
          ))}
          <p className="text-moss-ink font-voice text-[17px] italic">
            {about.signature} <Fleuron className="not-italic" />
          </p>
        </div>
      </div>
    </section>
  );
}
