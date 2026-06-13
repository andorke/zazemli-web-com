import { cn } from "@/lib/utils";

/*
 * Слот под иллюстрацию. Иллюстрации главной ещё в производстве (Midjourney, бриф §7),
 * поэтому слот резервирует площадь через aspect-ratio — без CLS при подстановке.
 * Тон рамки задаётся снаружи (на тёмных секциях — светлый, на bone — charcoal).
 */
export function ImageSlot({
  caption,
  className,
  tone = "dark",
}: {
  caption: string;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center border",
        tone === "dark"
          ? "border-bone/20 bg-bone/5 text-bone/50"
          : "border-charcoal/15 bg-charcoal/3 text-charcoal/40",
        className,
      )}
    >
      <span className="px-4 text-center font-serif text-sm italic">
        {caption}
      </span>
    </div>
  );
}
