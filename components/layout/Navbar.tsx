import Link from "next/link";
import Logo from "./Logo";
import AuthLinks from "./AuthLinks";
import MobileNav from "./MobileNav";
type NavItem = { label: string; href: string };
const NAV_ITEMS: NavItem[] = [
  { label: "Strategies", href: "/strategies" },
  { label: "Performance", href: "/performance" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Research", href: "/research" },
  { label: "Dashboard", href: "/dashboard" },
];
const NAV_SHELL_STYLE: React.CSSProperties = {
  position: "sticky", top: 0, zIndex: 50, height: "53px",
  borderBottom: "1px solid var(--color-border)",
  backgroundColor: "var(--color-background)",
};
const NAV_INNER_STYLE: React.CSSProperties = {
  marginLeft: "auto", marginRight: "auto", width: "100%", maxWidth: "1200px",
  paddingLeft: "1.5rem", paddingRight: "1.5rem", height: "100%",
  display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
};
export default function Navbar() {
  return (
    <nav aria-label="Main navigation" style={NAV_SHELL_STYLE}>
      <div style={NAV_INNER_STYLE}>
        <div style={{ flexShrink: 0 }}><Logo /></div>
        <ul className="nav-desktop">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}><Link href={item.href} className="nav-link text-sm font-semibold tracking-wide">{item.label}</Link></li>
          ))}
          <li><AuthLinks /></li>
        </ul>
        <MobileNav />
      </div>
    </nav>
  );
}
