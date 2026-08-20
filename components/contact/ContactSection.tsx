"use client";

import { useCallback, useRef, useState } from "react";

import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { RevealOnScroll } from "@/components/primitives/RevealOnScroll";
import { SerifHeading } from "@/components/primitives/SerifHeading";
import { EMPTY_CONTACT_INPUT } from "@/content/contact/enquiryTypes";
import { CONTACT } from "@/content/site/navigation";
import { useMediaQuery } from "@/lib/motion/useMediaQuery";

import { ContactDrawer } from "./ContactDrawer";
import { ContactMap } from "./ContactMap";
import { ContactSheet } from "./ContactSheet";
import { EnquiryFlow, type EnquiryStep } from "./EnquiryFlow";
import styles from "./Contact.module.css";

const PANEL_ID = "contact-panel";

export function ContactSection() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<EnquiryStep>("type");
  const [input, setInput] = useState(EMPTY_CONTACT_INPUT);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const isMobile = useMediaQuery("(max-width: 700px)");
  const close = useCallback(() => setOpen(false), []);

  const flow = (
    <EnquiryFlow input={input} setInput={setInput} step={step} setStep={setStep} />
  );

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <Container>
        <RevealOnScroll>
          <div className={styles.layout}>
            <div className={`${styles.info} rv-u`}>
              <div>
                <Eyebrow>Contact</Eyebrow>
                <SerifHeading level={2} id="contact-title" className={styles.heading}>
                  Let&apos;s talk.
                </SerifHeading>
              </div>

              <dl className={styles.contactList}>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${CONTACT.telHref}`}>{CONTACT.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{CONTACT.city}</dd>
                </div>
              </dl>
            </div>

            <div className={`${styles.mapShell} rv-u rv-d1`}>
              <ContactMap />
              <button
                ref={triggerRef}
                type="button"
                className={isMobile ? styles.triggerMobile : styles.trigger}
                aria-expanded={open}
                aria-controls={PANEL_ID}
                onClick={() => setOpen(true)}
                data-contact-trigger
              >
                Contact <span aria-hidden="true">›</span>
              </button>

              {isMobile === false && (
                <ContactDrawer
                  open={open}
                  panelId={PANEL_ID}
                  triggerRef={triggerRef}
                  onClose={close}
                >
                  {flow}
                </ContactDrawer>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </Container>

      {isMobile === true && (
        <ContactSheet
          open={open}
          panelId={PANEL_ID}
          triggerRef={triggerRef}
          onClose={close}
        >
          {flow}
        </ContactSheet>
      )}
    </section>
  );
}
