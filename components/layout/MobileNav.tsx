"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Research", href: "/research" },
  { label: "Strategies", href: "/strategies" },
  { label: "Performance", href: "/performance" },
  { label: "Dashboard", href: "/dashboard" },
];

type AuthState = "loading" | "logged-out" | "logged-in";

const NAV_HEIGHT_PX = 53;

function toTitleCase(s: string): string {
  if (!s) return "";
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [displayName, setDisplayName] = useState("Account");

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setAuthState("logged-in");
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .maybeSingle();
        if (!mounted) return;
        const fullName = toTitleCase(profile?.full_name ?? "").trim();
        setDisplayName(fullName.split(/\s+/)[0] || "Account");
      } else {
        setAuthState("logged-out");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        if (session?.user) {
          setAuthState("logged-in");
        } else {
          setAuthState("logged-out");
          setDisplayName("Account");
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className="nav-mobile">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-foreground"
      >
        {open ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              top: NAV_HEIGHT_PX,
              bottom: 0,
              zIndex: 40,
              cursor: "default",
              backgroundColor: "rgba(17, 17, 17, 0.4)",
            }}
          />
          <div
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              top: NAV_HEIGHT_PX,
              zIndex: 50,
              maxHeight: `calc(100vh - ${NAV_HEIGHT_PX}px)`,
              overflowY: "auto",
              borderBottom: "1px solid var(--color-border)",
              backgroundColor: "var(--color-background)",
            }}
          >
            <nav aria-label="Mobile navigation" className="px-6 py-4">
              <ul>
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-[48px] items-center text-base font-semibold text-secondary transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <hr className="my-3 border-t border-border" />

              <div className="flex min-h-[48px] flex-col justify-center gap-3 pb-2">
                {authState === "loading" ? (
                  <span className="h-5 w-24 animate-pulse rounded bg-surface-hover" />
                ) : authState === "logged-in" ? (
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="text-base font-semibold text-secondary transition-colors hover:text-foreground"
                  >
                    {displayName}
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="text-base font-semibold text-secondary transition-colors hover:text-foreground"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center justify-center rounded-sm bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}