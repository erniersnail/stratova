import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const AUDIENCES = [
  {
    number: "01",
    title: "Institutional Investors",
    desc: "Pension funds, endowments, and family offices seeking systematic investment strategies and rigorous research.",
  },
  {
    number: "02",
    title: "Asset Managers",
    desc: "Professional investment managers evaluating quantitative approaches to complement existing portfolio construction processes.",
  },
  {
    number: "03",
    title: "Researchers",
    desc: "Academics and quantitative researchers interested in empirical evidence, methodology, and reproducible results.",
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
        description="Our research is designed for sophisticated investors who value evidence, transparency, and methodological rigor."
        centered={false}
      />
      <div className="mt-8 space-y-8">
        {AUDIENCES.map((a, index) => (
          <div key={a.number}>
            {index > 0 && <hr className="mb-8 border-t border-border" />}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[80px_1fr]">
              <span className="text-4xl font-light leading-none text-tertiary">
                {a.number}
              </span>
              <div>
                <h3 className="text-xl font-medium">{a.title}</h3>
                <p className={`${typography.body} mt-2 text-secondary`}>
                  {a.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}