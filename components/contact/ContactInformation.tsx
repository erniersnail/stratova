import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const CONTACTS = [
  { title: "Business Email", desc: "For general business inquiries and partnership discussions.", email: "business@simplicialcapital.com" },
  { title: "Research Inquiries", desc: "For questions about our research, methodology, or data.", email: "research@simplicialcapital.com" },
  { title: "Media", desc: "For press inquiries, interviews, and media requests.", email: "media@simplicialcapital.com" },
  { title: "General Questions", desc: "For all other questions about Simplicial Capital.", email: "info@simplicialcapital.com" },
];

export default function ContactInformation() {
  return (
    <div>
      <SectionHeader label="CONTACT" title="Contact Information" description="Reach out to the right team for your inquiry." centered={false} />
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {CONTACTS.map((c) => (
          <div key={c.title} className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-sm font-medium text-foreground">{c.title}</h3>
            <p className={`${typography.body} mt-2 text-secondary`}>{c.desc}</p>
            <a href={`mailto:${c.email}`} className="mt-3 block text-sm font-medium text-foreground transition-colors hover:text-secondary">{c.email}</a>
          </div>
        ))}
      </div>
    </div>
  );
}