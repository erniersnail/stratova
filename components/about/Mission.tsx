import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const MISSION_ITEMS = [
  {
    number: "01",
    title: "What we do",
    description:
      "We develop systematic investment strategies based on empirical research. Our work spans quantitative screening, factor modeling, portfolio construction, and risk management across U.S. and Indian equity markets.",
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
      <div className="mt-8 space-y-8">
        {MISSION_ITEMS.map((item, index) => (
          <div key={item.number}>
            {index > 0 && <hr className="mb-8 border-t border-border" />}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[80px_1fr]">
              <span className="text-4xl font-light leading-none text-tertiary">
                {item.number}
              </span>
              <div>
                <h3 className="text-xl font-medium">{item.title}</h3>
                <p className={`${typography.body} mt-2 text-secondary`}>
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}