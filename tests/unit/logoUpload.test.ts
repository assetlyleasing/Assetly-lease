import { describe, expect, it } from "vitest";

import {
  MAX_LOGO_BYTES,
  defaultAltFromName,
  logoUploadFieldErrors,
  logoUploadSchema,
} from "@/lib/validation/logoUpload";

function makeFile(options: { type: string; sizeBytes: number; name?: string }): File {
  const bytes = new Uint8Array(options.sizeBytes);
  return new File([bytes], options.name ?? "logo.png", { type: options.type });
}

const validFile = makeFile({ type: "image/png", sizeBytes: 1024 });

describe("logoUploadSchema", () => {
  it("accepts a valid SVG, PNG, or WebP file within the size limit", () => {
    for (const type of ["image/svg+xml", "image/png", "image/webp"] as const) {
      const result = logoUploadSchema.safeParse({
        name: "Acme Corp",
        alt: "Acme Corp logo",
        file: makeFile({ type, sizeBytes: 1024 }),
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects an unsupported file type", () => {
    const result = logoUploadSchema.safeParse({
      name: "Acme Corp",
      alt: "Acme Corp logo",
      file: makeFile({ type: "image/jpeg", sizeBytes: 1024 }),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a file over 2MB and accepts one at exactly the limit", () => {
    expect(
      logoUploadSchema.safeParse({
        name: "Acme Corp",
        alt: "Acme Corp logo",
        file: makeFile({ type: "image/png", sizeBytes: MAX_LOGO_BYTES }),
      }).success,
    ).toBe(true);
    expect(
      logoUploadSchema.safeParse({
        name: "Acme Corp",
        alt: "Acme Corp logo",
        file: makeFile({ type: "image/png", sizeBytes: MAX_LOGO_BYTES + 1 }),
      }).success,
    ).toBe(false);
  });

  it("rejects an empty file", () => {
    const result = logoUploadSchema.safeParse({
      name: "Acme Corp",
      alt: "Acme Corp logo",
      file: makeFile({ type: "image/png", sizeBytes: 0 }),
    });
    expect(result.success).toBe(false);
  });

  it("requires a non-empty name and alt text within their limits", () => {
    expect(
      logoUploadSchema.safeParse({ name: "", alt: "Alt", file: validFile }).success,
    ).toBe(false);
    expect(
      logoUploadSchema.safeParse({ name: "Acme", alt: "", file: validFile }).success,
    ).toBe(false);
    expect(
      logoUploadSchema.safeParse({ name: "A".repeat(150), alt: "Alt", file: validFile })
        .success,
    ).toBe(true);
    expect(
      logoUploadSchema.safeParse({ name: "A".repeat(151), alt: "Alt", file: validFile })
        .success,
    ).toBe(false);
  });

  it("maps issues to the correct field via logoUploadFieldErrors", () => {
    const result = logoUploadSchema.safeParse({
      name: "",
      alt: "",
      file: makeFile({ type: "image/jpeg", sizeBytes: 1024 }),
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    const errors = logoUploadFieldErrors(result.error);
    expect(errors.name).toBeTruthy();
    expect(errors.alt).toBeTruthy();
    expect(errors.file).toBeTruthy();
  });
});

describe("defaultAltFromName", () => {
  it("appends 'logo' to a trimmed name", () => {
    expect(defaultAltFromName("  Acme Corp  ")).toBe("Acme Corp logo");
  });

  it("returns an empty string for an empty/whitespace-only name", () => {
    expect(defaultAltFromName("   ")).toBe("");
    expect(defaultAltFromName("")).toBe("");
  });
});
