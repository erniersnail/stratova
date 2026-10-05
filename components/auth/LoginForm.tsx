"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import AuthField from "@/components/auth/AuthField";
import Button from "@/components/ui/Button";
import { signInAction } from "@/lib/auth/actions";
import type { AuthState } from "@/lib/auth/constants";

const initialState: AuthState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);
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

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="mb-1.5 text-sm text-secondary underline hover:text-foreground"
        >
          Forgot password?
        </Link>
      </div>
      <AuthField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
        placeholder="Your password"
        required
        disabled={pending}
      />

      <Button type="submit" variant="primary" size="md" disabled={pending}>
        {pending ? "Logging in…" : "Log in"}
      </Button>

      <p className="pt-2 text-sm text-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline hover:text-foreground">
          Join the waitlist
        </Link>
      </p>
    </form>
  );
}
