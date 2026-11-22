"use client";

import type { ComponentPropsWithoutRef } from "react";
import { reachGoal } from "@/lib/metrika";

export function JourneyLink({
  href,
  onClick,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          !href?.startsWith("/") ||
          href.startsWith("//")
        )
          return;
        const to = new URL(href, location.origin);
        const from = new URL(location.href);
        for (const [key, value] of from.searchParams) {
          if (key.startsWith("utm_") && !to.searchParams.has(key))
            to.searchParams.append(key, value);
        }
        if (
          from.pathname.startsWith("/guide") &&
          to.pathname === "/" &&
          /^#(?:soils|boxes|formats)$/.test(to.hash)
        ) {
          reachGoal("guide-to-collectio");
        }
        event.currentTarget.href = to.href;
      }}
    />
  );
}
