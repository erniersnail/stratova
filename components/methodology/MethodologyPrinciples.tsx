import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const PRINCIPLES = [
  {
    number: "01",
    title: "Evidence over opinion",
    description:
      "Every investment hypothesis must be grounded in reproducible empirical evidence. We do not rely on market narratives, macroeconomic forecasts, or intuition. Decisions emerge from data, testing, and observable outcomes.",
  },
  {
    number: "02",
    title: "Repeatability",
    description:
      "A strategy is only valid if its results can be reproduced by an independent researcher using the same methodology and data. All research is documented with sufficient detail to enable independent verification.",
  },
  {
    number: "03",
    title: "Transparency",
    description:
      "We disclose our assumptions, methodology, data sources, and known limitations. Transparency is not an afterthought — it is a design requirement that applies to every stage of the research process.",
  },
  {
    number: "04",
    title: "Continuous improvement",
    description:
      "Markets evolve, and research must evolve with them. Strategies are monitored, reviewed, and refined as new data, techniques, and academic research become available.",
  },
];

export default function MethodologyPrinciples() {
  return (
    <div>
      <SectionHeader
        label="PRINCIPLES"
        title="Core Research Principles"
        description="Four principles guide every research decision at Stratova Quant."
        centered={false}
      />
      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
        {PRINCIPLES.map((principle) => (
          <div key={principle.number}>
            <span className="text-4xl font-light leading-none text-border">
              {principle.number}
            </span>
            <h3 className="mt-4 text-xl font-medium">{principle.title}</h3>
            <p className={`${typography.body} mt-2 text-secondary`}>
              {principle.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}