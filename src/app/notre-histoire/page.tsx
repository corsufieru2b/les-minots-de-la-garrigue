import type { Metadata } from "next";

import { StorySection } from "@/components/sections";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Notre histoire",
  "Decouvrez l'histoire des Minots de la Garrigue et l'ambiance conviviale du restaurant.",
  "/notre-histoire",
);

export default function StoryPage() {
  return (
    <SitePageShell>
      <StorySection />
    </SitePageShell>
  );
}
