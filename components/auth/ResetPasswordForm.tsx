"use client";

import { useActionState, useState } from "react";
import AuthField from "@/components/auth/AuthField";
import Button from "@/components/ui/Button";
import { resetPasswordAction } from "@/lib/auth/actions";
import type { AuthState } from "@/lib/auth/constants";

const initialState: AuthState = {};

export default function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    initialState,
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

      <AuthField
        id="password"
        label="New password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        placeholder="At least 8 characters"
        required
        disabled={pending}
      />

      <AuthField
        id="confirmPassword"
        label="Confirm new password"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        placeholder="Repeat your new password"
        required
        disabled={pending}
      />

      <Button type="submit" variant="primary" size="md" disabled={pending}>
        {pending ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
