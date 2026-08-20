import { act, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SectorPlate, SECTOR_PLATE_VIEWBOX } from "@/content/plates/sector-plates";
import { SECTORS } from "@/content/sectors/sectors";
import {
  advanceSectorRotation,
  createSectorRotationState,
} from "@/lib/motion/sectorRotation";
import { useOneOutOneIn } from "@/lib/motion/useOneOutOneIn";

afterEach(() => {
  vi.useRealTimers();
});

describe("sector content and plates", () => {
  it("locks the approved six-sector copy", () => {
    expect(SECTORS.map(({ index, name, descriptor }) => ({ index, name, descriptor }))).toEqual([
      { index: "01", name: "Commercial Interiors", descriptor: "Workplace, fit-out and interior assets." },
      { index: "02", name: "Manufacturing", descriptor: "Production, automation and industrial assets." },
      { index: "03", name: "Construction", descriptor: "Plant, machinery and specialist assets." },
      { index: "04", name: "Hospitality", descriptor: "Rooms, kitchens and operating infrastructure." },
      { index: "05", name: "Healthcare", descriptor: "Clinical, diagnostic and facility assets." },
      {
        index: "06",
        name: "IT Equipment & IT Infrastructure",
        descriptor: "Servers, hardware and network infrastructure.",
      },
    ]);
  });

  it("renders six distinct geometries in one 200 by 130 drafting system", () => {
    const plates = SECTORS.map((sector) =>
      renderToStaticMarkup(<SectorPlate plateId={sector.plateId} drawn />),
    );

    expect(new Set(plates).size).toBe(6);
    for (const plate of plates) {
      expect(plate).toContain(`viewBox="${SECTOR_PLATE_VIEWBOX}"`);
      expect(plate).toContain('aria-hidden="true"');
    }
  });
});

describe("sector rotation state", () => {
  it("replaces one slot at a time in a deterministic cycle", () => {
    let state = createSectorRotationState(6, 4);
    expect(state.visibleIndices).toEqual([0, 1, 2, 3]);

    state = advanceSectorRotation(state, 6);
    expect(state.visibleIndices).toEqual([4, 1, 2, 3]);
    expect(state.nextSlotIndex).toBe(1);

    state = advanceSectorRotation(state, 6);
    expect(state.visibleIndices).toEqual([4, 5, 2, 3]);

    state = advanceSectorRotation(state, 6);
    expect(state.visibleIndices).toEqual([4, 5, 0, 3]);
  });

  it("rejects impossible pool and slot counts", () => {
    expect(() => createSectorRotationState(3, 4)).toThrow(RangeError);
    expect(() => createSectorRotationState(0, 0)).toThrow(RangeError);
  });
});

function RotationHarness({
  paused = false,
  disabled = false,
}: {
  paused?: boolean;
  disabled?: boolean;
}) {
  const { visibleIndices, swappingSlot } = useOneOutOneIn({
    itemCount: 6,
    visibleCount: 4,
    entered: true,
    paused,
    disabled,
    initialDelayMs: 100,
    intervalMs: 100,
    swapMs: 50,
  });

  return (
    <output data-visible={visibleIndices.join(",")} data-swapping={swappingSlot ?? "none"} />
  );
}

describe("useOneOutOneIn", () => {
  it("fades one slot before replacing it", () => {
    vi.useFakeTimers();
    const { container } = render(<RotationHarness />);
    const output = container.querySelector("output")!;

    act(() => vi.advanceTimersByTime(100));
    expect(output.dataset.swapping).toBe("0");
    expect(output.dataset.visible).toBe("0,1,2,3");

    act(() => vi.advanceTimersByTime(50));
    expect(output.dataset.swapping).toBe("none");
    expect(output.dataset.visible).toBe("4,1,2,3");
  });

  it("pauses before a new swap and resumes on the next cycle", () => {
    vi.useFakeTimers();
    const { container, rerender } = render(<RotationHarness paused />);
    const output = container.querySelector("output")!;

    act(() => vi.advanceTimersByTime(100));
    expect(output.dataset.swapping).toBe("none");

    rerender(<RotationHarness paused={false} />);
    act(() => vi.advanceTimersByTime(100));
    expect(output.dataset.swapping).toBe("0");
  });

  it("suppresses timers when disabled and cleans them up on unmount", () => {
    vi.useFakeTimers();
    const disabled = render(<RotationHarness disabled />);
    expect(vi.getTimerCount()).toBe(0);
    expect(disabled.container.querySelector("output")!.dataset.visible).toBe("0,1,2,3");
    disabled.unmount();

    const active = render(<RotationHarness />);
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    active.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
