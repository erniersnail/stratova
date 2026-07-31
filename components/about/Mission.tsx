import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

export default function Mission() {
  return (
    <div>
      <SectionHeader label="MISSION" title="Our Mission" description="To advance the practice of quantitative investment research through rigorous methodology, transparent reporting, and disciplined portfolio construction." centered={false} />
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-6">
          <h3 className="text-sm font-medium text-foreground">What we do</h3>
          <p className={`${typography.body} mt-2 text-secondary`}>We develop systematic investment strategies based on empirical research. Our work spans quantitative screening, factor modeling, portfolio construction, and risk management across U.S. and Indian equity markets.</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          <h3 className="text-sm font-medium text-foreground">How we work</h3>
          <p className={`${typography.body} mt-2 text-secondary`}>Every research project follows a structured process from hypothesis to publication. We test ideas rigorously, document assumptions transparently, and publish results for independent verification.</p>
        </div>
      </div>
    </div>
  );
}