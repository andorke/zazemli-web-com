import { GuideExternalLink } from "@/components/sections/guide/external-link";
import { GuideTipDetails } from "@/components/sections/guide/tip";
import { Fleuron } from "@/components/ui/fleuron";
import type { GuideRouteStage, GuideStageStep } from "@/content/guide";

/*
 * Шаги гайда v4 (прототипы: ol.steps > li.step). Один рендер на все три страницы:
 * вход отдаёт 00–01, маршруты — свои стадии, включая общие «Дренаж» и «Дневник»
 * (в контенте это один и тот же объект, копий текста нет). Стадии разделены
 * фльероном, как в прототипе (.step + .step::before).
 */

/* Под-пункты микрошага: «— …», внешняя ссылка и вложенная раскрывашка */
function SubList({ step }: { step: GuideStageStep }) {
  if (!step.subs && !step.subLink && !step.subTip) return null;
  return (
    <ul className="mt-2 flex flex-col gap-1.5">
      {step.subs?.map((sub) => (
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
      {step.subLink && (
        <li className="text-small grid grid-cols-[0.9rem_1fr] gap-1.5">
          <span aria-hidden="true" className="text-moss-ink/70">
            —
          </span>
          <GuideExternalLink link={step.subLink} />
        </li>
      )}
      {step.subTip && (
        <li className="pl-[1.4rem]">
          <GuideTipDetails tip={step.subTip} className="mt-0" />
        </li>
      )}
    </ul>
  );
}

function RouteStage({
  stage,
  divider,
}: {
  stage: GuideRouteStage;
  divider: boolean;
}) {
  return (
    <li id={stage.id} className="scroll-mt-8 pt-[clamp(2.4rem,5vw,3.6rem)]">
      {divider && (
        <Fleuron className="block pb-[clamp(1.6rem,4vw,2.6rem)] text-center" />
      )}
      <span
        aria-hidden="true"
        className={
          "text-moss/30 font-voice block text-[clamp(2.4rem,5vw,4rem)] leading-none font-light tabular-nums" // ds-allow: moss-large — номер стадии 38–64px (≥18pt)
        }
      >
        {stage.num}
      </span>
      <h2 className="font-voice mt-2 max-w-[24ch] text-[clamp(1.9rem,2.6vw_+_1rem,3rem)] leading-heading font-light">
        {stage.title}
      </h2>

      <div className="mt-[clamp(1.5rem,3vw,2rem)]">
        <ol className="flex max-w-[40rem] list-none flex-col gap-4">
          {stage.steps.map((step, i) => (
            <li key={step.text} className="grid grid-cols-[1.8rem_1fr] gap-3">
              <span
                aria-hidden="true"
                className={
                  "text-moss font-voice text-[clamp(1.5rem,1vw_+_1rem,1.7rem)] leading-tight tabular-nums" // ds-allow: moss-large — номер микрошага 24–27px (≥18pt)
                }
              >
                {i + 1}
              </span>
              <div>
                <p className="text-charcoal/90 leading-snug">{step.text}</p>
                <SubList step={step} />
              </div>
            </li>
          ))}
        </ol>

        {stage.tips.map((tip) => (
          <GuideTipDetails key={tip.summary} tip={tip} />
        ))}

        {stage.outro && (
          <p className="text-text-muted mt-6 max-w-[40rem] leading-normal">
            {stage.outro}
          </p>
        )}
      </div>
    </li>
  );
}

export function GuideRouteStages({ stages }: { stages: GuideRouteStage[] }) {
  return (
    <ol className="flex list-none flex-col">
      {stages.map((stage, i) => (
        <RouteStage key={stage.id} stage={stage} divider={i > 0} />
      ))}
    </ol>
  );
}
