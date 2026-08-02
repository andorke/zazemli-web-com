import { DetailsAccordion } from "@/components/ui/details-accordion";
import type { GuideStageTip } from "@/content/guide";
import { cn } from "@/lib/utils";

/*
 * Раскрывашка-подсказка гайда v4 (прототипы: details.tip > summary + .body).
 * Два вида тела: список с «—» и необязательным жирным лидом или абзацы прозой.
 * Общая для шагов маршрутов и для развилки на входе.
 */
export function GuideTipDetails({
  tip,
  className,
}: {
  tip: GuideStageTip;
  className?: string;
}) {
  return (
    <DetailsAccordion
      summary={tip.summary}
      summaryClassName="text-small"
      className={cn("mt-4 max-w-[40rem]", className)}
    >
      <div className="text-text-muted text-small mt-2 leading-normal">
        {tip.kind === "list" ? (
          <ul className="flex flex-col gap-1.5">
            {tip.body.map((item) => (
              <li
                key={item.text}
                className="grid grid-cols-[0.9rem_1fr] gap-1.5"
              >
                <span aria-hidden="true" className="text-moss-ink/70">
                  —
                </span>
                <span>
                  {item.lead && (
                    <b className="text-charcoal/90 font-medium">{item.lead}</b>
                  )}
                  {item.lead && " — "}
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          tip.body.map((line, i) => (
            <p key={line} className={cn(i > 0 && "mt-2")}>
              {line}
            </p>
          ))
        )}
      </div>
    </DetailsAccordion>
  );
}
