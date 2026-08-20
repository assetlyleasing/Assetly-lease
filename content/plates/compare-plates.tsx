/**
 * Compare plates — one per argument slide (SOURCE_OF_TRUTH.md §13, OD-03).
 *
 * §5's standing rule applies: a plate represents something real about its
 * section, never decorates it. §13 names the subject of each of the four
 * plates, and separately gives a vocabulary for the three financing options —
 * Lease as a flexible modular/open framework, Loan as a constrained layered
 * stack, Purchase as a solid closed block. The four subjects are drawn here;
 * that vocabulary supplies the forms, and slide 04 uses all three of them side
 * by side, which is what its subject ("progressively heavier balance-sheet
 * structure") actually is.
 *
 * All four share the hero plate's drafting conventions — a ground datum and a
 * left-hand drawing edge — so the set reads as one continuous technical
 * drawing. §11's Stage 3 allows a portion of the hero's geometry to carry into
 * the first Compare plate: slide 01 opens with the same datum, the same left
 * edge, and the same open modular frame the hero used for "Access".
 *
 * Geometry only. `Plate` supplies stroke, fill, width and the draw animation.
 *
 * Authored in-house rather than supplied by a designer, exactly as the hero
 * plate was, so `OD-03` stays open pending design review — see `PROGRESS.md`.
 */

/** Shared by all four, so the plates are a set and scale identically. */
export const COMPARE_PLATE_VIEWBOX = "0 0 400 300";

/** The datum and drawing edge every plate in the set stands on. */
function DrawingFrame() {
  return (
    <>
      <line x1="30" y1="250" x2="378" y2="250" />
      <line x1="30" y1="58" x2="30" y2="250" />
    </>
  );
}

/**
 * 01 Upfront Cash — retained capital, a small portion accessed while a larger
 * reserve stays intact.
 *
 * The tall open frame is the reserve, with its retained level ruled across it.
 * A single line leaves its flank and resolves into the small block on the
 * right: the portion actually put to work. The dimension run under that block
 * measures the small figure, not the large one.
 */
export function UpfrontCashPlate() {
  return (
    <>
      <DrawingFrame />

      {/* The reserve: the same open modular frame the hero used for Access. */}
      <path d="M62 250 L62 104 L232 104 L232 250" />
      <line x1="50" y1="104" x2="244" y2="104" />
      {/* The level that stays intact. */}
      <line x1="62" y1="150" x2="232" y2="150" />

      {/* The portion drawn out, and where it goes. */}
      <path d="M232 178 C 258 178, 268 206, 292 206" />
      <path d="M292 250 L292 206 L358 206 L358 250" />

      {/* Dimension run — the small figure being accessed, not the reserve. */}
      <line x1="292" y1="250" x2="292" y2="284" />
      <line x1="358" y1="250" x2="358" y2="284" />
      <line x1="292" y1="272" x2="358" y2="272" />

      <circle cx="232" cy="178" r="4" />
      <circle cx="292" cy="206" r="4" />
    </>
  );
}

/**
 * 02 Risk of Obsolescence — the asset lifecycle: use, ageing, replacement.
 *
 * Three frames on the datum. The first stands full height, the second has sunk
 * and its top edge has gone slack, and the third is new and taller again. The
 * long arc overhead is the replacement, carrying from the first asset to its
 * successor — the movement that somebody has to underwrite.
 */
export function ObsolescencePlate() {
  return (
    <>
      <DrawingFrame />

      {/* Use — the asset in service, drawn square. */}
      <path d="M58 250 L58 132 L146 132 L146 250" />
      <line x1="58" y1="192" x2="146" y2="192" />

      {/* Ageing — lower, and the top edge no longer runs true. */}
      <path d="M176 250 L176 168 L264 168 L264 250" />
      <polyline points="176,168 200,180 226,166 248,178 264,168" />

      {/* Replacement — the successor, new and taller. */}
      <path d="M294 250 L294 118 L382 118 L382 250" />
      <line x1="294" y1="184" x2="382" y2="184" />

      {/* The lifecycle carried overhead from the first asset to the last. */}
      <path d="M102 112 C 160 56, 300 56, 338 98" />

      <circle cx="102" cy="112" r="4" />
      <circle cx="338" cy="98" r="4" />
    </>
  );
}

/**
 * 03 Tax Treatment — a ledger-style drawing resolving into one recurring line.
 *
 * On the left, a schedule of unequal rules: the blocks, rates and part-year
 * fractions of a depreciation claim. They converge on a single node, and out of
 * it runs one clean line ticked at even intervals — the rental, deducted as it
 * is paid.
 */
export function TaxTreatmentPlate() {
  return (
    <>
      <DrawingFrame />

      {/* The schedule: unequal rules, none of them the same length. */}
      <line x1="52" y1="112" x2="150" y2="112" />
      <line x1="52" y1="146" x2="122" y2="146" />
      <line x1="52" y1="180" x2="164" y2="180" />
      <line x1="52" y1="214" x2="134" y2="214" />

      {/* Converging on one point. */}
      <path d="M150 112 C 186 112, 194 152, 214 163" />
      <path d="M122 146 C 164 146, 180 158, 214 163" />
      <path d="M164 180 C 190 180, 198 170, 214 163" />
      <path d="M134 214 C 176 214, 190 178, 214 163" />

      {/* One recurring line, ruled at even intervals. */}
      <line x1="214" y1="163" x2="380" y2="163" />
      <line x1="248" y1="153" x2="248" y2="173" />
      <line x1="282" y1="153" x2="282" y2="173" />
      <line x1="316" y1="153" x2="316" y2="173" />
      <line x1="350" y1="153" x2="350" y2="173" />

      <circle cx="214" cy="163" r="4" />
    </>
  );
}

/**
 * 04 Leverage Impact — a progressively heavier balance-sheet structure.
 *
 * §13's three forms in order, left to right, each heavier than the last: the
 * open framework that rests on the sheet, the layered stack that presses into
 * it, and the closed hatched block that sits on it whole. The datum thickens
 * beneath them in step, which is the only place in the set where the drawing's
 * own baseline carries the argument.
 */
export function LeverageImpactPlate() {
  return (
    <>
      <DrawingFrame />

      {/* Light — an open framework, no closed sides. */}
      <line x1="60" y1="250" x2="60" y2="146" />
      <line x1="140" y1="250" x2="140" y2="146" />
      <line x1="48" y1="146" x2="152" y2="146" />

      {/* Heavier — a constrained stack, courses pressing down on each other. */}
      <path d="M186 250 L186 130 L266 130 L266 250 Z" />
      <line x1="186" y1="170" x2="266" y2="170" />
      <line x1="186" y1="210" x2="266" y2="210" />

      {/* Heaviest — a solid closed block. */}
      <path d="M306 250 L306 114 L382 114 L382 250 Z" />
      <line x1="306" y1="174" x2="366" y2="114" />
      <line x1="306" y1="226" x2="382" y2="150" />
      <line x1="330" y1="250" x2="382" y2="198" />
      <line x1="368" y1="250" x2="382" y2="236" />

      {/* The sheet bearing more at each step. */}
      <line x1="186" y1="258" x2="266" y2="258" />
      <line x1="306" y1="258" x2="382" y2="258" />
      <line x1="306" y1="264" x2="382" y2="264" />
    </>
  );
}
