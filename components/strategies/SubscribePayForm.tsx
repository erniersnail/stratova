"use client";

import { useActionState, useState } from "react";
import Button from "@/components/ui/Button";
import { subscribeAction, type SubscribeState } from "@/lib/auth/actions";
import type { BillingCycleMonths } from "@/lib/billing/cycles";

const initialState: SubscribeState = {};

const MIN_CAPITAL = 100_000;

export default function SubscribePayForm({
  strategyId,
  cycle = 1,
}: {
  strategyId: string;
  fee: number | null;
  cycle?: BillingCycleMonths;
}) {
  const [state, formAction, pending] = useActionState(
    subscribeAction,
    initialState,
  );
  const [capitalRaw, setCapitalRaw] = useState("");

  const capital = Number(capitalRaw.replace(/[,\s₹]/g, ""));
  const capitalValue = Number.isFinite(capital) && capital > 0 ? capital : 0;
  const capitalTooLow = capitalRaw.trim().length > 0 && capitalValue < MIN_CAPITAL;

  // 2% of deployed capital per year, billed monthly, with a ₹2,000/month floor.
  const annualFee = capitalValue * 0.02;
  const monthlyFee = annualFee / 12;
  const baseFee = Math.max(2000, monthlyFee);
  const cycleDiscount = cycle === 1 ? 1 : cycle === 3 ? 0.95 : 0.9;
  const totalFee = Math.round(baseFee * cycle * cycleDiscount);

  const disabled = pending;
  const submitDisabled = disabled || capitalValue < MIN_CAPITAL;

  return (
    <form action={formAction} className="mt-4 space-y-4" noValidate>
      <input type="hidden" name="strategyId" value={strategyId} />
      <input type="hidden" name="billingCycle" value={cycle} />
      <input type="hidden" name="fee" value={totalFee} />

      {state.error && (
        <div
          role="alert"
          className="rounded-md border border-border bg-surface px-4 py-3"
        >
          <p className="text-sm text-secondary">{state.error}</p>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="capital"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Capital to allocate (₹)
        </label>
        <input
          id="capital"
          name="capital"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="100000"
          required
          disabled={disabled}
          onChange={(e) => setCapitalRaw(e.target.value)}
          aria-invalid={capitalTooLow}
          aria-describedby={capitalTooLow ? "capital-error" : undefined}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-tertiary"
        />
        {capitalTooLow && (
          <p id="capital-error" className="text-xs text-red-600">
            Minimum capital allocation is ₹1,00,000.
          </p>
        )}
        <p className="text-xs text-secondary mt-2 leading-relaxed">
          <span className="font-medium text-foreground">Important:</span> Please
          enter your exact deployment capital. Strategy weights and share
          quantities are derived directly from this amount. Entering inaccurate
          figures will distort your expected returns.
        </p>
      </div>

      <div>
        <p className="text-xs text-secondary mt-2">
          A 2% annual management fee (billed monthly) applies. Minimum fee:
          ₹2,000/month.
        </p>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={submitDisabled}
          className="mt-4 w-full"
        >
          {pending
            ? "Processing…"
            : `Pay ₹${totalFee.toLocaleString("en-IN")} & subscribe`}
        </Button>
      </div>
    </form>
  );
}