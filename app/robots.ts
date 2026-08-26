import type { MetadataRoute } from "next";

const SITE_URL = "https://assetly.lease";

/** §22: public routes allowed, /admin disallowed (also noindex — see app/admin/page.tsx). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
