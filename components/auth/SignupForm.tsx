"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import AuthField from "@/components/auth/AuthField";
import Button from "@/components/ui/Button";
import { signUpAction } from "@/lib/auth/actions";
import type { AuthState } from "@/lib/auth/constants";

const initialState: AuthState = {};

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signUpAction, initialState);
  const [fullName, setFullName] = useState(state.fields?.fullName ?? "");
  const [email, setEmail] = useState(state.fields?.email ?? "");
  const [password, setPassword] = useState("");

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

      <AuthField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        placeholder="At least 8 characters"
        minLength={8}
        required
        disabled={pending}
      />

      <div className="flex items-start gap-2.5 pt-1">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          disabled={pending}
          className="mt-1 h-4 w-4 shrink-0 rounded-sm border-border accent-foreground"
        />
        <label htmlFor="consent" className="text-sm text-secondary">
          I agree to the{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </label>
      </div>

      <Button type="submit" variant="primary" size="md" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>

      <p className="pt-2 text-sm text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="underline hover:text-foreground">
          Log in
        </Link>
      </p>
    </form>
  );
}
