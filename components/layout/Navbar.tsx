import Link from "next/link";
import Logo from "@/components/layout/Logo";
import AuthLinks from "@/components/layout/AuthLinks";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Research", href: "/research" },
  { label: "Methodology", href: "/methodology" },
  { label: "Performance", href: "/performance" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 h-24 border-b border-border bg-background/95 backdrop-blur-sm"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 h-full flex items-center justify-between">
        <Logo />
        <ul className="flex items-center gap-10">
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
      </div>
    </nav>
  );
}