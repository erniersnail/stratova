import Link from "next/link";
import Logo from "@/components/layout/Logo";
import AuthLinks from "@/components/layout/AuthLinks";
import MobileNav from "@/components/layout/MobileNav";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Strategies", href: "/strategies" },
  { label: "Performance", href: "/performance" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Research", href: "/research" },
  { label: "Dashboard", href: "/dashboard" },
];

/**
 * Navbar shell styles are inlined rather than applied via Tailwind classes.
 * Next.js 16 + Turbopack's per-route CSS chunk splitting was omitting the
 * height utility on some routes, causing the nav to render inconsistently.
 * Inline styles ship with the HTML and cannot be dropped by the chunker.
 */
const NAV_SHELL_STYLE: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  height: "53px",
  borderBottom: "1px solid var(--color-border)",
  backgroundColor: "var(--color-background)",
};

const NAV_INNER_STYLE: React.CSSProperties = {
  marginLeft: "auto",
  marginRight: "auto",
  width: "100%",
  maxWidth: "1200px",
  paddingLeft: "1.5rem",
  paddingRight: "1.5rem",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const NAV_LIST_STYLE: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "2.5rem",
};

export default function Navbar() {
  return (
    <nav aria-label="Main navigation" style={NAV_SHELL_STYLE}>
      <div style={NAV_INNER_STYLE}>
        <Logo />
        <ul className="hidden md:flex" style={NAV_LIST_STYLE}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm font-semibold tracking-wide transition-colors duration-200"
                style={{ color: "var(--color-secondary)" }}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <AuthLinks />
          </li>
        </ul>
        <MobileNav />
      </div>
    </nav>
  );
}
