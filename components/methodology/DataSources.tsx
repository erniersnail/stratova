import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const DATA_CATEGORIES = [
  {
    number: "01",
    title: "Market Data",
    description:
      "Continuous ingestion of equity pricing and volume across NSE and NASDAQ-listed securities. Data flows through validation, normalization, and corporate-action adjustment before entering the research pipeline.",
  },
  {
    number: "02",
    title: "Feature Construction",
    description:
      "Raw market data is transformed into normalized cross-sectional and time-series features through a defined feature engineering pipeline. Feature distributions are monitored for stability and consistency.",
  },
  {
    number: "03",
    title: "Reference Data",
    description:
      "Index constituents, benchmark levels, and corporate-action records synchronized daily. Point-in-time snapshots preserve historical universe composition for backtesting.",
  },
];

export default function DataSources() {
  return (
    <div>
      <SectionHeader
        title="Data Infrastructure"
        description="Our data pipeline ingests, validates, and normalizes market information into structured features for systematic signal construction."
        centered={false}
      />
      <div className="mt-8 space-y-8">
        {DATA_CATEGORIES.map((category, index) => (
          <div key={category.number}>
            {index > 0 && <hr className="mb-8 border-t border-border" />}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[80px_1fr]">
              <span className="text-4xl font-light leading-none text-tertiary">
                {category.number}
              </span>
              <div>
                <h3 className="text-xl font-medium">{category.title}</h3>
                <p className={`${typography.body} mt-2 text-secondary`}>
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}