import type { MetadataRoute } from "next";

import { SITE_NAME } from "@/constants/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "LMDLG",
    start_url: "/",
    display: "standalone",
    lang: "fr-FR",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
