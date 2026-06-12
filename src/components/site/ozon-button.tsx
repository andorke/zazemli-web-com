import { Button } from "@/components/ui/button";
import { buildOzonUrl } from "@/lib/utm";
import type { ComponentProps } from "react";

/*
 * Единственная конверсия сайта — внешняя ссылка на Ozon (бриф §1).
 * Пока магазин не открыт (href=null) — некликабельная заглушка «Скоро на Ozon».
 */
export function OzonButton({
  href,
  skuNumber,
  className,
  size,
}: {
  href: string | null;
  skuNumber?: `N°${string}`;
  className?: string;
  size?: ComponentProps<typeof Button>["size"];
}) {
  if (href === null) {
    return (
      <Button disabled className={className} size={size}>
        Скоро на Ozon
      </Button>
    );
  }
  return (
    <Button asChild className={className} size={size}>
      <a
        href={buildOzonUrl(href, { skuNumber })}
        target="_blank"
        rel="noopener noreferrer"
      >
        Купить на Ozon
      </a>
    </Button>
  );
}
