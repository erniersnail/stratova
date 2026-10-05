import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function NewsletterSection() {
  return (
    <Section spacing="sm">
      <Container size="narrow" className="text-center">
        <SectionHeader
          label="UPDATES"
          title="Receive New Research"
          description="Receive notifications whenever new research papers, strategy updates, or methodology notes are published."
        />

        <form className="mx-auto mt-6 flex max-w-[480px] flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="email-input" className="sr-only">
            Email address
          </label>
          <Input
            id="email-input"
            type="email"
            placeholder="Enter your email"
            required
            className="flex-1"
          />
          <Button type="submit" variant="primary" size="md" className="shrink-0">
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