"use client";

import { useState } from "react";
import { typography } from "@/lib/typography";
import SubscribePayForm from "@/components/strategies/SubscribePayForm";
import {
  calculateTotalFee,
  BILLING_CYCLES,
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
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col items-center justify-center mb-10 gap-3">
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
        {cycle > 1 && (
          <span className="text-xs text-secondary tracking-wide uppercase">
            {cycle === 3 ? "5% discount applied" : "10% discount applied"}
          </span>
        )}
      </div>

      <div className="space-y-6">
        {strategies.map((strategy) => {
          const totalFee =
            strategy.fee !== null ? calculateTotalFee(strategy.fee, cycle) : null;
          const feeStr =
            totalFee !== null ? `₹${totalFee.toLocaleString("en-IN")}` : "—";

          const subStatus = strategy.subStatus;

          return (
            <div
              key={strategy.id}
              className="border border-border rounded-lg p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center"
            >
              <div className="md:col-span-7 space-y-4">
                <h2 className="text-2xl font-serif text-foreground">
                  {strategy.name}
                </h2>
                {strategy.short_description && (
                  <p className={`${typography.body} mt-2 text-secondary`}>
                    {strategy.short_description}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-4 text-sm mt-4 border-t border-border pt-4">
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

              <div className="md:col-span-5 w-full flex flex-col justify-center">
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
    </div>
  );
}
