import type { GuideEntryContent, KitSource } from "@/content/guide";
import { cn } from "@/lib/utils";

/*
 * Инвентарь входа одним блоком до шагов (прототип .kit, FIX-63): время ритуала,
 * два столбца пунктов с уточнениями и легенда ● в боксе / ○ своё.
 */

const KIT_LEGEND: Record<KitSource, string> = { box: "в боксе", own: "своё" };

/* Маркер инвентаря: ■ заливка moss-ink (в боксе) / □ контур (своё) */
function KitMarker({ source }: { source: KitSource }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "border-moss-ink inline-block size-[13px] shrink-0 border",
        source === "box" && "bg-moss-ink",
      )}
    />
  );
}

export function GuideKit({ kit }: { kit: GuideEntryContent["kit"] }) {
  return (
    <section className="bg-bone text-charcoal pb-[clamp(3rem,6vw,5rem)]">
      <div className="mx-auto max-w-[1080px] px-6 sm:px-8 lg:px-16 pt-[clamp(3rem,6vw,5rem)]">
        <span className="text-text-muted font-ui text-eyebrow tracking-kicker mb-2 block font-medium uppercase">
          Что понадобится
        </span>
        <p className="text-ink-muted text-small mb-[clamp(1.3rem,3vw,1.8rem)] tabular-nums">
          {kit.time}
        </p>
        <ul className="grid list-none gap-x-[clamp(1.6rem,4vw,3.4rem)] gap-y-3 sm:grid-cols-2">
          {kit.items.map((item) => (
            <li key={item.text} className="grid grid-cols-[1.6rem_1fr]">
              <span className="pt-[0.3em]">
                <KitMarker source={item.source} />
              </span>
              <span className="text-charcoal/90 leading-snug">
                {item.text}
                {item.note && (
                  <i className="text-ink-muted text-small block not-italic">
                    {item.note}
                  </i>
                )}
              </span>
            </li>
          ))}
        </ul>
        <div className="text-ink-muted text-caption mt-5 flex gap-6">
          {(Object.keys(KIT_LEGEND) as KitSource[]).map((source) => (
            <span key={source} className="inline-flex items-center gap-2">
              <KitMarker source={source} />
              {KIT_LEGEND[source]}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
