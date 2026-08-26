/**
 * Trusted By logo upload validation (§18: SVG/PNG/WebP, ~2MB, name + alt).
 */

import { z } from "zod";

export const ACCEPTED_LOGO_TYPES = ["image/svg+xml", "image/png", "image/webp"] as const;
export const MAX_LOGO_BYTES = 2 * 1024 * 1024;

export const logoNameSchema = z
  .string()
  .trim()
  .min(1, "Enter a company or organization name.")
  .max(150);

export const logoAltSchema = z.string().trim().min(1, "Enter alt text.").max(200);

export const logoFileSchema = z
  .instanceof(File, { message: "Choose a logo file." })
  .refine((file) => (ACCEPTED_LOGO_TYPES as readonly string[]).includes(file.type), {
    message: "Upload an SVG, PNG, or WebP file.",
  })
  .refine((file) => file.size > 0, { message: "The file is empty." })
  .refine((file) => file.size <= MAX_LOGO_BYTES, {
    message: "File must be 2MB or smaller.",
  });

export const logoUploadSchema = z.object({
  name: logoNameSchema,
  alt: logoAltSchema,
  file: logoFileSchema,
});

export type LogoUploadValues = z.infer<typeof logoUploadSchema>;

/** The editable alt-text default §18 asks for: auto-generated from the name. */
export function defaultAltFromName(name: string): string {
  const trimmed = name.trim();
  return trimmed ? `${trimmed} logo` : "";
}

export type LogoUploadFieldErrors = Partial<Record<"name" | "alt" | "file", string>>;

export function logoUploadFieldErrors(error: z.ZodError): LogoUploadFieldErrors {
  const errors: LogoUploadFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      (field === "name" || field === "alt" || field === "file") &&
      errors[field] === undefined
    ) {
      errors[field] = issue.message;
    }
  }
  return errors;
}
