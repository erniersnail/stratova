import Link from "next/link";
import Container from "@/components/layout/Container";
import { IS_PRE_LAUNCH, RA_REGISTRATION_NUMBER } from "@/lib/site";

const BOTTOM_LINKS = [
  { label: "Careers", href: "/careers" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Disclosures", href: "/compliance/disclaimer" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      {IS_PRE_LAUNCH && (
        <div className="border-b border-border bg-foreground px-6 py-2.5">
          <div className="mx-auto w-full max-w-[1200px]">
            <p className="text-center text-xs font-medium tracking-wide text-white">
              Pre-launch — not for public distribution.
            </p>
          </div>
        </div>
      )}
      <Container className="py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <span className="text-xl font-semibold tracking-wide text-foreground">
              SIMPLICAL CAPITAL
            </span>
            <p className="mt-4 text-sm leading-[1.75] text-secondary">
              Systematic investing for individual investors. Built to compound.
            </p>
          </div>
          {RA_REGISTRATION_NUMBER && (
            <span className="text-sm text-secondary">
              SEBI Research Analyst Registration No.: {RA_REGISTRATION_NUMBER}
            </span>
          )}
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-secondary">
            &copy; 2026 Simplical Capital. All rights reserved.
          </span>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {BOTTOM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
