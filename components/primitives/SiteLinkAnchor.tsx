"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

import type { SiteLink } from "@/content/site/navigation";
import { scrollToSection, sectionHref } from "@/lib/scroll";

/**
 * Renders one navigation link, resolving the anchor-versus-route rule in a
 * single place so Nav and Footer cannot disagree about it.
 *
 * On the homepage a section link is a fragment and scrolls smoothly. From any
 * other route the same link becomes `/#section` and performs a real navigation,
 * because the target is not in the current document.
 */
export function SiteLinkAnchor({
  link,
  className,
  onNavigate,
}: {
  link: SiteLink;
  className?: string;
  /** Fires on activation — the mobile overlay uses it to close itself. */
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  if (link.kind === "route") {
    return (
      <Link href={link.href} className={className} onClick={onNavigate}>
        {link.label}
      </Link>
    );
  }

  const href = sectionHref(link.sectionId, pathname);
  const isSamePage = pathname === "/";

  if (!isSamePage) {
    return (
      <Link href={href} className={className} onClick={onNavigate}>
        {link.label}
      </Link>
    );
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();

    // Leave modified clicks alone — they mean "open elsewhere", not "scroll".
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    // If the section isn't in the document (Trusted By can render nothing, per
    // §12), fall through to the browser rather than swallowing the click.
    if (scrollToSection(link.sectionId)) {
      event.preventDefault();
    }
  };

  return (
    <a href={href} className={className} onClick={handleClick}>
      {link.label}
    </a>
  );
}
