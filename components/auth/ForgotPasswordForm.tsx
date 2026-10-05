"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import AuthField from "@/components/auth/AuthField";
import Button from "@/components/ui/Button";
import { forgotPasswordAction } from "@/lib/auth/actions";

type ForgotState = Parameters<typeof forgotPasswordAction>[0];

const initialState: ForgotState = {};

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    forgotPasswordAction,
    initialState,
  );
  const [email, setEmail] = useState(state.fields?.email ?? "");

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
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        placeholder="your@email.com"
        required
        disabled={pending}
      />

      <Button type="submit" variant="primary" size="md" disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </Button>

      <p className="pt-2 text-sm text-secondary">
        Remembered your password?{" "}
        <Link href="/login" className="underline hover:text-foreground">
          Back to log in
        </Link>
      </p>
    </form>
  );
}
