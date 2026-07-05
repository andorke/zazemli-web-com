import Link from "next/link";

import { MobileNav } from "@/components/site/mobile-nav";
import { mainNav } from "@/content/site";

/*
 * Topbar по прототипу landing.html: wordmark (voice) · 3 пункта меню (ui).
 * Кнопки Ozon в шапке нет. Меню сворачивается в бургер ниже layout (860px).
 */
export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-6 px-6 py-6 lg:px-16">
      <Link
        href="/"
        className="text-charcoal font-voice text-[1.3rem] tracking-[0.06em]"
      >
        ЗАЗЕМЛИ
      </Link>

      <nav className="layout:flex hidden items-center gap-9">
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-charcoal/70 hover:text-charcoal font-ui text-small font-medium transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <MobileNav />
    </header>
  );
}
