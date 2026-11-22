import type { Metadata } from "next";
import { CatalogRedirect } from "@/components/site/catalog-redirect";

export const metadata: Metadata = { alternates: { canonical: "/guide" }, robots: { index: false, follow: true } };

export default function FullRepottingRedirect() {
  return <CatalogRedirect path="/guide" />;
}
