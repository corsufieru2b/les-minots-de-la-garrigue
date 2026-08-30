import type { Metadata } from "next";
import { readdir } from "node:fs/promises";
import path from "node:path";

import { CuisineSection } from "@/components/sections";
import { SitePageShell } from "@/components/site";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata(
  "Notre cuisine",
  "Explorez la cuisine mediterraneenne maison des Minots de la Garrigue et ses produits de saison.",
  "/notre-cuisine",
);

const cuisineImageExtensions = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);

async function getCuisineImages() {
  const imageDirectory = path.join(process.cwd(), "public", "images", "notre cuisine");

  try {
    const files = await readdir(imageDirectory);

    return files
      .filter((file) => cuisineImageExtensions.has(path.extname(file).toLowerCase()))
      .sort((first, second) => first.localeCompare(second, "fr", { numeric: true }))
      .map((file, index) => ({
        alt: `Création culinaire ${index + 1}`,
        src: `/images/notre cuisine/${file}`,
      }));
  } catch {
    return [];
  }
}

export default async function CuisinePage() {
  const cuisineImages = await getCuisineImages();

  return (
    <SitePageShell>
      <CuisineSection cuisineImages={cuisineImages} />
    </SitePageShell>
  );
}
