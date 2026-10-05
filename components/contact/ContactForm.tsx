"use client";

import { useActionState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { submitContactAction } from "@/lib/contact/actions";

type ContactFormState = Parameters<typeof submitContactAction>[0];

const initialState: ContactFormState = {};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactAction,
    initialState,
  );

  // Remount the fields on success so a submitted form clears itself.
  // Uncontrolled inputs + key remount keeps error values (via defaultValue)
  // without setState-in-effect. See react.dev "you might not need an effect".
  const formKey = state.success ? "submitted" : "editing";

  return (
    <form key={formKey} action={formAction} className="space-y-4" noValidate>
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

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Name</label>
        <Input id="name" name="name" placeholder="Your name" required disabled={pending} defaultValue={state.fields?.name} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
        <Input id="email" name="email" type="email" placeholder="your@email.com" required disabled={pending} defaultValue={state.fields?.email} autoComplete="email" />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1.5">Company</label>
        <Input id="company" name="company" placeholder="Company name" disabled={pending} defaultValue={state.fields?.company} autoComplete="organization" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">Message</label>
        <textarea id="message" name="message" rows={6} required disabled={pending} placeholder="How can we help?" defaultValue={state.fields?.message} className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-tertiary resize-none transition-colors duration-200 focus:border-foreground focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-tertiary" />
      </div>
      <Button type="submit" variant="primary" size="md" disabled={pending}>
        {pending ? "Sending…" : "Send Message"}
      </Button>

      <p className="text-sm text-secondary">
        Prefer email?{" "}
        <a href="mailto:info@stratovaquant.com" className="underline hover:text-foreground">
          info@stratovaquant.com
        </a>
      </p>
    </form>
  );
}
