import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

type StrategyOverviewProps = {
  paragraphs: string[];
};

export default function StrategyOverview({ paragraphs }: StrategyOverviewProps) {
  return (
    <div>
      <SectionHeader title="Strategy Overview" centered={false} />
      <div className="mt-6 space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={`${typography.body} text-secondary`}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}