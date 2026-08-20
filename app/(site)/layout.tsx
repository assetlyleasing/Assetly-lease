import type { ReactNode } from "react";

import { Footer } from "@/components/footer/Footer";
import { Nav } from "@/components/nav/Nav";

/**
 * Shell for the public site.
 *
 * Scoped to the `(site)` route group so `/admin` does not inherit it — the
 * admin panel is a deliberately small utilitarian surface (§18), not part of
 * the public narrative.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
