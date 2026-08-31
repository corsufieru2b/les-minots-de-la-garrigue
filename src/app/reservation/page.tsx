import type { Metadata } from "next";

import { ReservationSection } from "@/components/sections";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Réservation",
  "Réservez votre table au restaurant Les Minots de la Garrigue à Hyères directement en ligne.",
  "/reservation",
);

export default function ReservationPage() {
  return (
    <SitePageShell>
      <ReservationSection />
    </SitePageShell>
  );
}
