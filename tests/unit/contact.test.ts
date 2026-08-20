import { describe, expect, it } from "vitest";

import { EMPTY_CONTACT_INPUT, type ContactDraftInput } from "@/content/contact/enquiryTypes";
import { buildEmailDraft, CONTACT_RECIPIENT } from "@/lib/email/buildEmailDraft";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation/contactForm";

const base: ContactDraftInput = {
  ...EMPTY_CONTACT_INPUT,
  enquiryType: "operating-lease",
  name: "Rahul Sharma",
  company: "ABC Manufacturing",
  email: "rahul@example.com",
  phone: "+91 90000 00000",
  assetEquipment: "CNC machinery",
  approximateValue: "₹80 lakh",
};

describe("contact validation", () => {
  it.each([
    { enquiryType: "operating-lease", assetEquipment: "CNC machinery" },
    { enquiryType: "asset-requirement", assetEquipment: "Server hardware" },
    { enquiryType: "existing-requirement", reference: "Existing quote reference" },
    { enquiryType: "general-enquiry", message: "Please share the next steps." },
    { enquiryType: "custom", customType: "Vendor enquiry", message: "A short note." },
  ] as const)("accepts the $enquiryType branch", (fields) => {
    const result = contactFormSchema.safeParse({ ...base, ...fields });
    expect(result.success).toBe(true);
  });

  it("requires only the conditional fields belonging to the selected type", () => {
    expect(contactFormSchema.safeParse({ ...base, assetEquipment: "" }).success).toBe(false);
    expect(
      contactFormSchema.safeParse({
        ...base,
        enquiryType: "general-enquiry",
        message: "",
      }).success,
    ).toBe(false);
    expect(
      contactFormSchema.safeParse({
        ...base,
        enquiryType: "existing-requirement",
        assetEquipment: "",
        reference: "",
      }).success,
    ).toBe(true);
  });

  it("enforces the approved field boundaries without country-specific phone rules", () => {
    expect(contactFormSchema.safeParse({ ...base, name: "AB" }).success).toBe(true);
    expect(contactFormSchema.safeParse({ ...base, name: "A".repeat(100) }).success).toBe(true);
    expect(contactFormSchema.safeParse({ ...base, name: "A".repeat(101) }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...base, company: "AB" }).success).toBe(true);
    expect(contactFormSchema.safeParse({ ...base, company: "C".repeat(150) }).success).toBe(true);
    expect(contactFormSchema.safeParse({ ...base, company: "C".repeat(151) }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...base, email: "not-an-email" }).success).toBe(false);
    const longestEmail = `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(61)}`;
    expect(longestEmail).toHaveLength(254);
    expect(contactFormSchema.safeParse({ ...base, email: longestEmail }).success).toBe(true);
    expect(contactFormSchema.safeParse({ ...base, email: `${longestEmail}e` }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...base, phone: "x".repeat(32) }).success).toBe(true);
    expect(contactFormSchema.safeParse({ ...base, phone: "x".repeat(33) }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...base, phone: "+44 (0)20 1234 5678" }).success).toBe(true);
    expect(contactFormSchema.safeParse({ ...base, assetEquipment: "x".repeat(200) }).success).toBe(true);
    expect(contactFormSchema.safeParse({ ...base, assetEquipment: "x".repeat(201) }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...base, approximateValue: "x".repeat(100) }).success).toBe(true);
    expect(contactFormSchema.safeParse({ ...base, approximateValue: "x".repeat(101) }).success).toBe(false);
    expect(
      contactFormSchema.safeParse({
        ...base,
        enquiryType: "existing-requirement",
        reference: "x".repeat(300),
      }).success,
    ).toBe(true);
    expect(
      contactFormSchema.safeParse({
        ...base,
        enquiryType: "existing-requirement",
        reference: "x".repeat(301),
      }).success,
    ).toBe(false);
    expect(
      contactFormSchema.safeParse({
        ...base,
        enquiryType: "custom",
        customType: "x".repeat(80),
        message: "x".repeat(600),
      }).success,
    ).toBe(true);
    expect(
      contactFormSchema.safeParse({
        ...base,
        enquiryType: "custom",
        customType: "x".repeat(81),
        message: "x".repeat(600),
      }).success,
    ).toBe(false);
    expect(
      contactFormSchema.safeParse({
        ...base,
        enquiryType: "general-enquiry",
        message: "x".repeat(600),
      }).success,
    ).toBe(true);
    expect(
      contactFormSchema.safeParse({
        ...base,
        enquiryType: "general-enquiry",
        message: "x".repeat(601),
      }).success,
    ).toBe(false);
  });
});

describe("buildEmailDraft", () => {
  it("builds the approved deterministic Operating Lease draft", () => {
    const values = contactFormSchema.parse(base) as ContactFormValues;
    const draft = buildEmailDraft(values);

    expect(draft.recipient).toBe(CONTACT_RECIPIENT);
    expect(draft.subject).toBe("Operating Lease Enquiry — ABC Manufacturing");
    expect(draft.body).toBe(
      [
        "Hi Assetly,",
        "",
        "I'm Rahul Sharma from ABC Manufacturing and I'm reaching out regarding an operating lease requirement.",
        "",
        "Asset / equipment: CNC machinery",
        "Approx. asset value: ₹80 lakh",
        "",
        "You can reach me at rahul@example.com or +91 90000 00000.",
        "",
        "Regards,",
        "Rahul Sharma",
      ].join("\n"),
    );
  });

  it("encodes identical subject and body data for Gmail and mailto", () => {
    const values = contactFormSchema.parse({
      ...base,
      enquiryType: "custom",
      customType: "R&D / café assets",
      message: "Need 20% more capacity & a flexible term.",
      phone: "",
    });
    const draft = buildEmailDraft(values);
    const gmail = new URL(draft.gmailUrl);
    const mailtoQuery = new URLSearchParams(draft.mailtoUrl.split("?")[1]);

    expect(gmail.origin).toBe("https://mail.google.com");
    expect(gmail.searchParams.get("to")).toBe(CONTACT_RECIPIENT);
    expect(gmail.searchParams.get("su")).toBe(draft.subject);
    expect(gmail.searchParams.get("body")).toBe(draft.body);
    expect(mailtoQuery.get("subject")).toBe(draft.subject);
    expect(mailtoQuery.get("body")).toBe(draft.body);
    expect(draft.body).not.toContain("undefined");
    expect(draft.body).not.toContain("or .");
  });
});
