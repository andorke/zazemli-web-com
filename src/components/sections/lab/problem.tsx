import { DetailsAccordion } from "@/components/ui/details-accordion";
import { KickerHeader } from "@/components/ui/kicker-header";
import { lab } from "@/content/lab";

/*
 * Проблема (прототип .probgrid): прозаический поток слева + pullbox-врезка
 * с научным якорем (Bugbee & Frink) справа, source-note как обычный аккордеон.
 */
export function LabProblem() {
  const { problem } = lab;
  return (
    <section className="bg-bone py-[clamp(3.5rem,7vw,6rem)]">
      <div className="mx-auto max-w-[1080px] px-6 sm:px-8 lg:px-16">
        <div className="mb-10 max-w-[54rem]">
          <KickerHeader>{problem.eyebrow}</KickerHeader>
          <h2 className="leading-heading mt-4 max-w-[20ch] font-voice text-[clamp(1.9rem,2.6vw_+_1rem,3rem)] font-light">
            {problem.title}
          </h2>
          <p className="text-charcoal mt-5 max-w-[42rem] text-[1.05rem] leading-normal">
            {problem.lead}
          </p>
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            {problem.flow.map((paragraph) => (
              <p key={paragraph} className="text-charcoal/85 leading-body">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="border-moss border-l-2 py-1 pl-5">
            <p className="text-charcoal font-voice text-[1.3rem] leading-snug">
              {problem.pullbox.quote}
            </p>
            <DetailsAccordion
              summary={problem.pullbox.summary}
              className="mt-3"
            >
              <div className="text-ink-muted text-caption mt-3 leading-normal">
                <span className="text-moss-ink font-medium">
                  {problem.pullbox.source.level}
                </span>
                <br />
                {problem.pullbox.source.text}
              </div>
            </DetailsAccordion>
          </div>
        </div>
      </div>
    </section>
  );
}
