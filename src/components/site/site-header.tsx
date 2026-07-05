import Link from "next/link";

import { MobileNav } from "@/components/site/mobile-nav";
import { OzonButton } from "@/components/site/ozon-button";
import { MaterialDot } from "@/components/ui/material-dot";
import { mainNav, ozonStoreUrl } from "@/content/site";

/* Шапка по Figma 185:3: wordmark · меню (Коллекция/Лаборатория/Гайд) · кнопка Ozon + moss-точка */
export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-6 px-6 py-7 lg:px-16">
      <Link href="/" className="text-charcoal font-voice text-base opacity-85">
        ЗАЗЕМЛИ
      </Link>

      <nav className="hidden items-center gap-9 lg:flex">
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-charcoal/70 hover:text-charcoal font-ui text-sm transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-2 lg:flex">
        <OzonButton href={ozonStoreUrl} className="h-11 px-[22px]" />
        <MaterialDot material="moss" />
      </div>

      <MobileNav />
    </header>
  );
}
