import type { Metadata } from "next";

import { SITE_NAME } from "@/constants/site";

export function buildPageMetadata(title: string, description: string, path: string): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;

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
    },
    twitter: {
      title: fullTitle,
      description,
    },
  };
}
