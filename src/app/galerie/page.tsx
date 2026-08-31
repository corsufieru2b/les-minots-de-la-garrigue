import type { Metadata } from "next";

import { GallerySection } from "@/components/sections";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Galerie",
  "Découvrez en images l'ambiance et les créations culinaires du restaurant Les Minots de la Garrigue à Hyères.",
  "/galerie",
);

export default function GalleryPage() {
  return (
    <SitePageShell>
      <GallerySection />
    </SitePageShell>
  );
}
