"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { OzonButton } from "@/components/site/ozon-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav, ozonStoreUrl } from "@/content/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Открыть меню"
          className="lg:hidden"
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-bone">
        <SheetHeader>
          <SheetTitle className="font-voice text-base font-normal">
            ЗАЗЕМЛИ
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-6 px-4">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-charcoal font-ui text-base"
            >
              {item.label}
            </Link>
          ))}
          <OzonButton href={ozonStoreUrl} className="mt-2 w-fit" />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
