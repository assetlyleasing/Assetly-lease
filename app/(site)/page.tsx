import type { Metadata } from "next";

import { CompareSection } from "@/components/compare/CompareSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { HeroOpening } from "@/components/hero/HeroOpening";
import { SectorsSection } from "@/components/sectors/SectorsSection";
import { TrustedBy } from "@/components/trusted-by/TrustedBy";
import { WhyUsSection } from "@/components/why-us/WhyUsSection";

const DESCRIPTION = "Structured operating leases for growing businesses.";

export const metadata: Metadata = {
  title: "Assetly | Access. Scale. Grow.",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Assetly | Access. Scale. Grow.",
    description: DESCRIPTION,
    type: "website",
    url: "/",
  },
};

/**
 * Homepage. §3's fixed section order — Trusted By renders nothing of its own
 * accord (§12) when disabled or empty, so it's always mounted here rather
 * than conditionally included.
 */
export default function HomePage() {
  return (
    <main>
      <HeroOpening />
      <TrustedBy />
      <CompareSection />
      <WhyUsSection />
      <SectorsSection />
      <ContactSection />
    </main>
  );
}
