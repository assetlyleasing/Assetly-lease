import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FlipCard } from "@/components/why-us/FlipCard";
import { WHY_US_HEADING, WHY_US_VALUES } from "@/content/why-us/values";

const EXPECTED = [
  [
    "T",
    "Tailored Structuring",
    "Lease structures shaped around asset, tenure, cash-flow needs, and business context rather than a standard template.",
  ],
  [
    "F",
    "Fast Turnaround",
    "A focused structuring and execution process to move from requirement to lease solution quickly.",
  ],
  [
    "S",
    "Multi-Sector Expertise",
    "Experience across commercial interiors, manufacturing, construction, hospitality, healthcare, and IT infrastructure.",
  ],
  [
    "P",
    "Strong Funding Partners",
    "A strong funding network supports structuring and execution across asset categories.",
  ],
];

describe("Why Assetly content (§14)", () => {
  it("keeps the approved heading and exact T/F/S/P copy", () => {
    expect(WHY_US_HEADING).toBe("Why Assetly");
    expect(
      WHY_US_VALUES.map((value) => [
        value.letter,
        value.name,
        value.explanation,
      ]),
    ).toEqual(EXPECTED);
  });

  it("keeps card state independent and exposes details only when active", () => {
    render(
      <>
        <FlipCard value={WHY_US_VALUES[0]} />
        <FlipCard value={WHY_US_VALUES[1]} />
      </>,
    );

    const tailored = screen.getByRole("button", { name: "Tailored Structuring" });
    const fast = screen.getByRole("button", { name: "Fast Turnaround" });

    expect(tailored).toHaveAttribute("aria-pressed", "false");
    expect(fast).toHaveAttribute("aria-pressed", "false");
    expect(document.querySelectorAll("[data-a11y-description]")).toHaveLength(0);

    fireEvent.click(tailored);
    expect(tailored).toHaveAttribute("aria-pressed", "true");
    expect(fast).toHaveAttribute("aria-pressed", "false");
    expect(document.querySelectorAll("[data-a11y-description]")).toHaveLength(1);

    fireEvent.click(fast);
    expect(tailored).toHaveAttribute("aria-pressed", "true");
    expect(fast).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelectorAll("[data-a11y-description]")).toHaveLength(2);
  });
});
