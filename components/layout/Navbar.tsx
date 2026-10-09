import Link from "next/link";
import Logo from "@/components/layout/Logo";
import AuthLinks from "@/components/layout/AuthLinks";
import MobileNav from "@/components/layout/MobileNav";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Research", href: "/research" },
  { label: "Strategies", href: "/strategies" },
  { label: "Performance", href: "/performance" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 h-24 border-b border-border bg-background/95 backdrop-blur-sm"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 h-full flex items-center justify-between">
        <Logo />
        {/* Desktop: inline nav + auth. Hidden below md. */}
        <ul className="hidden items-center gap-10 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm font-semibold text-secondary tracking-wide transition-colors duration-200 hover:text-foreground"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <AuthLinks />
          </li>
        </ul>
        {/* Mobile: hamburger + slide-down menu. Hidden at md and above. */}
        <MobileNav />
      </div>
    </nav>
  );
}