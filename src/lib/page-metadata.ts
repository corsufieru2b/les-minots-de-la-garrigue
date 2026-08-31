import type { Metadata } from "next";

import { SITE_NAME, SITE_OG_IMAGE, SITE_OG_IMAGE_ALT } from "@/constants/site";

/**
 * Next.js replaces nested metadata objects (openGraph, twitter) wholesale rather
 * than merging them per key, so every page must redeclare the shared fields
 * (siteName, locale, type, images, card) or they silently disappear.
 */
export function buildPageMetadata(title: string, description: string, path: string): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const sharedImages = [{ url: SITE_OG_IMAGE, alt: SITE_OG_IMAGE_ALT }];

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "fr_FR",
      type: "website",
      images: sharedImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: sharedImages,
    },
  };
}
