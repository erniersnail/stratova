import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { typography } from "@/lib/typography";
import { ROLES } from "@/lib/careers";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ROLES.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const role = ROLES.find((r) => r.slug === slug);
  if (!role) return { title: "Role not found — Simplicial Capital" };
  return { title: `${role.title} — Simplicial Capital`, description: role.blurb };
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold tracking-[0.15em] text-tertiary uppercase">
      {children}
    </span>
  );
}

export default async function RolePage({ params }: PageProps) {
  const { slug } = await params;
  const role = ROLES.find((r) => r.slug === slug);
  if (!role) notFound();
  const subject = encodeURIComponent(`Application: ${role.title}`);
  const mailto = `mailto:careers@simplicialcapital.com?subject=${subject}`;
  return (
    <main>
      <Container size="default" className="pt-16 pb-0">
        <Link href="/careers" className="text-sm text-secondary transition-colors duration-200 hover:text-foreground">
          ← All roles
        </Link>
        <h1 className={`${typography.h1} mt-8 text-foreground`}>{role.title}</h1>
        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.15em] text-tertiary">
          {role.department} · {role.location} · {role.type}
        </p>
      </Container>
      <Section spacing="sm">
        <Container size="default">
          <div className="space-y-14">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr] md:gap-12">
              <div className="pt-1"><Label>About</Label></div>
              <div className="max-w-[680px] space-y-5">
                {role.about.map((para) => (
                  <p key={para} className={`${typography.body} text-secondary`}>{para}</p>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr] md:gap-12">
              <div className="pt-1"><Label>What you will do</Label></div>
              <ul className="max-w-[680px] space-y-3">
                {role.responsibilities.map((r) => (
                  <li key={r} className="flex gap-3 text-sm leading-relaxed text-secondary">
                    <span aria-hidden className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-tertiary" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr] md:gap-12">
              <div className="pt-1"><Label>What we look for</Label></div>
              <ul className="max-w-[680px] space-y-3">
                {role.requirements.map((r) => (
                  <li key={r} className="flex gap-3 text-sm leading-relaxed text-secondary">
                    <span aria-hidden className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-tertiary" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr] md:gap-12">
              <div className="pt-1"><Label>How to apply</Label></div>
              <p className={`${typography.body} max-w-[680px] text-secondary`}>
                Send your CV and a short note about what you want to work on to{" "}
                <a href={mailto} className="text-foreground underline hover:no-underline">
                  careers@simplicialcapital.com
                </a>
                .
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
