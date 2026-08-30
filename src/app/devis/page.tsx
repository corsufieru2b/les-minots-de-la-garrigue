import type { Metadata } from "next";

import { QuoteSection } from "@/components/sections";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Traiteur",
  "Decouvrez les prestations traiteur et evenements des Minots de la Garrigue.",
  "/devis",
);

export default function QuotePage() {
  return (
    <SitePageShell>
      <QuoteSection />
    </SitePageShell>
  );
}
