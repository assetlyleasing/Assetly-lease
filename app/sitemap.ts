import type { MetadataRoute } from "next";

const SITE_URL = "https://assetly.lease";

/**
 * §22: every public route, each of which carries its own canonical and Open
 * Graph metadata. `/admin` is deliberately excluded — see app/robots.ts and
 * app/admin/page.tsx's noindex.
 *
 * Priority ranks the routes against each other, not against the rest of the
 * web: the proposition first, About behind it, and the legal pages last, since
 * they exist to be findable rather than to be entered through. Their text
 * changes on the order of years, so they say so rather than claiming the
 * monthly cadence the marketing routes have.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
