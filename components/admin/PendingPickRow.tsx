"use client";

import { useState, useTransition } from "react";
import {
  approveRecommendation,
  rejectRecommendation,
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
const approveBtn = `${smallBtn} border-foreground bg-foreground text-background hover:opacity-90`;
const rejectBtn = `${smallBtn} text-foreground hover:border-foreground`;
const inputClass =
  "w-full rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground placeholder:text-tertiary focus:border-foreground focus:outline-none";

export default function PendingPickRow({
  rec,
}: {
  rec: AdminRecommendation;
}) {
  const [pending, startTransition] = useTransition();
  const [remark, setRemark] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  function handleApprove() {
    startTransition(async () => {
      try {
        await approveRecommendation(rec.id, remark);
      } catch (err) {
        console.error(err);
        alert("Failed to approve.");
      }
    });
  }

  function handleReject() {
    if (!rejectReason.trim()) {
      alert("Enter a reason before rejecting.");
      return;
    }
    startTransition(async () => {
      try {
        await rejectRecommendation(rec.id, rejectReason);
      } catch (err) {
        console.error(err);
        alert("Failed to reject.");
      }
    });
  }

  return (
    <tr className="border-b border-border">
      <td className={`${tdClass} font-medium`}>{rec.symbol}</td>
      <td className={tdClass}>{rec.action}</td>
      <td className={tdClass}>{formatWeight(rec.weight_pct)}</td>
      <td className={tdClass}>{rec.price !== null ? rec.price : "—"}</td>
      <td className={`${tdClass} text-secondary`}>{formatIST(rec.as_of)}</td>
      <td className={tdClass}>
        <input
          type="text"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Optional remark for clients"
          disabled={pending}
          className={inputClass}
        />
      </td>
      <td className={tdClass}>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleApprove}
            disabled={pending}
            className={approveBtn}
          >
            {pending ? "…" : "Approve"}
          </button>
          {!rejecting ? (
            <button
              type="button"
              onClick={() => setRejecting(true)}
              disabled={pending}
              className={rejectBtn}
            >
              Reject
            </button>
          ) : (
            <div className="flex w-full flex-col gap-1">
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection"
                disabled={pending}
                className={inputClass}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={pending}
                  className={rejectBtn}
                >
                  Confirm reject
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRejecting(false);
                    setRejectReason("");
                  }}
                  disabled={pending}
                  className={smallBtn}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
