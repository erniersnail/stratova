"use client";

import { useActionState, useState } from "react";
import Button from "@/components/ui/Button";
import { subscribeAction, type SubscribeState } from "@/lib/auth/actions";
import type { BillingCycleMonths } from "@/lib/billing/cycles";

const initialState: SubscribeState = {};

export default function SubscribePayForm({
  strategyId,
  strategy,
  cycle = 1,
  currency = "₹",
  feeStr = "—",
}: {
  strategyId: string;
  strategy?: { slug: string | null; id: string };
  fee: number | null;
  cycle?: BillingCycleMonths;
  currency?: string;
  feeStr?: string;
}) {
  const isUS =
    strategy?.slug === "us-equity-leadership" ||
    strategy?.id === "95ccee51-d817-4a61-9a5b-b4d1a9143e74";
  const MIN_CAPITAL = isUS ? 10000 : 100000;
  const [state, formAction, pending] = useActionState(
    subscribeAction,
    initialState,
  );
  const [capitalRaw, setCapitalRaw] = useState("");

  const capital = Number(capitalRaw.replace(/[,\s₹$]/g, ""));
  const capitalValue = Number.isFinite(capital) && capital > 0 ? capital : 0;
  const capitalTooLow = capitalRaw.trim().length > 0 && capitalValue < MIN_CAPITAL;

  const totalFee = Number(feeStr.replace(/[^0-9.]/g, '')) * cycle;

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
          Capital to allocate ({currency === "$" ? "USD" : "INR"})
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
            Minimum capital allocation is {isUS ? "$10,000" : "₹1,00,000"}.
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
        <p className="mt-3 text-xs leading-relaxed text-secondary">
          A flat research fee of {feeStr} per cycle applies.
        </p>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={submitDisabled}
          className="mt-4 w-full"
        >
          {pending ? "Processing…" : `Pay ${feeStr} & subscribe`}
        </Button>
      </div>
    </form>
  );
}