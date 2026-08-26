import type { Metadata } from "next";

import { LegalPageBody } from "@/components/legal/LegalPageBody";
import { TERMS_CONTENT } from "@/content/legal/terms";

const DESCRIPTION = "The terms that govern use of the Assetly Leasing website.";

export const metadata: Metadata = {
  title: "Terms of Use | Assetly",
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use | Assetly",
    description: DESCRIPTION,
    type: "website",
    url: "/terms",
  },
};

export default function TermsPage() {
  return <LegalPageBody content={TERMS_CONTENT} />;
}
