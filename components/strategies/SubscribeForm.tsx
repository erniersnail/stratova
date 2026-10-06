"use client";

import { useActionState, useState } from "react";
import Button from "@/components/ui/Button";
import { subscribeAction, type SubscribeState } from "@/lib/auth/actions";

type SubscribeFormProps = {
  strategyId: string;
  strategyPath: string;
  strategyName: string;
  /** Existing capital_allocated when the user already subscribes — prefills the change form. */
  currentAmount: number | null;
};

const initialState: SubscribeState = {};

export default function SubscribeForm({
  strategyId,
  strategyPath,
  strategyName,
  currentAmount,
}: SubscribeFormProps) {
  const isChange = currentAmount !== null;
  const [open, setOpen] = useState(!isChange);
  const [state, formAction, pending] = useActionState(
    subscribeAction,
    initialState,
  );

  if (isChange && !open) {
    return (
      <div className="mt-4">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => setOpen(true)}
        >
          Change allocation
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="strategyId" value={strategyId} />
      <input type="hidden" name="strategyPath" value={strategyPath} />
      <input type="hidden" name="mode" value={isChange ? "change" : "subscribe"} />

      <p className="text-sm font-medium text-foreground">
        {isChange
          ? `Change allocation — ${strategyName}`
          : `Subscribe to ${strategyName}`}
      </p>

      {state.error && (
        <div
          role="alert"
          className="rounded-md border border-border bg-surface px-4 py-3"
        >
          <p className="text-sm text-secondary">{state.error}</p>
        </div>
      )}

      {state.success && (
        <div
          role="status"
          className="rounded-md border border-border bg-surface px-4 py-3"
        >
          <p className="text-sm text-foreground">{state.success}</p>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-foreground"
        >
          Amount to allocate (₹)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          inputMode="numeric"
          min={10000}
          max={10000000}
          step={1}
          required
          disabled={pending}
          defaultValue={currentAmount ?? undefined}
          placeholder="10000"
          className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-tertiary focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
        />
        <p className="text-xs text-tertiary">
          Between ₹10,000 and ₹1,00,00,000.
        </p>
      </div>

      <div className="flex justify-end gap-3">
        {isChange && (
          <Button
            variant="secondary"
            type="button"
            disabled={pending}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : isChange ? "Update allocation" : "Subscribe"}
        </Button>
      </div>
    </form>
  );
}
