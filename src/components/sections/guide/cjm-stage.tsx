import { ImageSlot } from "@/components/sections/home/image-slot";
import { DetailsAccordion } from "@/components/ui/details-accordion";
import type { GuideStage, KitSource } from "@/content/guide";
import { cn } from "@/lib/utils";

/*
 * Стадия CJM /guide по прототипу guide.html (.step). Единый паттерн:
 * «Что понадобится (● в боксе / ○ своё) → Шаги (нумерованные, с под-пунктами)
 * → Подсказка (<details>) → Готово, когда». Иллюстрация — слот (Non-Goal),
 * подпись из данных. flip — зеркалит колонку слота на чётных стадиях (прототип
 * .step:nth-of-type(even) .svis{order:-1}). Тексты — из @/content/guide.
 */

const KIT_LEGEND: Record<KitSource, string> = { box: "в боксе", own: "своё" };

/* Мини-лейбл секции внутри стадии (.zlbl прототипа): каптион, КАПС, tracking */
function ZLabel({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <span
      className={cn(
        "font-ui text-eyebrow tracking-kicker mb-2 block font-medium uppercase",
        dark ? "text-charcoal" : "text-text-muted",
      )}
    >
      {children}
    </span>
  );
}

/* Маркер инвентаря: ● заливка moss (в боксе) / ○ контур moss (своё) */
function KitMarker({ source }: { source: KitSource }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mt-[0.45em] inline-block size-1.5 shrink-0",
        source === "box" ? "bg-moss/75" : "border border-moss/70",
      )}
    />
  );
}

export function CjmStage({
  stage,
  flip = false,
}: {
  stage: GuideStage;
  flip?: boolean;
}) {
  return (
    <li
      id={stage.id}
      className="grid scroll-mt-8 items-start gap-8 lg:grid-cols-2 lg:gap-16"
    >
      <div className={cn(flip && "lg:order-2")}>
        <div className="mb-5 flex items-baseline gap-4">
          <span
            className={
              "text-moss font-voice text-[clamp(2rem,3vw,2.6rem)] leading-none tabular-nums" // ds-allow: moss-large — номер стадии 32–42px (≥18pt)
            }
          >
            {stage.num}
          </span>
          <h2 className="font-voice text-[clamp(1.5rem,1vw_+_1rem,1.7rem)] font-normal">
            {stage.title}
          </h2>
        </div>

        <div className="mb-6">
          <ZLabel>Что понадобится</ZLabel>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {stage.kit.map((item) => (
              <li
                key={item.text}
                className="text-ink-muted text-small flex items-baseline gap-2"
              >
                <KitMarker source={item.source} />
                {item.text}
              </li>
            ))}
          </ul>
          {stage.showKitLegend && (
            <div className="text-ink-muted text-caption mt-3 flex gap-5">
              {(Object.keys(KIT_LEGEND) as KitSource[]).map((source) => (
                <span key={source} className="inline-flex items-center gap-1.5">
                  <KitMarker source={source} />
                  {KIT_LEGEND[source]}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <ZLabel dark>Шаги</ZLabel>
          <ol className="flex max-w-[33rem] list-none flex-col gap-4">
            {stage.steps.map((step, i) => (
              <li key={step.text} className="grid grid-cols-[1.7rem_1fr] gap-2">
                <span
                  aria-hidden="true"
                  className={
                    "text-moss font-voice text-[clamp(1.5rem,1vw_+_1rem,1.7rem)] leading-tight tabular-nums" // ds-allow: moss-large — номер шага 24–27px (≥18pt)
                  }
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-charcoal/90 leading-snug">{step.text}</p>
                  {step.subs && (
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {step.subs.map((sub) => (
                        <li
                          key={sub}
                          className="text-text-muted text-small grid grid-cols-[0.9rem_1fr] gap-1.5"
                        >
                          <span aria-hidden="true" className="text-moss-ink/70">
                            —
                          </span>
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {stage.tip && (
            <DetailsAccordion
              summary={stage.tip.summary}
              className="mt-4 max-w-[33rem]"
            >
              <div className="text-text-muted text-small mt-3 leading-normal">
                {stage.tip.kind === "list" ? (
                  <ul className="flex flex-col gap-1.5">
                    {stage.tip.body.map((line) => (
                      <li
                        key={line}
                        className="grid grid-cols-[0.9rem_1fr] gap-1.5"
                      >
                        <span aria-hidden="true" className="text-moss-ink/70">
                          —
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  stage.tip.body.map((line, i) => (
                    <p key={line} className={cn(i > 0 && "mt-2")}>
                      {line}
                    </p>
                  ))
                )}
              </div>
            </DetailsAccordion>
          )}
        </div>

        <div className="mt-6">
          <ZLabel>{stage.doneLabel}</ZLabel>
          <p className="text-moss-ink text-small font-medium leading-normal">
            {stage.done}
          </p>
        </div>
      </div>

      <div className={cn(flip && "lg:order-1")}>
        <ImageSlot
          tone="light"
          caption={stage.illustration}
          className="aspect-[4/3]"
        />
        {stage.note && (
          <p className="text-ink-muted text-caption mt-3 leading-normal">
            {stage.note.text}{" "}
            <a
              href={stage.note.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-moss-ink underline decoration-dotted underline-offset-2"
            >
              {stage.note.link.label}
            </a>
          </p>
        )}
      </div>
    </li>
  );
}
