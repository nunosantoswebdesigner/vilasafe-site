import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Página única: só a raiz. A app (fozdoarelho.vilasafe.pt) tem o seu próprio sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: SITE.updated,
      changeFrequency: "monthly",
      priority: 1,
      images: [`${SITE.url}${SITE.ogImage.url}`],
    },
  ];
}
