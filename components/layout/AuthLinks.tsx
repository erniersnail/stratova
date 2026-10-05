"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type AuthLinksState = "loading" | "logged-out" | "logged-in";

const linkClassName =
  "text-sm font-semibold text-secondary tracking-wide transition-colors duration-200 hover:text-foreground";

/**
 * Client island mounted inside the server Navbar. Reads the session in the
 * browser so every marketing route keeps its static render. Fixed-width
 * skeleton prevents layout shift while the session resolves.
 */
export default function AuthLinks() {
  const [state, setState] = useState<AuthLinksState>("loading");

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setState(data.user ? "logged-in" : "logged-out");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setState(session?.user ? "logged-in" : "logged-out");
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (state === "loading") {
    return (
      <div
        aria-hidden="true"
        className="flex w-[168px] items-center justify-end gap-6"
      >
        <span className="h-4 w-12 animate-pulse rounded bg-surface-hover" />
        <span className="h-4 w-[76px] animate-pulse rounded bg-surface-hover" />
      </div>
    );
  }

  if (state === "logged-in") {
    return (
      <Link href="/account" className={linkClassName}>
        Account
      </Link>
    );
  }

  return (
    <div className="flex w-[168px] items-center justify-end gap-6">
      <Link href="/login" className={linkClassName}>
        Log in
      </Link>
      <Link href="/signup" className={linkClassName}>
        Join waitlist
      </Link>
    </div>
  );
}
