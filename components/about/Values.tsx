import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const VALUES = [
  { title: "Rigor", desc: "We apply the highest standards of empirical research, statistical analysis, and documentation to every project." },
  { title: "Transparency", desc: "We disclose assumptions, methodology, and limitations openly. Our research is designed to be understood and verified." },
  { title: "Independence", desc: "We do not manage client assets, sell products, or accept compensation tied to investment performance. Our only obligation is to the research." },
  { title: "Discipline", desc: "We follow structured processes consistently. Intuition, narrative, and short-term market movements do not influence our research decisions." },
];

export default function Values() {
  return (
    <div>
      <SectionHeader label="VALUES" title="Core Values" description="The principles that define how we work and what we produce." centered={false} />
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-sm font-medium text-foreground">{v.title}</h3>
            <p className={`${typography.body} mt-2 text-secondary`}>{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}