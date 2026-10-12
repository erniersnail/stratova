import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const VALUES = [
  {
    number: "01",
    title: "Rigor",
    desc: "We apply the highest standards of empirical research, statistical analysis, and documentation to every project.",
  },
  {
    number: "02",
    title: "Curiosity",
    desc: "We are genuinely interested in how markets work and are always exploring new datasets, techniques, and academic research that could improve our understanding.",
  },
  {
    number: "03",
    title: "Independence",
    desc: "We do not manage client assets, sell products, or accept compensation tied to investment performance. Our only obligation is to the research.",
  },
  {
    number: "04",
    title: "Discipline",
    desc: "We follow structured processes consistently. Intuition, narrative, and short-term market movements do not influence our research decisions.",
  },
];

export default function Values() {
  return (
    <div>
      <SectionHeader
        title="Core Values"
        description="The principles that define how we work and what we produce."
        centered={false}
      />
      <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
        {VALUES.map((v) => (
          <div key={v.number} className="grid grid-cols-[64px_1fr] gap-4">
            <span className="text-3xl font-light leading-none text-tertiary">
              {v.number}
            </span>
            <div>
              <h3 className="text-lg font-medium text-foreground">{v.title}</h3>
              <p className={`${typography.body} mt-2 text-secondary`}>
                {v.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}