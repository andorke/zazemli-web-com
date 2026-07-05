import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/*
 * Кнопки .btn / .btn--solid по прототипам (landing.html): ui-роль 500,
 * рамка currentColor или заливка moss, радиус 0, без тени. Текст bone
 * на moss — как в прототипе (заливки raw moss политика разрешает).
 * asChild — для ссылок-CTA (<a> к якорям и Ozon).
 */
export function BrandButton({
  solid = false,
  asChild = false,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  solid?: boolean;
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      className={cn(
        "font-ui text-small inline-flex items-center gap-[0.6em] rounded-none border font-medium tracking-[0.02em]",
        "cursor-pointer px-[1.9em] py-[0.95em] no-underline transition-opacity",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ring",
        solid
          ? "border-moss bg-moss text-bone hover:opacity-90"
          : "border-current bg-transparent hover:opacity-70",
        className,
      )}
      {...props}
    />
  );
}
