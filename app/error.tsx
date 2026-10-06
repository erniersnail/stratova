"use client";

import { useEffect } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <Section spacing="md">
        <Container size="narrow">
          <PageHeader
            title="Something went wrong"
            description="An unexpected error occurred. Try again, or return home."
          />
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              variant="primary"
              onClick={() => reset()}
            >
              Try again
            </Button>
            <Button href="/" variant="secondary">
              Go home
            </Button>
          </div>
          <p className="mt-8 text-sm text-secondary">
            Still stuck?{" "}
            <Link href="/contact" className="underline hover:no-underline">
              Contact us
            </Link>
            .
          </p>
        </Container>
      </Section>
    </main>
  );
}
