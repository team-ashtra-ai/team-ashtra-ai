import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f5efe8",
    theme_color: "#0d1622",
    icons: [
      {
        src: siteConfig.iconPath,
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/brand/ash-tra-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
