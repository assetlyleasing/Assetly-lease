"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";

import { subscribeToAdminAuth } from "@/lib/firebase/auth";

import styles from "./Admin.module.css";

const LOGIN_PATH = "/admin/login";

const AdminAuthContext = createContext<User | null>(null);

/** The signed-in admin's Firebase user, or `null` outside `AdminGate`/before sign-in. */
export function useAdminUser(): User | null {
  return useContext(AdminAuthContext);
}

type AuthStatus = "checking" | "authed" | "anon";

/**
 * Auth gate for everything under `/admin` (TRUST-002).
 *
 * DEC-057: there is one authorized admin account and no self-registration, so
 * "signed in to this Firebase project" is the entire admin check — no role
 * document to read. Unauthenticated visitors are redirected to
 * `/admin/login`; a signed-in visitor who lands on `/admin/login` is sent
 * back to `/admin`.
 */
export function AdminGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return subscribeToAdminAuth((nextUser) => {
      setUser(nextUser);
      setStatus(nextUser ? "authed" : "anon");
    });
  }, []);

  useEffect(() => {
    if (status === "checking") return;
    if (status === "anon" && pathname !== LOGIN_PATH) {
      router.replace(LOGIN_PATH);
    } else if (status === "authed" && pathname === LOGIN_PATH) {
      router.replace("/admin");
    }
  }, [status, pathname, router]);

  if (status === "checking") {
    return (
      <div className={styles.stateScreen}>
        <p>Checking sign-in…</p>
      </div>
    );
  }

  // A redirect is in flight in either of these cases — render nothing rather
  // than flash the wrong screen.
  if (status === "anon" && pathname !== LOGIN_PATH) return null;
  if (status === "authed" && pathname === LOGIN_PATH) return null;

  return (
    <AdminAuthContext.Provider value={user}>{children}</AdminAuthContext.Provider>
  );
}
