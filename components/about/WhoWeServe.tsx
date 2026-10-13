import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const AUDIENCES = [
  {
    number: "01",
    title: "Investors",
    desc: "Retail investors seeking systematic, rules-based exposure to Indian and U.S. equity markets without discretionary bias.",
  },
  {
    number: "02",
    title: "Institutional Investors",
    desc: "Pension funds, endowments, and family offices seeking systematic investment strategies and rigorous research.",
  },
  {
    number: "03",
    title: "Asset Managers",
    desc: "Professional investment managers evaluating quantitative approaches to complement existing portfolio construction processes.",
  },
  {
    number: "04",
    title: "Consultants",
    desc: "Financial consultants and advisors who need evidence-based research to support investment recommendations.",
  },
];

export default function WhoWeServe() {
  return (
    <div>
      <SectionHeader
        title="Who We Serve"
        description="Our research is designed for investors who want a systematic, evidence-based approach to equity markets — whether managing personal capital or institutional portfolios."
        centered={false}
      />
      <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
        {AUDIENCES.map((a) => (
          <div key={a.number} className="grid grid-cols-[64px_1fr] gap-4">
            <span className="text-3xl font-light leading-none text-tertiary">
              {a.number}
            </span>
            <div>
              <h3 className="text-lg font-medium text-foreground">{a.title}</h3>
              <p className={`${typography.body} mt-2 text-secondary`}>
                {a.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}