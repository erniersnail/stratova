"use client";

import { useActionState, useState } from "react";
import AuthField from "@/components/auth/AuthField";
import Button from "@/components/ui/Button";
import { updateProfileAction, type ProfileState } from "@/lib/auth/actions";

const initialState: ProfileState = {};

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

      {state.success && (
        <div
          role="status"
          className="rounded-md border border-border bg-surface px-4 py-3"
        >
          <p className="text-sm text-foreground">{state.success}</p>
        </div>
      )}

      <AuthField
        id="fullName"
        label="Full name"
        value={fullName}
        onChange={setFullName}
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
        onChange={setPhone}
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
