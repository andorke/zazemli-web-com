import { cn } from "@/lib/utils";

/*
 * Ритуальная приписка — наследник рукописного атома (handwritten-семейство
 * выведено с веба, typography.md v2.0). Акцент прототипов: voice-italic +
 * moss-ink. Правило DS: максимум 2 на страницу.
 */
export function RitualNote({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-moss-ink font-voice italic", className)}
      {...props}
    />
  );
}
