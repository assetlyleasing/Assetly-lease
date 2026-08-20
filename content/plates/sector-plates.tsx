import type { SectorPlateId } from "@/content/sectors/sectors";

import { Plate } from "@/components/plate/Plate";

export const SECTOR_PLATE_VIEWBOX = "0 0 200 130";

type SectorPlateProps = {
  plateId: SectorPlateId;
  drawn: boolean;
  className?: string;
};

export function SectorPlate({ plateId, drawn, className }: SectorPlateProps) {
  return (
    <Plate
      viewBox={SECTOR_PLATE_VIEWBOX}
      drawn={drawn}
      className={className}
      opacity={0.62}
      strokeWidth={1.05}
    >
      {PLATE_GEOMETRY[plateId]}
    </Plate>
  );
}

const PLATE_GEOMETRY: Record<SectorPlateId, React.ReactNode> = {
  "commercial-interiors": (
    <>
      <path d="M15 109V19H184V109H15Z" />
      <path d="M15 61H77V19M77 61V109M77 83H126V109M126 83V43H184" />
      <rect x="29" y="31" width="32" height="18" rx="2" />
      <path d="M37 49V56M53 49V56M88 30H126V61H88Z" />
      <circle cx="96" cy="70" r="5" />
      <circle cx="116" cy="70" r="5" />
      <path d="M139 57H170V93H139ZM145 66H164M145 75H164M145 84H158" />
    </>
  ),
  manufacturing: (
    <>
      <path d="M14 105H186M24 105V77H62V105M70 105V54H126V105M136 105V69H178V105" />
      <path d="M31 77V58H54V77M82 54V34H113V54M145 69V47H169V69" />
      <circle cx="43" cy="92" r="8" />
      <circle cx="98" cy="82" r="16" />
      <circle cx="157" cy="89" r="9" />
      <path d="M98 66V98M82 82H114M87 71L109 93M109 71L87 93" />
      <path d="M22 46H61M25 39H58M137 39H177M140 32H174" />
    </>
  ),
  construction: (
    <>
      <path d="M20 109H184M42 109V35H155V109M42 55H155M42 79H155" />
      <path d="M66 35V109M99 35V109M131 35V109" />
      <path d="M24 99L99 15L175 99M99 15V35M99 15H174M158 15V68" />
      <path d="M150 68H166V84H150Z" />
      <path d="M25 99H42M155 99H176" />
    </>
  ),
  hospitality: (
    <>
      <path d="M18 106H183M28 106V62H113V106M28 83H113" />
      <path d="M37 62V48H67V62M75 62V48H104V62" />
      <path d="M126 106V71H174V106M126 88H174" />
      <path d="M150 20V57M136 57H164M139 57C139 67 161 67 161 57" />
      <circle cx="150" cy="18" r="4" />
      <path d="M119 106V96H181V106M42 106V96H101V106" />
    </>
  ),
  healthcare: (
    <>
      <path d="M16 107H185M27 107V75H118V107M27 90H118M39 75V63H73V75" />
      <path d="M118 107V45H178V107M130 57H166V84H130Z" />
      <path d="M139 70H157M148 61V79" />
      <circle cx="48" cy="108" r="7" />
      <circle cx="101" cy="108" r="7" />
      <path d="M25 41H78L87 51H108" />
      <path d="M29 40L37 31L45 49L54 25L63 42L71 35L79 41" />
    </>
  ),
  "it-infrastructure": (
    <>
      <rect x="20" y="19" width="48" height="91" rx="2" />
      <rect x="78" y="19" width="48" height="91" rx="2" />
      <rect x="136" y="19" width="44" height="91" rx="2" />
      <path d="M28 34H60M28 48H60M28 62H60M28 76H60M28 90H60" />
      <path d="M86 34H118M86 48H118M86 62H118M86 76H118M86 90H118" />
      <path d="M144 34H172M144 48H172M144 62H172M144 76H172M144 90H172" />
      <circle cx="31" cy="34" r="1.8" />
      <circle cx="89" cy="48" r="1.8" />
      <circle cx="147" cy="62" r="1.8" />
      <path d="M44 110V120M102 110V120M158 110V120M44 120H158" />
    </>
  ),
};
