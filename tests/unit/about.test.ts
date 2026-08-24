import { describe, expect, it } from "vitest";

import { ABOUT_CONTENT, ABOUT_META_DESCRIPTION } from "@/content/about/copy";

describe("About content", () => {
  it("keeps the approved minimal copy exact", () => {
    expect(ABOUT_CONTENT).toEqual({
      eyebrow: "About",
      heading: "About Assetly",
      paragraphs: [
        "Assetly is a leasing platform built for growing businesses. We purchase office furniture and fit-outs, IT equipment, medical equipment, and plant & machinery, and lease these assets to corporate customers under fixed-term rental contracts – a simple, no-ownership model.",
        "Instead of a large upfront purchase, customers pay a fixed rental for the assets they use – for exactly as long as they need it. This keeps costs predictable, frees up working capital, and gives businesses the flexibility to scale and upgrade as their needs change.",
        "The result: businesses preserve capital, simplify budgeting, and stay agile as their asset needs evolve.",
        "At Assetly Leasing, our strength lies in the depth and diversity of our leadership. Bringing together decades of combined experience in finance, business development, operations and facility management, our leaders drive the strategic vision, operational excellence, and financial discipline that power Assetly's growth as an asset leasing platform.",
      ],
      city: "Bengaluru",
    });
  });

  it("uses source-grounded metadata without adding company history", () => {
    expect(ABOUT_META_DESCRIPTION).toBe(
      "Learn how Assetly structures operating leases to help businesses preserve working capital and maintain financial flexibility.",
    );
    expect(ABOUT_META_DESCRIPTION).not.toMatch(
      /founder|founded|timeline|employees|clients|years|crore|million/i,
    );
  });
});
