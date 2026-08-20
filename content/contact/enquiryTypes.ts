export type EnquiryTypeId =
  | "operating-lease"
  | "asset-requirement"
  | "existing-requirement"
  | "general-enquiry";

export type EnquirySelection = EnquiryTypeId | "custom" | "";

export type EnquiryType = {
  id: EnquiryTypeId;
  index: "01" | "02" | "03" | "04";
  label: string;
};

export const ENQUIRY_TYPES: readonly EnquiryType[] = [
  { id: "operating-lease", index: "01", label: "Operating Lease" },
  { id: "asset-requirement", index: "02", label: "Asset Requirement" },
  { id: "existing-requirement", index: "03", label: "Existing Requirement" },
  { id: "general-enquiry", index: "04", label: "General Enquiry" },
] as const;

export type ContactDraftInput = {
  enquiryType: EnquirySelection;
  customType: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  assetEquipment: string;
  approximateValue: string;
  reference: string;
  message: string;
};

export const EMPTY_CONTACT_INPUT: ContactDraftInput = {
  enquiryType: "",
  customType: "",
  name: "",
  company: "",
  email: "",
  phone: "",
  assetEquipment: "",
  approximateValue: "",
  reference: "",
  message: "",
};

export function enquiryLabel(selection: Exclude<EnquirySelection, "">, customType = "") {
  if (selection === "custom") return customType.trim();
  return ENQUIRY_TYPES.find((entry) => entry.id === selection)?.label ?? "";
}
