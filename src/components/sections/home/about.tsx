import { Fleuron } from "@/components/ui/fleuron";
import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/*
 * «О нас» по прототипу: chalk, центр, узкая колонка, подпись «— Настя, основательница ❦»
 * (единственный фльерон страницы). Caveat на лендинге не используется (канон Pre-publish).
 */
export function About() {
  const { about } = home;
  return (
    <section className="bg-chalk text-charcoal px-6 py-20 lg:px-30 lg:py-28">
      <div className="mx-auto flex max-w-[42rem] flex-col items-center gap-6 text-center">
        <KickerHeader>{about.eyebrow}</KickerHeader>
        {about.paragraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 24)}
            className="text-charcoal/85 font-voice text-[clamp(1.15rem,1vw+0.85rem,1.45rem)] font-light leading-normal"
          >
            {paragraph}
          </p>
        ))}
        <p className="text-moss-ink font-voice text-[17px] italic">
          {about.signature} <Fleuron className="not-italic" />
        </p>
      </div>
    </section>
  );
}
