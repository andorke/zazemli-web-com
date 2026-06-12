import { cn } from "@/lib/utils";

/* Кикер над заголовком секции: Unbounded 10px, КАПС, letter-spacing 0.18em, moss (Figma 185:2) */
export function KickerHeader({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "tracking-kicker font-sans text-[10px] font-normal uppercase",
        "text-moss",
        className,
      )}
      {...props}
    />
  );
}
