"use client";

import { useState, useTransition } from "react";
import { cancelSubscription } from "@/lib/subscriptions/actions";

export default function CancelSubscriptionButton({
  subscriptionId,
}: {
  subscriptionId: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    const confirmed = window.confirm(
      "Cancel this subscription?\n\nAccess ends immediately. No refund is issued for the current month once recommendations have been delivered.\n\nConfirm cancellation?",
    );
    if (!confirmed) return;

    startTransition(async () => {
      setError(null);
      const res = await cancelSubscription(subscriptionId);
      if (res.error) setError(res.error);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="text-sm text-secondary underline hover:text-foreground hover:no-underline disabled:opacity-50"
      >
        {pending ? "Cancelling…" : "Cancel"}
      </button>
      {error && (
        <span className="ml-2 text-xs text-red-600">{error}</span>
      )}
    </>
  );
}
