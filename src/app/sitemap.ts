import type { MetadataRoute } from "next";

const routes = [
  "/",
  "/notre-histoire",
  "/notre-cuisine",
  "/galerie",
  "/reservation",
  "/avis",
  "/contact",
  "/devis",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((path) => ({
    url: path,
    lastModified: now,
  }));
}
