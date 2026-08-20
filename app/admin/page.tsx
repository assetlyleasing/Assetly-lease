import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Assetly",
  // §22: the admin surface must never be indexed, and is excluded from the
  // sitemap built in Phase 9.
  robots: { index: false, follow: false },
};

/*
 * Trusted By logo management. Phase 0 placeholder — the authentication gate and
 * the management UI are built in Phase 3. This route is intentionally inert and
 * reads nothing from Firebase yet.
 */
export default function AdminPage() {
  return (
    <main>
      <h1>Admin</h1>
    </main>
  );
}
