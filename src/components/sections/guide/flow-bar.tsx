import type { GuideFlowItem } from "@/content/guide";

/*
 * Флоу-строка под hero (прототипы .flowbar): порядок стадий одной строкой.
 * Некликабельно намеренно — на входе половина стадий живёт на других страницах,
 * а якорей туда быть не должно.
 */
export function GuideFlowBar({ items }: { items: GuideFlowItem[] }) {
  return (
    <div className="bg-bone text-charcoal">
      <div className="mx-auto max-w-[1080px] px-6 sm:px-8 lg:px-16">
        <ol className="border-charcoal/15 flex list-none flex-wrap gap-x-6 gap-y-2 border-y py-5">
          {items.map((item) => (
            <li
              key={item.num}
              className="text-text-muted text-small inline-flex items-baseline gap-2"
            >
              <span className="text-moss-ink font-voice text-body font-medium tabular-nums">
                {item.num}
              </span>
              {item.title}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
