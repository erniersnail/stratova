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
      <div className="mt-8 space-y-8">
        {VALUES.map((v, index) => (
          <div key={v.number}>
            {index > 0 && <hr className="mb-8 border-t border-border" />}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[80px_1fr]">
              <span className="text-4xl font-light leading-none text-tertiary">
                {v.number}
              </span>
              <div>
                <h3 className="text-xl font-medium">{v.title}</h3>
                <p className={`${typography.body} mt-2 text-secondary`}>
                  {v.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}