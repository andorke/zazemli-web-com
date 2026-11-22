"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/lib/consent";
import { updateMetrika } from "@/lib/metrika";

export function Metrika() {
  const consent = useConsent();
  const path = usePathname();
  useEffect(() => {
    updateMetrika(path);
  }, [consent, path]);
  return null;
}
