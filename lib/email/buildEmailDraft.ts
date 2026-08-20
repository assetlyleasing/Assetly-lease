import { enquiryLabel } from "@/content/contact/enquiryTypes";
import type { ContactFormValues } from "@/lib/validation/contactForm";

export const CONTACT_RECIPIENT = "sankar@assetly.lease";

export type EmailDraft = {
  recipient: string;
  subject: string;
  body: string;
  gmailUrl: string;
  mailtoUrl: string;
};

const requirementPhrase: Record<ContactFormValues["enquiryType"], string> = {
  "operating-lease": "an operating lease requirement",
  "asset-requirement": "an asset requirement",
  "existing-requirement": "an existing requirement",
  "general-enquiry": "a general enquiry",
  custom: "a custom enquiry",
};

export function buildEmailDraft(values: ContactFormValues): EmailDraft {
  const label = enquiryLabel(
    values.enquiryType,
    values.enquiryType === "custom" ? values.customType : "",
  );
  const details: string[] = [];

  if (values.enquiryType === "operating-lease" || values.enquiryType === "asset-requirement") {
    details.push(`Asset / equipment: ${values.assetEquipment}`);
    if (values.approximateValue) {
      details.push(`Approx. asset value: ${values.approximateValue}`);
    }
  } else if (values.enquiryType === "existing-requirement") {
    if (values.reference) details.push(`Reference / short note: ${values.reference}`);
  } else {
    details.push(`Message: ${values.message}`);
  }

  const phrase =
    values.enquiryType === "custom"
      ? `a ${values.customType.trim()} enquiry`
      : requirementPhrase[values.enquiryType];
  const contact = values.phone
    ? `You can reach me at ${values.email} or ${values.phone}.`
    : `You can reach me at ${values.email}.`;
  const body = [
    "Hi Assetly,",
    "",
    `I'm ${values.name} from ${values.company} and I'm reaching out regarding ${phrase}.`,
    ...(details.length > 0 ? ["", ...details] : []),
    "",
    contact,
    "",
    "Regards,",
    values.name,
  ].join("\n");
  const subject = `${label} Enquiry — ${values.company}`;

  const gmail = new URL("https://mail.google.com/mail/");
  gmail.searchParams.set("view", "cm");
  gmail.searchParams.set("fs", "1");
  gmail.searchParams.set("to", CONTACT_RECIPIENT);
  gmail.searchParams.set("su", subject);
  gmail.searchParams.set("body", body);

  const mailto = `mailto:${CONTACT_RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return {
    recipient: CONTACT_RECIPIENT,
    subject,
    body,
    gmailUrl: gmail.toString(),
    mailtoUrl: mailto,
  };
}
