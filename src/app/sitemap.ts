import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/site";

const routes = [
  "/",
  "/notre-histoire",
  "/notre-cuisine",
  "/galerie",
  "/reservation",
  "/avis",
  "/contact",
  "/traiteur",
  "/mentions-legales",
  "/politique-de-confidentialite",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));
}
