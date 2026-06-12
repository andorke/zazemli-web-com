import { cn } from "@/lib/utils";

/* Апотекарная виньетка ❦ — единственный постоянный знак-акцент (tokens.fleuron) */
export function Fleuron({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      className={cn("text-moss font-serif opacity-80", className)}
      {...props}
    >
      ❦
    </span>
  );
}
