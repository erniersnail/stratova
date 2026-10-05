"use client";

import { useActionState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { subscribeNewsletterAction } from "@/lib/newsletter/actions";

type NewsletterFormState = Parameters<typeof subscribeNewsletterAction>[0];

const initialState: NewsletterFormState = {};

export default function NewsletterForm() {
  const [state, formAction, pending] = useActionState(
    subscribeNewsletterAction,
    initialState,
  );

  // Remount the field on success so a subscribed form clears itself.
  const formKey = state.success ? "submitted" : "editing";

  return (
    <div className="mx-auto mt-4 max-w-[480px]">
      <form
        key={formKey}
        action={formAction}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
        noValidate
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          disabled={pending}
          defaultValue={state.fields?.email}
          autoComplete="email"
          className="flex-1 disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-tertiary"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={pending}
          className="shrink-0"
        >
          {pending ? "Subscribing…" : "Subscribe"}
        </Button>
      </form>

      {state.error && (
        <div role="alert" className="mt-3 rounded-md border border-border bg-surface px-4 py-3">
          <p className="text-sm text-secondary">{state.error}</p>
        </div>
      )}
      {state.success && (
        <div role="status" className="mt-3 rounded-md border border-border bg-surface px-4 py-3">
          <p className="text-sm text-foreground">{state.success}</p>
        </div>
      )}
    </div>
  );
}
