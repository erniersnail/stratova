import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/common/SectionHeader";
import NewsletterForm from "@/components/sections/NewsletterForm";

export default function NewsletterSection() {
  return (
    <Section spacing="sm">
      <Container size="narrow" className="text-center">
        <SectionHeader
          label="UPDATES"
          title="Receive New Research"
          description="Receive notifications whenever new research papers, strategy updates, or methodology notes are published."
        />

        <NewsletterForm />

        <p className="mt-4 text-xs text-secondary">
          No spam. Research updates only. You may unsubscribe at any time.
        </p>
      </Container>
    </Section>
  );
}