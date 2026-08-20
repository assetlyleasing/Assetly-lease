import Link from "next/link";

import { LogoMark } from "@/components/brand/LogoMark";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { RevealOnScroll } from "@/components/primitives/RevealOnScroll";
import { SiteLinkAnchor } from "@/components/primitives/SiteLinkAnchor";
import {
  BRAND,
  CONTACT,
  FOOTER_GROUPS,
  LEGAL_LINKS,
  OFFICE_ADDRESS,
} from "@/content/site/navigation";

import styles from "./Footer.module.css";

/**
 * Site footer, §17. The quiet conclusion of the site: no plate animation, and
 * the only place on the site where the full postal address appears (§16
 * excludes it from the Contact section).
 */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <RevealOnScroll className={styles.zones}>
          {/* Zone 1 — brand */}
          <div className={`${styles.brand} rv-u`}>
            <Link href="/" className={styles.wordmark}>
              <LogoMark className={styles.mark} />
              {BRAND.footerWordmark}
            </Link>
            <p className={styles.tagline}>{BRAND.tagline}</p>
          </div>

          {/* Zone 2 — navigation */}
          <div className={`${styles.navGroups} rv-u rv-d1`}>
            {FOOTER_GROUPS.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <Eyebrow as="h2" onDark className={styles.groupHeading}>
                  {group.heading}
                </Eyebrow>
                <div className={styles.groupList}>
                  {group.links.map((link) => (
                    <SiteLinkAnchor
                      key={link.label}
                      link={link}
                      className={styles.link}
                    />
                  ))}
                </div>
              </nav>
            ))}
          </div>

          {/* Zone 3 — official information */}
          <div className={`${styles.info} rv-u rv-d2`}>
            <div>
              <Eyebrow as="h2" onDark className={styles.infoHeading}>
                Contact
              </Eyebrow>
              <p className={styles.infoBody}>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className={styles.infoLink}
                >
                  {CONTACT.email}
                </a>
                <br />
                <a
                  href={`tel:${CONTACT.telHref}`}
                  className={styles.infoLink}
                >
                  {CONTACT.phone}
                </a>
              </p>
            </div>

            <div>
              <Eyebrow as="h2" onDark className={styles.infoHeading}>
                Office
              </Eyebrow>
              <address className={styles.infoBody}>
                {OFFICE_ADDRESS.map((line) => (
                  <span key={line} className={styles.addressLine}>
                    {line}
                  </span>
                ))}
              </address>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className={styles.legal}>
          <Eyebrow onDark className="rv-u">
            © {new Date().getFullYear()} Assetly Leasing
          </Eyebrow>

          {/*
           * §17 reserves Privacy Policy and Terms of Use. They are labels until
           * Phase 9 builds the routes — an anchor to a page that 404s is worse
           * than no anchor. LEGAL-002 turns these into links.
           */}
          <div className={styles.legalLinks}>
            {LEGAL_LINKS.map((item) => (
              <Eyebrow key={item.label} onDark className="rv-u rv-d1">
                {item.label}
              </Eyebrow>
            ))}
          </div>
        </RevealOnScroll>
      </Container>
    </footer>
  );
}
