import type { Metadata } from "next";
import { CatalogRedirect } from "@/components/site/catalog-redirect";

export const metadata: Metadata = { alternates: { canonical: "/" }, robots: { index: false, follow: true } };
export default function CollectioPage() {
  return <CatalogRedirect path="/" />;
}
