import { CompareSection } from "@/components/compare/CompareSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { HeroOpening } from "@/components/hero/HeroOpening";
import { SectorsSection } from "@/components/sectors/SectorsSection";
import { WhyUsSection } from "@/components/why-us/WhyUsSection";

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
