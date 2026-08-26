import type { Metadata } from "next";

import { LegalPageBody } from "@/components/legal/LegalPageBody";
import { PRIVACY_CONTENT } from "@/content/legal/privacy";

const DESCRIPTION =
  "How Assetly Leasing handles the information you share through this site.";

export const metadata: Metadata = {
  title: "Privacy Policy | Assetly",
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | Assetly",
    description: DESCRIPTION,
    type: "website",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return <LegalPageBody content={PRIVACY_CONTENT} />;
}
