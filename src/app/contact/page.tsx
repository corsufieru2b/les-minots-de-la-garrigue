import type { Metadata } from "next";

import { ContactSection } from "@/components/sections";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Contact",
  "Adresse, téléphone, email et horaires du restaurant Les Minots de la Garrigue à Hyères.",
  "/contact",
);

export default function ContactPage() {
  return (
    <SitePageShell>
      <ContactSection />
    </SitePageShell>
  );
}
