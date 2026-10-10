"use client";

import { useActionState } from "react";
import { updateStrategyAdmin } from "@/lib/admin/markPaid";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type StrategyRowEditorProps = {
  strategy: {
    id: string;
    name: string;
    fee_per_rebalance: number | null;
    is_subscribable: boolean;
  };
};

/**
 * Fee / Subscribable / Save cells for one /admin/strategies table row.
 *
 * A <form> cannot wrap <td>s (a form inside <tr> is invalid HTML — the
 * browser parser mangles it, which is why the inputs never rendered).
 * Instead the form sits inside the last cell and the fee input + checkbox
 * join it via the HTML5 form="" attribute, so a submit still collects all
 * three fields into a single FormData for updateStrategyAdmin.
 */
export default function StrategyRowEditor({
  strategy,
}: StrategyRowEditorProps) {
  const formId = `strategy-edit-${strategy.id}`;
  const boundUpdate = updateStrategyAdmin.bind(null, strategy.id);
  const [state, formAction, pending] = useActionState(boundUpdate, {});

  return (
    <>
      <td className="py-3 pr-4">
        <Input
          id={`fee-${strategy.id}`}
          form={formId}
          name="fee_per_rebalance"
          type="number"
          min={100}
          max={1000000}
          step={1}
          defaultValue={strategy.fee_per_rebalance ?? 5000}
          className="h-9 w-32"
          aria-label={`${strategy.name} fee (₹)`}
        />
      </td>
      <td className="py-3 pr-4">
        <label className="flex items-center gap-2 text-sm text-secondary">
          <input
            type="checkbox"
            name="is_subscribable"
            form={formId}
            defaultChecked={strategy.is_subscribable}
            className="h-4 w-4 accent-[#111111]"
          />
          Subscribable
        </label>
      </td>
      <td className="py-3">
        <form
          id={formId}
          action={formAction}
          className="flex items-center gap-3"
        >
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            disabled={pending}
          >
            {pending ? "Saving…" : "Save"}
          </Button>
          {state.error ? (
            <span className="text-xs text-red-700">{state.error}</span>
          ) : state.success ? (
            <span className="text-xs text-green-700">{state.success}</span>
          ) : null}
        </form>
      </td>
    </>
  );
}