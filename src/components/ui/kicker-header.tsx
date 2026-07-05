import { cn } from "@/lib/utils";

/* Кикер (.eyebrow прототипов): ui-роль 500, eyebrow-размер, КАПС, tracking 0.22em, muted */
export function KickerHeader({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "tracking-eyebrow font-ui text-eyebrow font-medium uppercase",
        "text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
