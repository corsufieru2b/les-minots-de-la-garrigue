import type { Metadata } from "next";

import { ContactSection } from "@/components/sections";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Contact",
  "Retrouvez les informations de contact et les horaires des Minots de la Garrigue.",
  "/contact",
);

export default function ContactPage() {
  return (
    <SitePageShell>
      <ContactSection />
    </SitePageShell>
  );
}
