"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav } from "@/content/site";

/*
 * Бургер-меню ниже layout-брейкпоинта (860px, прототип). Механика — Sheet
 * (radix Dialog: aria-expanded/aria-controls на триггере из коробки),
 * вид — новые токены. Те же 3 пункта, без Ozon-кнопки.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Открыть меню"
          className="layout:hidden"
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-bone">
        <SheetHeader>
          <SheetTitle className="font-voice text-base font-normal tracking-[0.06em]">
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
        </nav>
      </SheetContent>
    </Sheet>
  );
}
