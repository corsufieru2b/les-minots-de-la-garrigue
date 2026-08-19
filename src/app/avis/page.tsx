import type { Metadata } from "next";

import { ReviewsSection } from "@/components/sections";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Ils parlent de nous",
  "Découvrez les articles et distinctions qui mettent en lumière Les Minots de la Garrigue.",
  "/avis",
);

export default function ReviewsPage() {
  return (
    <SitePageShell>
      <ReviewsSection />
    </SitePageShell>
  );
}
