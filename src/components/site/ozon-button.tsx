"use client";

import { Button } from "@/components/ui/button";
import { reachGoal } from "@/lib/metrika";
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
  label = "Купить на Ozon",
}: {
  href: string | null;
  skuNumber?: `N°${string}`;
  className?: string;
  size?: ComponentProps<typeof Button>["size"];
  /* текст активной ссылки; buybar передаёт «Купить {размер} на Ozon» (задача 2.4) */
  label?: string;
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
        onClick={() => reachGoal("ozon-click")}
      >
        {label}
      </a>
    </Button>
  );
}
