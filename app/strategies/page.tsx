import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/common/PageHeader";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Strategies",
  description:
    "Systematic quantitative strategies for Indian and U.S. equity markets.",
};

const REGION_CARDS = [
  {
    href: "/strategies/india",
    label: "India",
    title: "India Strategies",
    description: "Systematic quantitative strategies for NSE-listed equities.",
  },
  {
    href: "/strategies/us",
    label: "United States",
    title: "U.S. Strategies",
    description: "Systematic strategies across the NASDAQ 100.",
  },
];

export default function StrategiesPage() {
  return (
    <main>
      <Container className="py-20">
        <PageHeader
          title="Strategies"
          description="Systematic quantitative strategies for Indian and U.S. equity markets."
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {REGION_CARDS.map((card) => (
            <li key={card.href}>
              <Link
                href={card.href}
                className="flex h-full flex-col rounded-md border border-border bg-surface p-6 transition-colors duration-200 hover:border-foreground"
              >
                <span className="text-xs font-medium uppercase tracking-widest text-tertiary">
                  {card.label}
                </span>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                  {card.title}
                </h2>
                <p className="mt-2 text-sm text-secondary">
                  {card.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}

