import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  HERO_LOADER_TAGLINE,
  HeroLoader,
} from "@/components/hero/HeroLoader";
import {
  HERO_LOADER_DURATIONS,
  nextHeroLoaderPhase,
} from "@/lib/motion/useHeroLoaderSequence";

describe("Hero opening sequence", () => {
  it("keeps the approved signature copy exact and decorative", () => {
    const { container } = render(
      <HeroLoader phase="signature" reduced={false} />,
    );

    expect(HERO_LOADER_TAGLINE).toBe("ACCESS · SCALE · GROW");
    expect(screen.getByText(HERO_LOADER_TAGLINE)).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("advances through the locked hierarchy in one direction", () => {
    expect(nextHeroLoaderPhase("prepare")).toBe("signature");
    expect(nextHeroLoaderPhase("signature")).toBe("recede");
    expect(nextHeroLoaderPhase("recede")).toBe("settle");
    expect(nextHeroLoaderPhase("settle")).toBe("hold");
    expect(nextHeroLoaderPhase("hold")).toBe("reveal");
    expect(nextHeroLoaderPhase("reveal")).toBe("done");
  });

  it("uses two calm blinks and a short reduced-motion hand-off", () => {
    expect(HERO_LOADER_DURATIONS.prepare).toBe(150);
    expect(HERO_LOADER_DURATIONS.signature).toBe(1700);
    expect(HERO_LOADER_DURATIONS.recede).toBe(650);
    expect(HERO_LOADER_DURATIONS.settle).toBe(850);
    expect(HERO_LOADER_DURATIONS.hold).toBe(320);
    expect(HERO_LOADER_DURATIONS.reveal).toBe(420);
    expect(HERO_LOADER_DURATIONS.reducedReveal).toBeLessThanOrEqual(120);
  });

  it("unmounts the overlay after completion", () => {
    const { container } = render(<HeroLoader phase="done" reduced={false} />);
    expect(container).toBeEmptyDOMElement();
  });
});
