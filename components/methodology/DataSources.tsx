import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const DATA_CATEGORIES = [
  {
    title: "Market Data",
    description:
      "Daily and intraday pricing, volume, and bid-ask spreads for equities listed on major exchanges. Data is sourced from reputable market data providers and validated against independent sources.",
  },
  {
    title: "Fundamental Data",
    description:
      "Financial statements, earnings reports, and accounting data including revenue, earnings, book value, cash flow, and segment-level disclosures. Historical data is adjusted for corporate actions and accounting changes.",
  },
  {
    title: "Corporate Actions",
    description:
      "Dividends, stock splits, mergers, acquisitions, spin-offs, and other corporate events that affect security pricing and portfolio construction. All actions are validated and applied consistently across the dataset.",
  },
  {
    title: "Macroeconomic Data",
    description:
      "Interest rates, inflation, GDP, employment, and other macroeconomic indicators. Used for regime analysis and understanding the broader economic context in which strategies operate.",
  },
  {
    title: "Alternative Data",
    description:
      "Selected non-traditional datasets including sentiment indicators, supply chain data, and industry-specific metrics. Alternative data is evaluated for incremental value before integration into the research process.",
  },
];

export default function DataSources() {
  return (
    <div>
      <SectionHeader
        label="DATA"
        title="Data Sources"
        description="Research quality depends on data quality. We source data from established providers and validate it rigorously."
        centered={false}
      />
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {DATA_CATEGORIES.map((category) => (
          <div key={category.title} className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-sm font-medium text-foreground">
              {category.title}
            </h3>
            <p className={`${typography.body} mt-2 text-secondary`}>
              {category.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}