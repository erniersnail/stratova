import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/common/PageHeader";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import { getPublicStrategies } from "@/lib/strategies/fetch";

export const metadata: Metadata = {
  title: "Strategies",
  description: "Four quantitative strategies from Stratova.",
};

export const dynamic = "force-dynamic";

const RISK_LABEL: Record<string, string> = {
  moderate: "Moderate risk",
  high: "High risk",
};

export default async function StrategiesPage() {
  const strategies = await getPublicStrategies();

  return (
    <>
      <PageHeader
        title="Strategies"
        description="Four quantitative strategies from Stratova."
      />

      <Section>
        <Container>
          {strategies.length === 0 ? (
            <div className="rounded-md border border-border bg-surface px-6 py-8">
              <p className="text-sm text-secondary">
                Strategy catalog is being finalised.
              </p>
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2">
              {strategies.map((strategy) => (
                <li key={strategy.id}>
                  <Link
                    href={`/strategies/${strategy.slug}`}
                    className="flex h-full flex-col rounded-md border border-border bg-surface p-6 transition-colors duration-200 hover:border-foreground"
                  >
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                      {strategy.name}
                    </h2>

                    {strategy.short_description && (
                      <p className="mt-2 text-sm text-secondary">
                        {strategy.short_description}
                      </p>
                    )}

                    <dl className="mt-4 space-y-1 text-sm">
                      {strategy.benchmark && (
                        <div className="flex justify-between gap-4">
                          <dt className="text-tertiary">Benchmark</dt>
                          <dd className="text-secondary">
                            {strategy.benchmark}
                          </dd>
                        </div>
                      )}
                      {strategy.risk_level && (
                        <div className="flex justify-between gap-4">
                          <dt className="text-tertiary">Risk</dt>
                          <dd className="text-secondary">
                            {RISK_LABEL[strategy.risk_level] ??
                              strategy.risk_level}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </>
  );
}
