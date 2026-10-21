"use client";

import { useState } from "react";
import { typography } from "@/lib/typography";
import SubscribePayForm from "@/components/strategies/SubscribePayForm";
import {
  calculateTotalFee,
  BILLING_CYCLES,
  discountPercentFor,
  type BillingCycleMonths,
} from "@/lib/billing/cycles";

export type PricingStrategy = {
  id: string;
  name: string;
  short_description: string | null;
  benchmark: string | null;
  fee: number | null;
  nextDateStr: string;
  subStatus?: string;
};

export default function PricingPlans({ strategies }: { strategies: PricingStrategy[] }) {
  const [cycle, setCycle] = useState<BillingCycleMonths>(1);

  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md border border-border p-1 bg-surface">
          {BILLING_CYCLES.map((c) => (
            <button
              key={c.months}
              type="button"
              onClick={() => setCycle(c.months)}
              className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
                cycle === c.months
                  ? "bg-foreground text-background"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        {cycle !== 1 && (
          <span className="text-xs text-tertiary">
            {discountPercentFor(cycle)}% discount applied
          </span>
        )}
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        {strategies.map((strategy) => {
          const totalFee =
            strategy.fee !== null ? calculateTotalFee(strategy.fee, cycle) : null;
          const feeStr =
            totalFee !== null ? `₹${totalFee.toLocaleString("en-IN")}` : "—";

          const subStatus = strategy.subStatus;

          return (
            <div
              key={strategy.id}
              className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-sm transition-colors hover:border-foreground/20"
            >
              <div className="flex-1 max-w-2xl">
                <h2 className="text-2xl font-serif text-foreground">
                  {strategy.name}
                </h2>
                {strategy.short_description && (
                  <p className={`${typography.body} mt-2 text-secondary`}>
                    {strategy.short_description}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-x-12 gap-y-4 border-t border-border pt-4">
                  <div>
                    <p className="text-xs text-tertiary uppercase tracking-wide">
                      Next rebalance
                    </p>
                    <p className="font-medium text-foreground">
                      {strategy.nextDateStr}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-tertiary uppercase tracking-wide">
                      Fee
                    </p>
                    <p className="font-medium text-foreground">{feeStr}</p>
                  </div>
                  <div>
                    <p className="text-xs text-tertiary uppercase tracking-wide">
                      Benchmark
                    </p>
                    <p className="font-medium text-foreground">
                      {strategy.benchmark ?? "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[380px] shrink-0 lg:border-l lg:border-border lg:pl-8">
                {subStatus ? (
                  <div className="rounded-md border border-border bg-surface-hover px-6 py-6 text-center h-full flex flex-col items-center justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-foreground">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          subStatus === "ACTIVE" ? "bg-accent" : "bg-tertiary"
                        }`}
                      />
                      {subStatus === "PENDING" ? "Awaiting Rebalance" : "Subscribed"}
                    </span>
                    <p className={`${typography.body} mt-3 text-sm text-secondary`}>
                      {subStatus === "PENDING"
                        ? "Your subscription will activate on the next rebalance date."
                        : "You have active access to this strategy's picks."}
                    </p>
                  </div>
                ) : (
                  <div className="w-full">
                    <p className="text-sm font-medium text-foreground mb-4 lg:hidden">
                      Subscribe
                    </p>
                    <SubscribePayForm
                      strategyId={strategy.id}
                      fee={strategy.fee}
                      cycle={cycle}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
