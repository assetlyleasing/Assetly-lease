import styles from "./LogoMark.module.css";
import type { Ref } from "react";

/**
 * The Assetly "a." mark, sized by the `font-size` it inherits and coloured by
 * `currentColor`.
 *
 * Always decorative: every place the mark appears it sits beside the wordmark,
 * which already carries the accessible name. Rendering it again for assistive
 * technology would announce the brand twice (§20).
 */
export function LogoMark({
  className,
  ref,
}: {
  className?: string;
  ref?: Ref<HTMLSpanElement>;
}) {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={className ? `${styles.mark} ${className}` : styles.mark}
    />
  );
}
