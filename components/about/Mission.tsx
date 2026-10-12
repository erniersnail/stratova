import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const MISSION_ITEMS = [
  {
    number: "01",
    title: "What we do",
    description:
      "We develop systematic investment strategies based on empirical research. Our work spans quantitative screening, factor modeling, portfolio construction, and risk management for individual investors.",
  },
  {
    number: "02",
    title: "How we work",
    description:
      "Every research project follows a structured process from hypothesis to publication. We test ideas rigorously, document assumptions transparently, and publish results for independent verification.",
  },
];

export default function Mission() {
  return (
    <div>
      <SectionHeader
        title="Our Mission"
        description="To advance the practice of quantitative investment research through rigorous methodology, transparent reporting, and disciplined portfolio construction."
        centered={false}
      />
      <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
        {MISSION_ITEMS.map((item) => (
          <div key={item.number} className="grid grid-cols-[64px_1fr] gap-4">
            <span className="text-3xl font-light leading-none text-tertiary">
              {item.number}
            </span>
            <div>
              <h3 className="text-lg font-medium text-foreground">
                {item.title}
              </h3>
              <p className={`${typography.body} mt-2 text-secondary`}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}