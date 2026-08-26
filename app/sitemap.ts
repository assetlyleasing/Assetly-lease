import type { MetadataRoute } from "next";

const SITE_URL = "https://assetly.lease";

/**
 * §22: only the two public routes that carry per-route metadata. `/admin` is
 * deliberately excluded — see app/robots.ts and app/admin/page.tsx's noindex.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
