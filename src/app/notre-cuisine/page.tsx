import type { Metadata } from "next";

import { CuisineSection } from "@/components/sections";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Notre cuisine",
  "Explorez la cuisine mediterraneenne maison des Minots de la Garrigue et ses produits de saison.",
  "/notre-cuisine",
);

export default function CuisinePage() {
  return (
    <SitePageShell>
      <CuisineSection />
    </SitePageShell>
  );
}
