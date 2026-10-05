import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

type PrincipleItem = {
  title: string;
  description: string;
};

type InvestmentPrinciplesProps = {
  items: PrincipleItem[];
};

export default function InvestmentPrinciples({ items }: InvestmentPrinciplesProps) {
  return (
    <div>
      <SectionHeader title="Investment Principles" centered={false} />
      <div className="mt-6 space-y-3">
        {items.map((item, index) => (
          <div
            key={item.title}
            className="flex items-start gap-5 rounded-lg border border-border bg-surface p-6"
          >
            <span className="text-xs font-medium tracking-widest text-tertiary uppercase">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-sm font-medium text-foreground">
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