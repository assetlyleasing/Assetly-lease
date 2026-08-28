import type { Metadata } from "next";
import Image from "next/image";

import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { RevealOnScroll } from "@/components/primitives/RevealOnScroll";
import { SerifHeading } from "@/components/primitives/SerifHeading";
import { ABOUT_CONTENT, ABOUT_META_DESCRIPTION } from "@/content/about/copy";
import { CONTACT, SOCIAL } from "@/content/site/navigation";

import styles from "./About.module.css";

export const metadata: Metadata = {
  title: "About Assetly | Assetly",
  description: ABOUT_META_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Assetly | Assetly",
    description: ABOUT_META_DESCRIPTION,
    type: "website",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <section className={styles.section} aria-labelledby="about-title">
        <Container>
          <RevealOnScroll className={styles.layout}>
            <div className={`${styles.copy} rv-u`}>
              <Eyebrow>{ABOUT_CONTENT.eyebrow}</Eyebrow>
              <SerifHeading level={1} id="about-title" className={styles.heading}>
                {ABOUT_CONTENT.heading}
              </SerifHeading>
              {ABOUT_CONTENT.paragraphs.map((paragraph) => (
                <p className={styles.body} key={paragraph}>
                  {paragraph}
                </p>
              ))}

              <p className={styles.closing}>
                <span>{ABOUT_CONTENT.city}</span>
                <a className={styles.email} href={`mailto:${CONTACT.email}`}>
                  {CONTACT.email}
                </a>
                <a
                  className={styles.email}
                  href={SOCIAL.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </p>
            </div>

            <div className={`${styles.media} rv-u rv-d1`} data-about-media>
              <Image
                src="/about/leadership-team.webp"
                alt="Four members of the Assetly leadership team standing together in business attire against a plain grey backdrop."
                width={1600}
                height={899}
                sizes="(max-width: 760px) 100vw, 46vw"
                className={styles.mediaImage}
                priority={false}
              />
            </div>
          </RevealOnScroll>
        </Container>
      </section>
    </main>
  );
}
