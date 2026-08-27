import { cn } from "@/lib/utils";

/*
 * Нативный <details>-аккордеон по прототипам (guide/collectio-*):
 * summary с dotted-подчёркиванием и caret ⌄, поворачивающимся при open.
 * Без JS — раскрытие делает браузер; анимацию глушит prefers-reduced-motion.
 */
export function DetailsAccordion({
  summary,
  className,
  summaryClassName,
  children,
  ...props
}: React.ComponentProps<"details"> & {
  summary: React.ReactNode;
  summaryClassName?: string;
}) {
  return (
    <details className={cn("group", className)} {...props}>
      <summary
        className={cn(
          /* FIX-19: зона 44px растёт min-height, а не кеглем — вертикальный padding
             сдвинул бы соседний текст и разъехалась бы сетка */
          "text-moss-ink font-ui text-caption flex min-h-11 cursor-pointer list-none items-center tracking-[0.04em]",
          "underline decoration-dotted underline-offset-[3px]",
          "transition-opacity hover:opacity-70 [&::-webkit-details-marker]:hidden",
          summaryClassName,
        )}
      >
        {summary}
        <span
          aria-hidden="true"
          className="ml-[0.4em] inline-block transition-transform duration-300 group-open:rotate-180"
        >
          ⌄
        </span>
      </summary>
      {children}
    </details>
  );
}
