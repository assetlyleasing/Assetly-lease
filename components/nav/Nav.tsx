"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LogoMark } from "@/components/brand/LogoMark";
import { MobileMenu } from "@/components/nav/MobileMenu";
import { SiteLinkAnchor } from "@/components/primitives/SiteLinkAnchor";
import { BRAND, NAV_LINKS } from "@/content/site/navigation";
import { scrollToSection } from "@/lib/scroll";
import "@/lib/motion/homeOpeningReplay";

import styles from "./Nav.module.css";

/** Scroll distance past which the nav condenses into its dark pill (§10). */
const SOLID_AFTER_PX = 24;

export function Nav() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  /*
   * Owned here rather than inside MobileMenu because the brand has to stay
   * legible above the open overlay, which means the header needs to know.
   */
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setSolid(window.scrollY > SOLID_AFTER_PX);
    };

    // Coalesce to one read per frame; scroll fires far more often than the
    // single boolean this derives can change.
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  /*
   * §10: the mark and wordmark are one clickable unit that returns to the Hero.
   * On the homepage that is a scroll; from /about it is a navigation, so the
   * element stays a real link to "/" and only the same-page case is intercepted.
   */
  const onBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (scrollToSection("hero")) event.preventDefault();
  };

  return (
    <header
      className={styles.header}
      data-solid={solid}
      data-menu-open={menuOpen}
    >
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} onClick={onBrandClick}>
          <LogoMark className={styles.mark} />
          <span>{BRAND.navWordmark}</span>
        </Link>

        <nav className={styles.links} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <SiteLinkAnchor
              key={link.label}
              link={link}
              className={styles.link}
            />
          ))}
        </nav>

        <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
      </div>
    </header>
  );
}
