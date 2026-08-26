"use client";

import { signOutAdmin } from "@/lib/firebase/auth";

import styles from "./Admin.module.css";
import { useAdminUser } from "./AdminGate";

export function SignOutButton() {
  const user = useAdminUser();

  return (
    <>
      {user?.email ? <span>{user.email}</span> : null}
      <button
        type="button"
        className={styles.textButton}
        onClick={() => {
          void signOutAdmin();
        }}
      >
        Sign out
      </button>
    </>
  );
}
