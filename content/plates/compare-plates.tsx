/**
 * Compare plates — one per argument slide (SOURCE_OF_TRUTH.md §13).
 *
 * The first, second, and fourth drawings adapt the three argument plates in
 * `reference/home-2.html`, as approved during the Phase 4 correction. Tax
 * Treatment had no matching source plate, so it uses the same compact 200×130
 * drafting vocabulary to resolve an uneven ledger into one recurring line.
 *
 * Geometry only. `Plate` supplies stroke, fill, width, and draw animation.
 */

export const COMPARE_PLATE_VIEWBOX = "0 0 200 130";

/**
 * 01 — the asset is put to work on the left while the capital reserve stays
 * intact on the right.
 *
 * The right half is the reference argument plate's own geometry, unchanged.
 * The left half is the wheeled crane from `reference/home-2.html`'s hero plate
 * — the same drawing, not an approximation of it — mirrored about its own
 * bounding box so the boom hangs toward the outside of the composition instead
 * of over the reserve, then scaled by 0.2 and set on this plate's ground line.
 * Every coordinate below is that transform applied to the reference numbers:
 * `x' = 127.4 - 0.2x`, `y' = 62.8 + 0.2y`.
 */
export function UpfrontCashPlate() {
  return (
    <>
      <path d="M14 118h172" />
      <path d="M103.4 118V96.4H82.6V118M103.4 96.4L89 84.8H66.6V96.4" />
      <path d="M66.6 84.8L13.8 64.4M13.8 64.4L10 72.8L17.6 76Z" />
      <path d="M89 84.8V76H52.2M52.2 76V84.8M77.4 76V68.4H29.4V76" />
      <circle cx="94.2" cy="108.8" r="6.6" />
      <circle cx="94.2" cy="108.8" r="2.4" />
      <circle cx="75.4" cy="108.8" r="6.6" />
      <circle cx="75.4" cy="108.8" r="2.4" />
      <path d="M120 118V44h48v74M120 66h48M120 88h48" />
      <circle cx="144" cy="30" r="13" />
      <path d="M144 17v-9M144 43v9M131 30h-9M157 30h9" />
    </>
  );
}

/** 02 — the asset moves through use and replacement without ownership risk. */
export function ObsolescencePlate() {
  return (
    <>
      <path d="M14 112h172" />
      <path d="M30 112V60h74v52M30 60l22-26h52v26" />
      <circle cx="52" cy="112" r="14" />
      <circle cx="86" cy="112" r="14" />
      <path d="M120 112V46h56v66M120 72h56M120 92h56" />
      <path d="M104 34h16M148 46V26" />
    </>
  );
}

/** 03 — irregular depreciation rules resolve into one recurring rental line. */
export function TaxTreatmentPlate() {
  return (
    <>
      <path d="M14 112h172" />
      <path d="M28 36h54M28 55h38M28 74h62M28 93h46" />
      <path d="M82 36c18 0 24 26 40 32M66 55c22 0 32 10 56 13M90 74c14 0 20-4 32-6M74 93c22 0 30-18 48-25" />
      <circle cx="122" cy="68" r="4" />
      <path d="M126 68h60M142 60v16M158 60v16M174 60v16" />
    </>
  );
}

/** 04 — a balanced structure preserves credit capacity. */
export function LeverageImpactPlate() {
  return (
    <>
      <path d="M100 20v92M60 112h80M46 60l54-40 54 40" />
      <path d="M24 60h44M132 60h44" />
      <path d="M24 60l-12 30h24zM176 60l-12 30h24z" />
      <path d="M12 90a12 12 0 0 0 24 0M164 90a12 12 0 0 0 24 0" />
    </>
  );
}
