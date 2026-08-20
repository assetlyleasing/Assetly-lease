import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Assetly",
};

/*
 * About page. Phase 0 placeholder — the real content (image, heading, company
 * description, optional location line) is built in Phase 8 from source-grounded
 * copy only. Do not fabricate company history, stats, or founder content here;
 * SOURCE_OF_TRUTH.md §4 is explicit about that.
 */
export default function AboutPage() {
  return (
    <main>
      <h1>About Assetly</h1>
    </main>
  );
}
