import Link from "next/link";
import Container from "@/components/layout/Container";
import { IS_PRE_LAUNCH, RA_REGISTRATION_NUMBER } from "@/lib/site";

type FooterLink = {
  label: string;
  href: string;
};

type FooterColumn = {
  heading: string;
  links: FooterLink[];
};

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Research",
    links: [
      { label: "Latest Research", href: "/research" },
      { label: "U.S. Equity Strategies", href: "/research/us-equities" },
      { label: "Methodology", href: "/methodology" },
      { label: "Performance", href: "/performance" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "Email", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
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
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-xl font-semibold tracking-wide text-foreground">
              STRATOVA
            </span>
            <span className="mt-2 block text-sm font-medium text-secondary">
              Quantitative Research
            </span>
            <p className="mt-5 text-sm leading-[1.75] text-secondary">
              Systematic investment research across U.S. and Indian equity markets.
            </p>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="text-[13px] font-medium tracking-wide text-foreground">
                {column.heading}
              </h3>
              <nav aria-label={`${column.heading} links`}>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-secondary transition-colors duration-200 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}
        </div>
        <div className="mt-14 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <span className="text-sm text-secondary">
              &copy; 2026 Stratova Quant.
            </span>
            <span className="text-sm text-secondary">
              SEBI Research Analyst Registration No.: {RA_REGISTRATION_NUMBER}
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}