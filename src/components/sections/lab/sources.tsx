import { KickerHeader } from "@/components/ui/kicker-header";
import { lab } from "@/content/lab";

/* Источники (прототип #src): 2 группы работ + служебная сноска + слоган */
export function LabSources() {
  const { sources } = lab;
  return (
    <section id="src" className="bg-chalk scroll-mt-6 py-[clamp(3.5rem,7vw,6rem)]">
      <div className="mx-auto max-w-[1080px] px-6 sm:px-8 lg:px-16">
        <div className="mb-8 max-w-[54rem]">
          <KickerHeader>{sources.eyebrow}</KickerHeader>
          <h2 className="leading-heading mt-4 max-w-[20ch] font-voice text-[clamp(1.9rem,2.6vw_+_1rem,3rem)] font-light">
            {sources.title}
          </h2>
          <p className="text-charcoal/85 mt-4 max-w-[42rem] leading-normal">
            {sources.lead}
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          {sources.groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-charcoal font-voice text-body">
                {group.title}
              </h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li
                    key={item.cite}
                    className="text-ink-muted text-small leading-normal"
                  >
                    {item.cite}
                    {item.doi && (
                      <>
                        {" "}
                        <a
                          href={item.doi}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-moss-ink underline decoration-dotted underline-offset-2"
                        >
                          ↗ DOI
                        </a>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-ink-muted text-caption mt-8 max-w-[40rem] leading-normal">
          {sources.note}
        </p>
        <p className="text-moss-ink mt-8 font-voice text-[clamp(1.6rem,3vw,2.2rem)] font-light tracking-[-0.02em]">
          {sources.slogan}
        </p>
      </div>
    </section>
  );
}
