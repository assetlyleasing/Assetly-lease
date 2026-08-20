import { z } from "zod";

import type { ContactDraftInput } from "@/content/contact/enquiryTypes";

const requiredName = z.string().trim().min(2, "Enter at least 2 characters.").max(100);
const requiredCompany = z.string().trim().min(2, "Enter at least 2 characters.").max(150);
const requiredEmail = z.string().trim().max(254).email("Enter a valid email address.");

function optionalText(max: number) {
  return z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(max).optional(),
  );
}

const base = {
  name: requiredName,
  company: requiredCompany,
  email: requiredEmail,
  phone: optionalText(32),
};

const assetFields = {
  assetEquipment: z.string().trim().min(1, "Describe the asset or equipment.").max(200),
  approximateValue: optionalText(100),
};

export const contactFormSchema = z.discriminatedUnion("enquiryType", [
  z.object({ enquiryType: z.literal("operating-lease"), ...base, ...assetFields }),
  z.object({ enquiryType: z.literal("asset-requirement"), ...base, ...assetFields }),
  z.object({
    enquiryType: z.literal("existing-requirement"),
    ...base,
    reference: optionalText(300),
  }),
  z.object({
    enquiryType: z.literal("general-enquiry"),
    ...base,
    message: z.string().trim().min(1, "Enter a short message.").max(600),
  }),
  z.object({
    enquiryType: z.literal("custom"),
    customType: z.string().trim().min(1, "Name the enquiry type.").max(80),
    ...base,
    message: z.string().trim().min(1, "Enter a short message.").max(600),
  }),
]);

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export type ContactFieldErrors = Partial<Record<keyof ContactDraftInput, string>>;

export function contactFieldErrors(error: z.ZodError): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && errors[field as keyof ContactFieldErrors] === undefined) {
      errors[field as keyof ContactFieldErrors] = issue.message;
    }
  }
  return errors;
}
