export type SectorId =
  | "commercial-interiors"
  | "manufacturing"
  | "construction"
  | "hospitality"
  | "healthcare"
  | "it-infrastructure";

export type SectorPlateId = SectorId;

export type Sector = {
  id: SectorId;
  index: "01" | "02" | "03" | "04" | "05" | "06";
  name: string;
  descriptor: string;
  plateId: SectorPlateId;
};

/** The locked six-sector pool from SOURCE_OF_TRUTH.md §15. */
export const SECTORS: readonly Sector[] = [
  {
    id: "commercial-interiors",
    index: "01",
    name: "Commercial Interiors",
    descriptor: "Workplace, fit-out and interior assets.",
    plateId: "commercial-interiors",
  },
  {
    id: "manufacturing",
    index: "02",
    name: "Manufacturing",
    descriptor: "Production, automation and industrial assets.",
    plateId: "manufacturing",
  },
  {
    id: "construction",
    index: "03",
    name: "Construction",
    descriptor: "Plant, machinery and specialist assets.",
    plateId: "construction",
  },
  {
    id: "hospitality",
    index: "04",
    name: "Hospitality",
    descriptor: "Rooms, kitchens and operating infrastructure.",
    plateId: "hospitality",
  },
  {
    id: "healthcare",
    index: "05",
    name: "Healthcare",
    descriptor: "Clinical, diagnostic and facility assets.",
    plateId: "healthcare",
  },
  {
    id: "it-infrastructure",
    index: "06",
    name: "IT Equipment & IT Infrastructure",
    descriptor: "Servers, hardware and network infrastructure.",
    plateId: "it-infrastructure",
  },
] as const;
