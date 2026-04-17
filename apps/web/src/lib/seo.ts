import type { Metadata } from "next";

import { getSiteUrl, siteConfig } from "@/lib/site-config";

type BuildMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  imagePath?: string;
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = siteConfig.defaultPath,
  keywords = [],
  imagePath = siteConfig.ogImagePath,
  noIndex = false,
}: BuildMetadataOptions = {}): Metadata {
  const metadataBase = getSiteUrl();
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;

  return {
    metadataBase,
    title: fullTitle,
    description,
    applicationName: siteConfig.shortName,
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "technology",
    keywords: [...siteConfig.keywords, ...keywords],
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [{ url: siteConfig.iconPath, type: "image/png" }],
      shortcut: [siteConfig.iconPath],
      apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      url: canonical,
      images: [
        {
          url: imagePath,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} preview card`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imagePath],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
          },
        },
  };
}
