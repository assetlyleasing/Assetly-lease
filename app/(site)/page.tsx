import { CompareSection } from "@/components/compare/CompareSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { Hero } from "@/components/hero/Hero";
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
      <Hero />
      <CompareSection />
      <WhyUsSection />
      <SectorsSection />
      <ContactSection />
    </main>
  );
}
