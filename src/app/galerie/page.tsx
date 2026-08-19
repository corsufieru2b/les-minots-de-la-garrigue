import type { Metadata } from "next";

import { GallerySection } from "@/components/sections";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Galerie",
  "Parcourez la galerie photo du restaurant Les Minots de la Garrigue.",
  "/galerie",
);

export default function GalleryPage() {
  return (
    <SitePageShell>
      <GallerySection />
    </SitePageShell>
  );
}
