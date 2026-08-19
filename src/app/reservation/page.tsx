import type { Metadata } from "next";

import { ReservationSection } from "@/components/sections";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Reservation",
  "Envoyez votre demande de reservation aux Minots de la Garrigue.",
  "/reservation",
);

export default function ReservationPage() {
  return (
    <SitePageShell>
      <ReservationSection />
    </SitePageShell>
  );
}
