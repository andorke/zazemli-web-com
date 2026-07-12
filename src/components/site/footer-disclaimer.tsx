"use client";

import { usePathname } from "next/navigation";

import { footer } from "@/content/site";

/*
 * Слот дисклеймера в SiteFooter (design decision 3, guide-lab): рендерится
 * только на /lab. SiteFooter живёт в корневом layout и рендерится сиблингом
 * {children} — page-level пропс до него не докинуть без контекста поверх
 * всего дерева, поэтому решение принимается по текущему пути; сам SiteFooter
 * остаётся общим (не форкается).
 */
export function FooterDisclaimer() {
  const pathname = usePathname();
  if (pathname !== "/lab") return null;
  return (
    <>
      {footer.disclaimer}
      <br />
    </>
  );
}
