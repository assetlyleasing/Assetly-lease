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
  /*
   * A fitted-out workplace bay, drawn in elevation like the manufacturing and
   * IT plates rather than as a plan: ceiling line and linear light, desk with
   * monitor and task chair, glazed partition. The earlier drawing was a set of
   * nested rectangles that could have been a floor plan or a kitchen; these are
   * the objects a fit-out actually buys.
   */
  "commercial-interiors": (
    <>
      <path d="M12 116H188" />
      <path d="M22 28H186" />
      <path d="M56 28V38M44 38H72" />
      <path d="M24 82H94M28 82V116M90 82V116M28 90H90" />
      <path d="M42 56H76V78H42Z" />
      <path d="M59 78V82" />
      <path d="M100 90H128V96H100Z" />
      <path d="M122 90V66H128V90" />
      <path d="M114 96V106M104 108H124" />
      <path d="M138 36H186V116M138 36V116M186 116H138" />
      <path d="M154 36V116M170 36V116M138 72H186" />
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
  /*
   * Plant on a site: a tracked excavator working beside a frame that is still
   * going up. §15's descriptor for this sector is "plant, machinery and
   * specialist assets", and the previous truss-over-grid read as generic
   * geometry — it could as easily have been a bridge or a roof detail.
   *
   * The machine is deliberately not the wheeled crane the Compare plate
   * borrows from the reference: different chassis, different job.
   */
  construction: (
    <>
      <path d="M12 118H188" />
      <path d="M116 118V64H172V118M116 92H172M134 64V118M154 64V118" />
      <path d="M110 64H178M124 64V54M144 64V54M164 64V54" />
      <circle cx="32" cy="110" r="6" />
      <circle cx="78" cy="110" r="6" />
      <circle cx="55" cy="112" r="3" />
      <path d="M32 104H78M32 116H78" />
      <path d="M40 78H88V104H40Z" />
      <path d="M46 58H70V78H46Z" />
      <path d="M50 62H66V74H50Z" />
      <path d="M48 82L24 50L28 47L52 79Z" />
      <path d="M26 49L14 76L19 78L31 51Z" />
      <path d="M13 77L8 88L25 94L29 84Z" />
      <path d="M9 90L12 96M17 92L20 98" />
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
  /*
   * Clinical infrastructure rather than a symbol: a wheeled patient bed under a
   * vitals monitor, and an imaging gantry with its table run out. §15 asks for
   * "medical-equipment geometry", and the drawing this replaces leaned on a
   * plain cross inside a square to carry the meaning — the one piece of
   * clip-art vocabulary the plate language avoids everywhere else.
   */
  healthcare: (
    <>
      <path d="M12 116H188" />
      <path d="M24 26H70V54H24Z" />
      <path d="M29 42L35 33L40 48L46 29L51 42L55 36H65" />
      <path d="M47 54V62M38 62H56" />
      <path d="M22 86H92V98H22Z" />
      <path d="M18 70H24V86H18Z" />
      <path d="M90 76H96V86H90Z" />
      <path d="M28 98V108M86 98V108" />
      <circle cx="30" cy="112" r="4" />
      <circle cx="84" cy="112" r="4" />
      <path d="M100 74H126V82H100Z" />
      <path d="M108 82V102M100 102H118" />
      <path d="M126 44H184V104H126Z" />
      <circle cx="155" cy="74" r="20" />
      <circle cx="155" cy="74" r="9" />
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
