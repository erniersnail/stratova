import Link from "next/link";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main>
      <Section spacing="md">
        <Container size="narrow">
          <PageHeader
            title="Not found"
            description="That page doesn't exist or has moved."
          />
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/" variant="primary">
              Go home
            </Button>
            <Button href="/strategies" variant="secondary">
              Browse strategies
            </Button>
          </div>
          <p className="mt-8 text-sm text-secondary">
            Looking for research?{" "}
            <Link href="/research" className="underline hover:no-underline">
              Latest research
            </Link>
            .
          </p>
        </Container>
      </Section>
    </main>
  );
}
