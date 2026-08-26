import type { TrustedLogo } from "@/lib/firebase/firestore";

import styles from "./TrustedBy.module.css";

/**
 * §12: continuous horizontal flow via a duplicated sequence and
 * `translateX(0) → translateX(-50%)`. If there aren't enough logos to fill a
 * wide viewport, the real collection repeats until there are — those extra
 * repeats, like the whole second pass that makes the loop seamless, are
 * hidden from screen readers so a logo is never announced more than once.
 */
const MIN_TRACK_ITEMS = 8;

function repeatToFill(logos: readonly TrustedLogo[], minCount: number): TrustedLogo[] {
  if (logos.length === 0) return [];
  const repeats = Math.max(1, Math.ceil(minCount / logos.length));
  return Array.from({ length: repeats }, () => logos).flat();
}

export function LogoMarquee({ logos }: { logos: readonly TrustedLogo[] }) {
  const pass = repeatToFill(logos, MIN_TRACK_ITEMS);

  return (
    <div className={styles.marqueeViewport}>
      <div className={styles.track}>
        {[0, 1].map((passIndex) => (
          <div
            className={styles.trackPass}
            key={passIndex}
            aria-hidden={passIndex === 1 || undefined}
          >
            {pass.map((logo, index) => {
              const isRealAnnouncement = passIndex === 0 && index < logos.length;
              return (
                // eslint-disable-next-line @next/next/no-img-element -- arbitrary Firebase Storage URLs, no next/image remote pattern configured
                <img
                  key={`${logo.id}-${index}`}
                  src={logo.imageUrl}
                  alt={isRealAnnouncement ? logo.alt : ""}
                  aria-hidden={isRealAnnouncement ? undefined : true}
                  className={styles.logo}
                  loading="lazy"
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
