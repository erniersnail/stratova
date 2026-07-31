import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const AUDIENCES = [
  { title: "Institutional Investors", desc: "Pension funds, endowments, and family offices seeking systematic investment strategies and rigorous research." },
  { title: "Asset Managers", desc: "Professional investment managers evaluating quantitative approaches to complement existing portfolio construction processes." },
  { title: "Researchers", desc: "Academics and quantitative researchers interested in empirical evidence, methodology, and reproducible results." },
  { title: "Consultants", desc: "Financial consultants and advisors who need evidence-based research to support investment recommendations." },
];

export default function WhoWeServe() {
  return (
    <div>
      <SectionHeader label="AUDIENCE" title="Who We Serve" description="Our research is designed for sophisticated investors who value evidence, transparency, and methodological rigor." centered={false} />
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {AUDIENCES.map((a) => (
          <div key={a.title} className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-sm font-medium text-foreground">{a.title}</h3>
            <p className={`${typography.body} mt-2 text-secondary`}>{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}