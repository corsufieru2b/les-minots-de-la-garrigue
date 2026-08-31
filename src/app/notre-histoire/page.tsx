import type { Metadata } from "next";

import { StorySection } from "@/components/sections";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Notre histoire",
  "Découvrez l'histoire de Léo et Martin, deux frères d'Hyères, et la philosophie du restaurant Les Minots de la Garrigue.",
  "/notre-histoire",
);

export default function StoryPage() {
  return (
    <SitePageShell>
      <StorySection />
    </SitePageShell>
  );
}
