import type { Metadata } from "next";

import { HeroSection } from "@/components/sections";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Accueil",
  "Decouvrez Les Minots de la Garrigue, table mediterraneenne conviviale.",
  "/",
);

export default function HomePage() {
  return (
    <SitePageShell>
      <HeroSection />
    </SitePageShell>
  );
}
