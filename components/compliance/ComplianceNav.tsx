"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPLIANCE_PAGES } from "@/lib/compliance";

export default function ComplianceNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Compliance pages">
      <h2 className="text-[11px] font-semibold tracking-[0.15em] text-tertiary uppercase">
        Compliance
      </h2>
      <ul className="mt-5 space-y-3">
        {COMPLIANCE_PAGES.map((page) => {
          const href = `/compliance/${page.slug}`;
          const isActive = pathname === href;
          return (
            <li key={page.slug}>
              <Link
                href={href}
                className={`block text-sm leading-snug transition-colors duration-200 ${
                  isActive
                    ? "font-medium text-foreground"
                    : "text-secondary hover:text-foreground"
                }`}
              >
                {page.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
