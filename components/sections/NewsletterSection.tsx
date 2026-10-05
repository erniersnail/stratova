import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// ─────────────────────────────────────────────────────────────────────────────
// DISABLED (Phase 1): no subscription backend exists yet.
// This form previously had no onSubmit handler and no action, so submitting it
// triggered a native browser GET navigation and silently discarded the address.
// Inputs are disabled and a visible notice is shown so no visitor is led to
// believe a subscription was created.
// Re-enable in Phase 2 once the persistence layer exists.
// ─────────────────────────────────────────────────────────────────────────────

export default function NewsletterSection() {
  return (
    <Section spacing="sm">
      <Container size="narrow" className="text-center">
        <SectionHeader
          label="UPDATES"
          title="Receive New Research"
          description="Receive notifications whenever new research papers, strategy updates, or methodology notes are published."
        />

        <div className="mx-auto mt-6 max-w-[480px] rounded-md border border-border bg-surface p-4">
          <p id="newsletter-notice" className="text-sm text-secondary">
            <span className="font-medium text-foreground">Coming soon.</span>{" "}
            Newsletter sign-up is temporarily unavailable. It will be reopened when
            subscriptions open.
          </p>
        </div>

        <form
          className="mx-auto mt-4 flex max-w-[480px] flex-col gap-3 sm:flex-row sm:items-center"
          aria-describedby="newsletter-notice"
        >
          <label htmlFor="email-input" className="sr-only">
            Email address
          </label>
          <Input
            id="email-input"
            type="email"
            placeholder="Enter your email"
            required
            disabled
            className="flex-1 disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-tertiary"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled
            className="shrink-0"
          >
            Subscribe
          </Button>
        </form>

        <p className="mt-4 text-xs text-secondary">
          No spam. Research updates only. You may unsubscribe at any time.
        </p>
      </Container>
    </Section>
  );
}