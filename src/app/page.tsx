import type { Metadata } from "next";

import { HeroSection } from "@/components/sections";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Restaurant à Hyères",
  "Les Minots de la Garrigue, restaurant à Hyères : cuisine méditerranéenne conviviale imaginée par Martin à partir de produits locaux et de saison.",
  "/",
);

export default function HomePage() {
  return (
    <>
      {/* Hero background is a CSS background-image (not next/image); preload it since it is the page's LCP element. */}
      <link rel="preload" as="image" href="/images/hero/Hero-01.webp.jpeg" fetchPriority="high" />
      <SitePageShell>
        <HeroSection />
      </SitePageShell>
    </>
  );
}
