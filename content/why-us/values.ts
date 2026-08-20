/** Why Assetly values — exact approved content from SOURCE_OF_TRUTH.md §14. */
export type WhyUsValue = {
  id: string;
  letter: "T" | "F" | "S" | "P";
  name: string;
  explanation: string;
};

export const WHY_US_HEADING = "Why Assetly";

export const WHY_US_VALUES: readonly WhyUsValue[] = [
  {
    id: "tailored-structuring",
    letter: "T",
    name: "Tailored Structuring",
    explanation:
      "Lease structures shaped around asset, tenure, cash-flow needs, and business context rather than a standard template.",
  },
  {
    id: "fast-turnaround",
    letter: "F",
    name: "Fast Turnaround",
    explanation:
      "A focused structuring and execution process to move from requirement to lease solution quickly.",
  },
  {
    id: "multi-sector-expertise",
    letter: "S",
    name: "Multi-Sector Expertise",
    explanation:
      "Experience across commercial interiors, manufacturing, construction, hospitality, healthcare, and IT infrastructure.",
  },
  {
    id: "strong-funding-partners",
    letter: "P",
    name: "Strong Funding Partners",
    explanation:
      "A strong funding network supports structuring and execution across asset categories.",
  },
] as const;
