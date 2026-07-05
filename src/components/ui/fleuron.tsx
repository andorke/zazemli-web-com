import { cn } from "@/lib/utils";

/* Апотекарная виньетка ❦ — единственный постоянный знак-акцент (tokens.fleuron) */
export function Fleuron({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "text-moss font-voice opacity-80", // ds-allow: moss-large — фльерон: декоративный глиф, политика разрешает raw moss
        className,
      )}
      {...props}
    >
      ❦
    </span>
  );
}
