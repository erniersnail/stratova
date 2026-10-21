"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";
import { subscribeAction, type SubscribeState } from "@/lib/auth/actions";
import { calculateTotalFee } from "@/lib/billing/cycles";
import type { BillingCycleMonths } from "@/lib/billing/cycles";

const initialState: SubscribeState = {};

export default function SubscribePayForm({
  strategyId,
  fee,
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

  const totalFee = fee !== null ? calculateTotalFee(fee, cycle) : null;
  const feeStr = totalFee !== null ? `₹${totalFee.toLocaleString("en-IN")}` : "—";

  const disabled = fee === null || pending;

  return (
    <form action={formAction} className="mt-4 space-y-4" noValidate>
      <input type="hidden" name="strategyId" value={strategyId} />
      <input type="hidden" name="billingCycle" value={cycle} />

      {state.error && (
        <div
          role="alert"
          className="rounded-md border border-border bg-surface px-4 py-3"
        >
          <p className="text-sm text-secondary">{state.error}</p>
        </div>
      )}

      <div>
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
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-tertiary"
        />
        <p className="mt-1.5 text-xs text-tertiary">
          Between ₹10,000 and ₹1,00,00,000.
        </p>
      </div>

      <Button type="submit" variant="primary" size="md" disabled={disabled}>
        {pending ? "Processing…" : `Pay ${feeStr} & subscribe`}
      </Button>
    </form>
  );
}