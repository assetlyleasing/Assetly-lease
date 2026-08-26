import type { Metadata } from "next";

import { CompareSection } from "@/components/compare/CompareSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { HeroOpening } from "@/components/hero/HeroOpening";
import { SectorsSection } from "@/components/sectors/SectorsSection";
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
 * Homepage.
 *
 * The homepage now contains every unblocked narrative section. Trusted By is
 * inserted later when its Firebase/admin decisions are resolved.
 */
export default function HomePage() {
  return (
    <main>
      <HeroOpening />
      <CompareSection />
      <WhyUsSection />
      <SectorsSection />
      <ContactSection />
    </main>
  );
}
