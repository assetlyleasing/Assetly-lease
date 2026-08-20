"use client";

import { useId, useState, type Dispatch, type MouseEvent, type SetStateAction } from "react";

import {
  ENQUIRY_TYPES,
  type ContactDraftInput,
  type EnquirySelection,
} from "@/content/contact/enquiryTypes";
import { buildEmailDraft } from "@/lib/email/buildEmailDraft";
import {
  contactFieldErrors,
  contactFormSchema,
  type ContactFieldErrors,
} from "@/lib/validation/contactForm";

import styles from "./Contact.module.css";

export type EnquiryStep = "type" | "details";

type FlowProps = {
  input: ContactDraftInput;
  setInput: Dispatch<SetStateAction<ContactDraftInput>>;
  step: EnquiryStep;
  setStep: Dispatch<SetStateAction<EnquiryStep>>;
};

function UnderlineField({
  field,
  label,
  value,
  error,
  onChange,
  type = "text",
  required = false,
  multiline = false,
  maxLength,
}: {
  field: keyof ContactDraftInput;
  label: string;
  value: string;
  error?: string;
  onChange: (field: keyof ContactDraftInput, value: string) => void;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  maxLength: number;
}) {
  const id = `contact-${field}`;
  const errorId = `${id}-error`;
  const shared = {
    id,
    name: field,
    value,
    maxLength,
    required,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? errorId : undefined,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(field, event.target.value),
  };

  return (
    <div className={styles.field} data-invalid={error ? "true" : "false"}>
      <label htmlFor={id}>{label}</label>
      {multiline ? <textarea {...shared} rows={3} /> : <input {...shared} type={type} />}
      {error && (
        <span id={errorId} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
}

export function EnquiryFlow({ input, setInput, step, setStep }: FlowProps) {
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const statusId = useId();
  const parsed = contactFormSchema.safeParse(input);
  const draft = parsed.success ? buildEmailDraft(parsed.data) : null;

  const updateField = (field: keyof ContactDraftInput, value: string) => {
    setInput((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const selectType = (selection: Exclude<EnquirySelection, "">) => {
    updateField("enquiryType", selection);
  };

  const continueToDetails = () => {
    if (!input.enquiryType) {
      setErrors({ enquiryType: "Choose an enquiry type." });
      return;
    }
    if (input.enquiryType === "custom" && !input.customType.trim()) {
      setErrors({ customType: "Name the enquiry type." });
      document.getElementById("contact-customType")?.focus();
      return;
    }
    setErrors({});
    setStep("details");
    requestAnimationFrame(() => document.getElementById("contact-name")?.focus());
  };

  const validateLink = (event: MouseEvent<HTMLAnchorElement>) => {
    if (parsed.success) return;
    event.preventDefault();
    const nextErrors = contactFieldErrors(parsed.error);
    setErrors(nextErrors);
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('#contact-panel [aria-invalid="true"]')?.focus();
    });
  };

  if (step === "type") {
    return (
      <div className={styles.flow} data-contact-step="type">
        <div className={styles.stepHead}>
          <span>Step 1 / 2</span>
          <h3>What can we help with?</h3>
        </div>

        <div className={styles.typeList}>
          {ENQUIRY_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              className={styles.typeRow}
              aria-pressed={input.enquiryType === type.id}
              onClick={() => selectType(type.id)}
            >
              <span>{type.index}</span>
              {type.label}
            </button>
          ))}

          <button
            type="button"
            className={styles.typeRow}
            aria-pressed={input.enquiryType === "custom"}
            onClick={() => selectType("custom")}
          >
            <span>05</span>
            Something else…
          </button>

          {input.enquiryType === "custom" && (
            <UnderlineField
              field="customType"
              label="Enquiry type"
              value={input.customType}
              error={errors.customType}
              onChange={updateField}
              maxLength={80}
              required
            />
          )}
        </div>

        {errors.enquiryType && <p className={styles.error}>{errors.enquiryType}</p>}
        <button type="button" className={styles.primaryAction} onClick={continueToDetails}>
          Continue <span aria-hidden="true">→</span>
        </button>
      </div>
    );
  }

  const needsAsset =
    input.enquiryType === "operating-lease" || input.enquiryType === "asset-requirement";
  const needsReference = input.enquiryType === "existing-requirement";
  const needsMessage =
    input.enquiryType === "general-enquiry" || input.enquiryType === "custom";

  return (
    <form className={styles.flow} data-contact-step="details" onSubmit={(event) => event.preventDefault()}>
      <div className={styles.stepHead}>
        <span>Step 2 / 2</span>
        <h3>Your details</h3>
      </div>

      <div className={styles.fields}>
        <UnderlineField field="name" label="Your name" value={input.name} error={errors.name} onChange={updateField} maxLength={100} required />
        <UnderlineField field="company" label="Company" value={input.company} error={errors.company} onChange={updateField} maxLength={150} required />
        <UnderlineField field="email" label="Email" value={input.email} error={errors.email} onChange={updateField} maxLength={254} type="email" required />
        <UnderlineField field="phone" label="Phone (optional)" value={input.phone} error={errors.phone} onChange={updateField} maxLength={32} type="tel" />

        {needsAsset && (
          <>
            <UnderlineField field="assetEquipment" label="Asset / equipment" value={input.assetEquipment} error={errors.assetEquipment} onChange={updateField} maxLength={200} required />
            <UnderlineField field="approximateValue" label="Approx. asset value (optional)" value={input.approximateValue} error={errors.approximateValue} onChange={updateField} maxLength={100} />
          </>
        )}

        {needsReference && (
          <UnderlineField field="reference" label="Reference / short note (optional)" value={input.reference} error={errors.reference} onChange={updateField} maxLength={300} multiline />
        )}

        {needsMessage && (
          <UnderlineField field="message" label="Message" value={input.message} error={errors.message} onChange={updateField} maxLength={600} multiline required />
        )}
      </div>

      <p id={statusId} className="sr-only" aria-live="polite">
        {Object.values(errors).find(Boolean) ?? ""}
      </p>

      <div className={styles.flowActions}>
        <button
          type="button"
          className={styles.backAction}
          onClick={() => {
            setErrors({});
            setStep("type");
            requestAnimationFrame(() =>
              document.querySelector<HTMLElement>('#contact-panel button[aria-pressed="true"]')?.focus(),
            );
          }}
        >
          <span aria-hidden="true">←</span> Back
        </button>
        <a
          className={styles.primaryAction}
          href={draft?.gmailUrl ?? "#contact-panel"}
          target={draft ? "_blank" : undefined}
          rel={draft ? "noopener noreferrer" : undefined}
          onClick={validateLink}
          data-gmail-action
        >
          Open in Gmail <span aria-hidden="true">→</span>
        </a>
        <a
          className={styles.mailtoAction}
          href={draft?.mailtoUrl ?? "#contact-panel"}
          onClick={validateLink}
          data-mailto-action
        >
          Use another email app
        </a>
      </div>
    </form>
  );
}
