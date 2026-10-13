import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { typography } from "@/lib/typography";
import { ROLES } from "@/lib/careers";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ROLES.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const role = ROLES.find((r) => r.slug === slug);
  if (!role) return { title: "Role not found — Simplical Capital" };
  return {
    title: `${role.title} — Simplical Capital`,
    description: role.blurb,
  };
}

export default async function RolePage({ params }: PageProps) {
  const { slug } = await params;
  const role = ROLES.find((r) => r.slug === slug);
  if (!role) notFound();

  const subject = encodeURIComponent(`Application: ${role.title}`);
  const mailto = `mailto:careers@simplicalcapital.com?subject=${subject}`;

  return (
    <main>
      <Container size="reading" className="pt-16 pb-0">
        <Link
          href="/careers"
          className="text-sm text-secondary transition-colors duration-200 hover:text-foreground"
        >
          ← All roles
        </Link>

        <h1 className={`${typography.h1} mt-8 text-foreground`}>
          {role.title}
        </h1>
        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.15em] text-tertiary">
          {role.department} · {role.location} · {role.type}
        </p>
      </Container>

      <Section spacing="sm">
        <Container size="reading">
          <div className="space-y-10">
            <div className="space-y-5">
              {role.about.map((para) => (
                <p
                  key={para}
                  className={`${typography.body} text-secondary`}
                >
                  {para}
                </p>
              ))}
            </div>

            <div>
              <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-foreground">
                What you will do
              </h2>
              <ul className="mt-4 space-y-3">
                {role.responsibilities.map((r) => (
                  <li
                    key={r}
                    className="flex gap-3 text-sm leading-relaxed text-secondary"
                  >
                    <span
                      aria-hidden
                      className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-tertiary"
                    />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-foreground">
                What we look for
              </h2>
              <ul className="mt-4 space-y-3">
                {role.requirements.map((r) => (
                  <li
                    key={r}
                    className="flex gap-3 text-sm leading-relaxed text-secondary"
                  >
                    <span
                      aria-hidden
                      className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-tertiary"
                    />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-border bg-surface px-6 py-8">
              <h2 className={`${typography.h3} text-foreground`}>
                How to apply
              </h2>
              <p
                className={`${typography.body} mt-4 max-w-[600px] text-secondary`}
              >
                Send your CV and a short note about what you want to work on
                to{" "}
                <a
                  href={mailto}
                  className="text-foreground underline hover:no-underline"
                >
                  careers@simplicalcapital.com
                </a>
                .
              </p>
              <Link
                href={mailto}
                className="mt-6 inline-flex items-center rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity duration-200 hover:opacity-90"
              >
                Apply for this role
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
