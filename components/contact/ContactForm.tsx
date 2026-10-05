"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// ─────────────────────────────────────────────────────────────────────────────
// DISABLED (Phase 1): no submission backend exists yet.
// The handler was previously a no-op that silently discarded user input.
// Inputs are disabled, the submit handler is removed, and a visible notice is
// shown so no visitor is led to believe a message was delivered.
// Re-enable in Phase 2 once the persistence layer exists.
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });

  const disabledClass = " disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-tertiary";

  return (
    <form className="space-y-4" aria-describedby="contact-form-notice">
      <div className="rounded-md border border-border bg-surface p-4">
        <p id="contact-form-notice" className="text-sm text-secondary">
          <span className="font-medium text-foreground">Coming soon.</span>{" "}
          The contact form is temporarily unavailable. Please email{" "}
          <a href="mailto:info@stratovaquant.com" className="underline hover:text-foreground">
            info@stratovaquant.com
          </a>{" "}
          and we will respond directly.
        </p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Name</label>
        <Input id="name" placeholder="Your name" required disabled value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={disabledClass} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
        <Input id="email" type="email" placeholder="your@email.com" required disabled value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={disabledClass} />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1.5">Company</label>
        <Input id="company" placeholder="Company name" disabled value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className={disabledClass} />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">Message</label>
        <textarea id="message" rows={6} required disabled placeholder="How can we help?" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={`w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-tertiary resize-none transition-colors duration-200 focus:border-foreground focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-tertiary`} />
      </div>
      <Button type="submit" variant="primary" size="md" disabled>
        Send Message
      </Button>
    </form>
  );
}