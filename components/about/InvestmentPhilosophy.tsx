import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const BELIEFS = [
  { title: "Evidence over opinion", desc: "Investment decisions emerge from data, testing, and observable outcomes rather than narratives or intuition." },
  { title: "Process over prediction", desc: "Disciplined investment processes are more reliable than attempts to forecast short-term market movements." },
  { title: "Transparency over opacity", desc: "Assumptions, methodology, and limitations are disclosed openly. Transparency is a design requirement, not an afterthought." },
  { title: "Continuous improvement", desc: "Markets evolve, and research must evolve with them. Strategies are monitored, reviewed, and refined continuously." },
];

export default function InvestmentPhilosophy() {
  return (
    <div>
      <SectionHeader label="BELIEFS" title="What We Believe" description="Four principles guide every research decision at Stratova Quant." centered={false} />
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {BELIEFS.map((b) => (
          <div key={b.title} className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-sm font-medium text-foreground">{b.title}</h3>
            <p className={`${typography.body} mt-2 text-secondary`}>{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}