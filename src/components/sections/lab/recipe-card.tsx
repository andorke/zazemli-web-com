import { MaterialDot } from "@/components/ui/material-dot";
import type { LabComponent, Recipe } from "@/content/lab";
import { GROUP_MATERIAL } from "./soil-function-colors";
import { SharesBar } from "./shares-bar";

/*
 * Карточка рецептуры (прототип .rec): нативный <details> с инлайн-раскрытием.
 * id совпадает со slug'ом товара — deep-link `/lab#rec-{slug}` (LabRecipesSection)
 * находит карточку по нему и раскрывает. Highlight на подсветку — data-hi,
 * временный атрибут, снимается таймером в LabRecipesSection.
 */
export function RecipeCard({
  recipe,
  componentByKey,
}: {
  recipe: Recipe;
  componentByKey: Map<string, LabComponent>;
}) {
  return (
    <details
      id={recipe.id}
      className="group border-charcoal/15 bg-bone open:border-charcoal/30 data-[hi=true]:border-moss scroll-mt-6 border transition-colors"
    >
      <summary className="grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-4 p-5 [&::-webkit-details-marker]:hidden lg:grid-cols-[auto_1fr_minmax(120px,220px)_auto]">
        <span className="text-moss-ink font-voice text-body tabular-nums">
          {recipe.number}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-charcoal font-voice text-body">
            {recipe.plant}
          </span>
          <span className="text-ink-muted text-small">{recipe.tag}</span>
        </span>
        <SharesBar shares={recipe.shares} className="hidden lg:flex" />
        <span className="text-moss-ink inline-flex items-center gap-2 whitespace-nowrap">
          <span className="font-ui text-small hidden font-medium sm:inline">
            смотреть состав
          </span>
          <span
            aria-hidden="true"
            className="border-charcoal/15 group-open:border-moss inline-flex size-7 items-center justify-center rounded-full border text-lg leading-none transition-transform group-open:rotate-45"
          >
            +
          </span>
        </span>
      </summary>

      <SharesBar shares={recipe.shares} className="lg:hidden" />

      <div className="border-charcoal/15 border-t p-5">
        <p className="text-ink-muted text-small leading-normal">
          {recipe.bio}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {recipe.mix.map((item) => {
            const component = componentByKey.get(item.key);
            if (!component) return null;
            return (
              <li
                key={item.key}
                className="border-charcoal/15 text-small inline-flex items-center gap-1.5 border px-2.5 py-1"
              >
                <MaterialDot material={GROUP_MATERIAL[component.group]} />
                {component.shortName ?? component.name} · {item.pct}%
              </li>
            );
          })}
        </ul>

        <div className="text-charcoal/85 leading-body mt-4 flex flex-col gap-3 text-small">
          {recipe.why.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {recipe.aside && (
          <p className="text-moss-ink mt-4 max-w-lg font-voice text-body italic">
            {recipe.aside}
          </p>
        )}
      </div>
    </details>
  );
}
