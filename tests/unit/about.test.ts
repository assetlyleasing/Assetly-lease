import { describe, expect, it } from "vitest";

import { ABOUT_CONTENT, ABOUT_META_DESCRIPTION } from "@/content/about/copy";

describe("About content", () => {
  it("keeps the approved minimal copy exact", () => {
    expect(ABOUT_CONTENT).toEqual({
      eyebrow: "About",
      heading: "About Assetly",
      body: "Assetly helps businesses access the assets they need through structured operating leases, with a focus on preserving working capital, reducing ownership risk, and maintaining financial flexibility. Its approach combines tailored structuring, fast turnaround, multi-sector expertise, and strong funding partners.",
      city: "Bengaluru",
    });
  });

  it("uses source-grounded metadata without adding company history", () => {
    expect(ABOUT_META_DESCRIPTION).toBe(
      "Learn how Assetly structures operating leases to help businesses preserve working capital and maintain financial flexibility.",
    );
    expect(`${ABOUT_CONTENT.body} ${ABOUT_META_DESCRIPTION}`).not.toMatch(
      /founder|founded|timeline|employees|clients|years|crore|million/i,
    );
  });
});
