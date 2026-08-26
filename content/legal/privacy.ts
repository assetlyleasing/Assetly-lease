/**
 * Privacy Policy copy (SOURCE_OF_TRUTH.md §23).
 *
 * Generic, non-fabricated placeholder pending real legal text (OD-09) — do not
 * extend this with a claim (data-processor names, retention periods, specific
 * regulations) that hasn't actually been confirmed. The only facts referenced
 * here (entity name, Bengaluru office, contact email) are already established
 * in content/site/navigation.ts.
 */

export type LegalContent = {
  eyebrow: string;
  heading: string;
  updated: string;
  paragraphs: readonly string[];
};

export const PRIVACY_CONTENT: LegalContent = {
  eyebrow: "Privacy Policy",
  heading: "Privacy Policy",
  updated: "This is a general placeholder pending final legal review — it will be replaced with Assetly Leasing's complete privacy terms in due course.",
  paragraphs: [
    "Assetly Leasing (\"Assetly\", \"we\", \"us\") respects your privacy. This page describes, in general terms, how information reaches us through this site while the full policy is finalised.",
    "When you use the Contact form, we collect what you provide — your name, email address, phone number, and the details of your enquiry — solely to respond to you and discuss the leasing services you've asked about.",
    "We do not sell your information to third parties. This site does not currently use analytics or advertising cookies, so no behavioural tracking data is collected as you browse.",
    "We take reasonable measures to protect the information you share with us. If you have questions about this policy or how your information is handled, contact us at finance@assetly.lease.",
    "Assetly is based in Bengaluru, and this placeholder policy will be updated once final legal wording is confirmed.",
  ],
};
