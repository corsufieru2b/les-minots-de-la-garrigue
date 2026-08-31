import type { Metadata } from "next";

import { QuoteSection } from "@/components/sections";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Traiteur",
  "Service traiteur des Minots de la Garrigue à Hyères : mariages, événements privés et prestations sur mesure, au restaurant ou en extérieur.",
  "/traiteur",
);

export default function QuotePage() {
  return (
    <SitePageShell>
      <QuoteSection />
    </SitePageShell>
  );
}
