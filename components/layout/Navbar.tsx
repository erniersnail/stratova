import Link from "next/link";
import Logo from "./Logo";
import AuthLinks from "./AuthLinks";
import MobileNav from "./MobileNav";

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
 * Shell styles inlined so they cannot be dropped by the per-route CSS
 * chunker. Responsive visibility comes from .nav-desktop / .nav-mobile
 * in globals.css (also not chunked).
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
  gap: "1rem",
};

const LOGO_WRAP_STYLE: React.CSSProperties = {
  flexShrink: 0,
};

export default function Navbar() {
  return (
    <nav aria-label="Main navigation" style={NAV_SHELL_STYLE}>
      <div style={NAV_INNER_STYLE}>
        <div style={LOGO_WRAP_STYLE}>
          <Logo />
        </div>
        <ul className="nav-desktop">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="nav-link text-sm font-semibold tracking-wide"
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
