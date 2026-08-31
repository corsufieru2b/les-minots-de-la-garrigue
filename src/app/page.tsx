import type { Metadata } from "next";

import { HeroSection } from "@/components/sections";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Restaurant à Hyères",
  "Les Minots de la Garrigue, restaurant à Hyères : cuisine méditerranéenne conviviale imaginée par Martin à partir de produits locaux et de saison.",
  "/",
);

export default function HomePage() {
  return (
    <SitePageShell>
      <HeroSection />
    </SitePageShell>
  );
}
