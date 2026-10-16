"use client";

import { useState, useTransition } from "react";
import {
  removeApprovedRecommendation,
  updateAdminRemark,
} from "@/lib/admin/recommendationApproval";
import type { AdminRecommendation } from "@/lib/admin/recommendations";

function formatIST(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
}

/** weight_pct is stored as a fraction (0.3333 = 33.33%). Display x100. */
function formatWeight(w: number | null): string {
  return w !== null ? `${(Number(w) * 100).toFixed(2)}%` : "—";
}

const tdClass = "py-3 pr-4 align-top";
const smallBtn =
  "rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50";
const removeBtn = `${smallBtn} text-foreground hover:border-foreground`;
const inputClass =
  "w-full rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground placeholder:text-tertiary focus:border-foreground focus:outline-none";

export default function LivePickRow({
  rec,
}: {
  rec: AdminRecommendation;
}) {
  const [pending, startTransition] = useTransition();
  const [remark, setRemark] = useState(rec.admin_remark ?? "");
  const [remarkDirty, setRemarkDirty] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removeReason, setRemoveReason] = useState("");

  function handleSaveRemark() {
    startTransition(async () => {
      try {
        await updateAdminRemark(rec.id, remark);
        setRemarkDirty(false);
      } catch (err) {
        console.error(err);
        alert("Failed to save remark.");
      }
    });
  }

  function handleRemove() {
    if (!removeReason.trim()) {
      alert("Enter a reason before removing.");
      return;
    }
    startTransition(async () => {
      try {
        await removeApprovedRecommendation(rec.id, removeReason);
      } catch (err) {
        console.error(err);
        alert("Failed to remove.");
      }
    });
  }

  return (
    <tr className="border-b border-border">
      <td className={`${tdClass} font-medium`}>{rec.symbol}</td>
      <td className={tdClass}>{rec.action}</td>
      <td className={tdClass}>{formatWeight(rec.weight_pct)}</td>
      <td className={tdClass}>{rec.price !== null ? rec.price : "—"}</td>
      <td className={`${tdClass} text-secondary`}>
        {formatIST(rec.approved_at ?? rec.published_at)}
      </td>
      <td className={tdClass}>
        <div className="flex flex-col gap-1">
          <input
            type="text"
            value={remark}
            onChange={(e) => {
              setRemark(e.target.value);
              setRemarkDirty(true);
            }}
            placeholder="Remark for clients"
            disabled={pending}
            className={inputClass}
          />
          {remarkDirty && (
            <button
              type="button"
              onClick={handleSaveRemark}
              disabled={pending}
              className={smallBtn}
            >
              {pending ? "Saving…" : "Save remark"}
            </button>
          )}
        </div>
      </td>
      <td className={tdClass}>
        {!removing ? (
          <button
            type="button"
            onClick={() => setRemoving(true)}
            disabled={pending}
            className={removeBtn}
          >
            Remove
          </button>
        ) : (
          <div className="flex w-full flex-col gap-1">
            <input
              type="text"
              value={removeReason}
              onChange={(e) => setRemoveReason(e.target.value)}
              placeholder="Reason for removal"
              disabled={pending}
              className={inputClass}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRemove}
                disabled={pending}
                className={removeBtn}
              >
                Confirm remove
              </button>
              <button
                type="button"
                onClick={() => {
                  setRemoving(false);
                  setRemoveReason("");
                }}
                disabled={pending}
                className={smallBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}
