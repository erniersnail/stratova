"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

type AuthLinksState = "loading" | "logged-out" | "logged-in";

const linkClassName = "nav-link text-sm font-semibold tracking-wide whitespace-nowrap";

function toTitleCase(s: string): string {
  if (!s) return "";
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function AuthLinks() {
  const [state, setState] = useState<AuthLinksState>("loading");
  const [displayName, setDisplayName] = useState("Account");

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    // Use getSession for immediate UI hydration (reads from local cookie synchronously)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setState("logged-in");
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .maybeSingle();
        if (!mounted) return;
        const fullName = toTitleCase(profile?.full_name ?? "").trim();
        const firstName = fullName.split(/\s+/)[0] || "Account";
        setDisplayName(firstName);
      } else {
        setState("logged-out");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        if (session?.user) {
          setState("logged-in");
        } else {
          setState("logged-out");
          setDisplayName("Account");
        }
      }
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
        {displayName}
      </Link>
    );
  }

  return (
    <div className="flex w-[168px] items-center justify-end gap-6">
      <Link href="/login" className={linkClassName}>
        Log in
      </Link>
      <Button
        href="/signup"
        variant="primary"
        size="sm"
        className="whitespace-nowrap"
      >
        Sign up
      </Button>
    </div>
  );
}