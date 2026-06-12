import { cn } from "@/lib/utils";

/* Рукописная приписка. Правило DS: максимум 2 на страницу (typography.md §1) */
export function CaveatNote({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("font-hand leading-caveat opacity-85", className)}
      {...props}
    />
  );
}
