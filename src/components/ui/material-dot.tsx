import { cn } from "@/lib/utils";

/*
 * Точечный маркер материала грунта. Единственное разрешённое место earth-палитры
 * (color-system.md). moss добавлен по Figma 185:2 (декоративная точка в шапке).
 */
export type MaterialName =
  | "graphite"
  | "soil"
  | "ceramsite"
  | "pumice"
  | "sand"
  | "gravel"
  | "moss";

/* Экспортирована для переиспользования (полоска долей g4 на /lab) — тот же цвет, что и точка */
export const dotColor: Record<MaterialName, string> = {
  graphite: "bg-graphite",
  soil: "bg-soil",
  ceramsite: "bg-ceramsite",
  pumice: "bg-pumice",
  sand: "bg-sand",
  gravel: "bg-gravel",
  moss: "bg-moss",
};

export function MaterialDot({
  material,
  className,
  ...props
}: React.ComponentProps<"span"> & { material: MaterialName }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-[7px] rounded-full",
        dotColor[material],
        className,
      )}
      {...props}
    />
  );
}
