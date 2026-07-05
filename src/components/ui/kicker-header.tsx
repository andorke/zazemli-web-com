import { cn } from "@/lib/utils";

/* Кикер над заголовком секции: ui-роль, КАПС (переходный вид; вёрстка по прототипу — в 3.x) */
export function KickerHeader({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "tracking-kicker font-ui text-[10px] font-normal uppercase",
        "text-moss",
        className,
      )}
      {...props}
    />
  );
}
