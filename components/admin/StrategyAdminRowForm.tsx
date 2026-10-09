"use client";

import { useActionState } from "react";
import { updateStrategyAdmin } from "@/lib/admin/markPaid";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type StrategyAdminRow = {
  id: string;
  fee_per_rebalance: number | null;
  is_subscribable: boolean;
};

/**
 * One table row per strategy: fee input, subscribable checkbox, Save.
 * Binds the strategy id to the shared updateStrategyAdmin action so each
 * row gets its own (prevState, formData) useActionState instance.
 */
export default function StrategyAdminRowForm({
  strategy,
}: {
  strategy: StrategyAdminRow;
}) {
  const boundUpdate = updateStrategyAdmin.bind(null, strategy.id);
  const [state, formAction, pending] = useActionState(boundUpdate, {});

  return (
    <form action={formAction} className="contents">
      <td className="py-3 pr-4">
        <Input
          id={`fee-${strategy.id}`}
          name="fee_per_rebalance"
          type="number"
          min={100}
          max={1000000}
          step={1}
          defaultValue={strategy.fee_per_rebalance ?? 5000}
          className="h-9 w-32"
        />
      </td>
      <td className="py-3 pr-4">
        <label className="flex items-center gap-2 text-sm text-secondary">
          <input
            type="checkbox"
            name="is_subscribable"
            defaultChecked={strategy.is_subscribable}
            className="h-4 w-4 accent-[#111111]"
          />
          Subscribable
        </label>
      </td>
      <td className="py-3">
        <div className="flex items-center gap-3">
          <Button type="submit" variant="secondary" size="sm" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
          {state.error ? (
            <span className="text-xs text-red-700">{state.error}</span>
          ) : state.success ? (
            <span className="text-xs text-green-700">{state.success}</span>
          ) : null}
        </div>
      </td>
    </form>
  );
}
