"use client";

import { useActionState, useEffect, useState } from "react";
import AuthField from "@/components/auth/AuthField";
import Button from "@/components/ui/Button";
import { updateProfileAction, type ProfileState } from "@/lib/auth/actions";

const initialState: ProfileState = {};

const SUCCESS_TIMEOUT_MS = 4000;

// Self-hiding wrapper: mounts visible, hides itself after `ms`. The only
// setState is inside the timer callback, never in an effect body.
function HideAfter({
  ms,
  children,
}: {
  ms: number;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  if (!visible) return null;
  return <>{children}</>;
}

type ProfileFormProps = {
  initialFullName: string;
  initialPhone: string;
};

export default function ProfileForm({
  initialFullName,
  initialPhone,
}: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState,
  );
  const [fullName, setFullName] = useState(
    state.fields?.fullName ?? initialFullName,
  );
  const [phone, setPhone] = useState(state.fields?.phone ?? initialPhone);
  // Success auto-dismiss: each successful submit renders a fresh
  // <HideAfter> (keyed by message identity) that hides itself after 4s.
  // Typing in either field sets `dismissed`, unmounting the message.
  // A new success clears `dismissed`. Errors persist until resubmit.
  const [dismissed, setDismissed] = useState(false);
  const [lastSuccess, setLastSuccess] = useState<string | undefined>(
    undefined,
  );

  if (state.success !== lastSuccess) {
    setLastSuccess(state.success);
    if (state.success) {
      setDismissed(false);
    }
  }

  const showSuccess = Boolean(state.success) && !dismissed;

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    setDismissed(true);
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setDismissed(true);
  };

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.error && (
        <div
          role="alert"
          className="rounded-md border border-border bg-surface px-4 py-3"
        >
          <p className="text-sm text-secondary">{state.error}</p>
        </div>
      )}

      {showSuccess && (
        <HideAfter key={state.success} ms={SUCCESS_TIMEOUT_MS}>
          <div
            role="status"
            className="rounded-md border border-border bg-surface px-4 py-3"
          >
            <p className="text-sm text-foreground">{state.success}</p>
          </div>
        </HideAfter>
      )}

      <AuthField
        id="fullName"
        label="Full name"
        value={fullName}
        onChange={handleFullNameChange}
        autoComplete="name"
        placeholder="Your full name"
        required
        disabled={pending}
      />

      <AuthField
        id="phone"
        label="Phone (optional)"
        type="tel"
        value={phone}
        onChange={handlePhoneChange}
        autoComplete="tel"
        placeholder="+919876543210"
        disabled={pending}
      />

      <Button type="submit" variant="primary" size="md" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
