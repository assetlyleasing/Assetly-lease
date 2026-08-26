import type { ReactNode } from "react";

import { AdminGate } from "@/components/admin/AdminGate";

/**
 * Wraps every `/admin` route (including `/admin/login`) in the auth gate.
 * TRUST-002.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminGate>{children}</AdminGate>;
}
