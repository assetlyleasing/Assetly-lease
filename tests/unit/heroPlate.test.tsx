import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  HERO_MOBILE_PLATE_MODE,
  HERO_PLATE_VIEWBOX,
  HeroPlateArtwork,
  type HeroMobilePlateMode,
} from "@/content/plates/hero-plate";

describe("Hero plate composition", () => {
  it("ships the approved combined phone mode behind a typed switch", () => {
    const mode: HeroMobilePlateMode = HERO_MOBILE_PLATE_MODE;
    expect(mode).toBe("both");
    expect(HERO_PLATE_VIEWBOX).toBe("0 0 1200 700");
  });

  it("keeps the complete Access, Scale, Grow and datum geometry addressable", () => {
    const markup = renderToStaticMarkup(<HeroPlateArtwork />);

    for (const region of ["access", "scale", "growth", "datum"]) {
      expect(markup).toContain(`data-hero-plate-region="${region}"`);
    }

    expect(markup.match(/data-hero-plate-region=/g)).toHaveLength(4);
    expect(markup.match(/data-hero-plate-node=/g)).toHaveLength(3);
    expect(markup).toContain('<line x1="0" y1="600" x2="1200" y2="600"');
    expect(markup).not.toContain('y1="615"');
  });
});
