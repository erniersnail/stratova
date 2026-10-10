"use client";

import { useActionState } from "react";
import { insertManualRecommendation } from "@/lib/admin/actions";
import type { AdminStrategyOption } from "@/lib/admin/recommendations";

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground";
const labelClass = "block text-xs uppercase tracking-wider text-tertiary";
const fieldGap = "space-y-4";

/**
 * Manual recommendation insert form. Uses useActionState so validation
 * errors render inline without losing typed values (same pattern as
 * ArticleForm / StrategyRowEditor).
 */
export default function RecommendationForm({
  strategies,
}: {
  strategies: AdminStrategyOption[];
}) {
  const [state, action, pending] = useActionState(
    insertManualRecommendation,
    {},
  );

  return (
    <form action={action} className={fieldGap}>
      {state.error && (
        <p className="rounded-md border border-border px-3 py-2 text-sm text-foreground">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-md border border-border px-3 py-2 text-sm text-secondary">
          {state.success}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="strategy_id">
            Strategy
          </label>
          <select
            id="strategy_id"
            name="strategy_id"
            required
            className={`${inputClass} mt-1`}
            defaultValue=""
          >
            <option value="" disabled>
              Select a strategy…
            </option>
            {strategies.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="symbol">
            Symbol
          </label>
          <input
            id="symbol"
            name="symbol"
            type="text"
            required
            placeholder="e.g. RELIANCE"
            className={`${inputClass} mt-1`}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="action">
            Action
          </label>
          <select
            id="action"
            name="action"
            required
            className={`${inputClass} mt-1`}
            defaultValue="BUY"
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
            <option value="HOLD">HOLD</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="as_of">
            As of
          </label>
          <input
            id="as_of"
            name="as_of"
            type="datetime-local"
            required
            className={`${inputClass} mt-1`}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="weight_pct">
            Weight % (optional)
          </label>
          <input
            id="weight_pct"
            name="weight_pct"
            type="number"
            min={0}
            max={100}
            step="0.01"
            placeholder="e.g. 8.5"
            className={`${inputClass} mt-1`}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="price">
            Price (optional)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step="0.01"
            placeholder="e.g. 2450.00"
            className={`${inputClass} mt-1`}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="rationale">
          Rationale (optional)
        </label>
        <textarea
          id="rationale"
          name="rationale"
          rows={3}
          className={`${inputClass} mt-1`}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add recommendation"}
      </button>
    </form>
  );
}