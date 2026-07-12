import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/*
 * twMerge не знает кастомные font-size роли темы (text-eyebrow, text-body…)
 * и классифицирует их как text-color — тогда text-<цвет> их вытесняет.
 * Регистрируем шкалу ролей и fluid-размеры как font-size группу.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "take",
            "body",
            "small",
            "caption",
            "eyebrow",
            "hero",
            "hero-inner",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
