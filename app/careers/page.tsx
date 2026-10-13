import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/common/PageHeader";
import { typography } from "@/lib/typography";
import { ROLES, type Role } from "@/lib/careers";

export const metadata: Metadata = {
  title: "Careers — Simplical Capital",
  description:
    "Open roles at Simplical Capital. Quantitative research, trading, engineering, marketing, and sales.",
};

function RoleCard({ role }: { role: Role }) {
  return (
    <Link
      href={`/careers/${role.slug}`}
      className="group flex flex-col justify-between rounded-md border border-border bg-surface p-6 transition-colors duration-200 hover:border-foreground/40"
    >
      <div>
        <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground">
          {role.title}
        </h3>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.15em] text-tertiary">
          {role.department} · {role.location}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-secondary">
          {role.blurb}
        </p>
      </div>
      <span className="mt-6 inline-flex items-center text-sm font-medium text-foreground">
        View role
        <span
          aria-hidden
          className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </Link>
  );
}

export default function CareersPage() {
  return (
    <main>
      <Container className="pt-16 pb-0">
        <PageHeader title="Careers" />
      </Container>

      <Section spacing="sm">
        <Container size="default">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((role) => (
              <RoleCard key={role.slug} role={role} />
            ))}
          </div>

          <p
            className={`${typography.body} mt-16 max-w-[640px] text-secondary`}
          >
            Don&apos;t see a role that fits? We still want to hear from you.
            Write to{" "}
            <a
              href="mailto:careers@simplicalcapital.com"
              className="text-foreground underline hover:no-underline"
            >
              careers@simplicalcapital.com
            </a>
            .
          </p>
        </Container>
      </Section>
    </main>
  );
}
