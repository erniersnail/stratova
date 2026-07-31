export type ResearchItem = {
  id: string;
  category: string;
  date: string;
  title: string;
  abstract: string;
  readingTime: string;
  href: string;
};

export const RESEARCH_ITEMS: ResearchItem[] = [
  {
    id: "1",
    category: "Factor Research",
    date: "July 2026",
    title: "Momentum After Earnings: Evidence from U.S. Equities",
    abstract:
      "Examining whether post-earnings momentum persists after controlling for size and sector effects in a comprehensive sample of U.S. listed equities.",
    readingTime: "12 min read",
    href: "/research/momentum-after-earnings",
  },
  {
    id: "2",
    category: "Portfolio Construction",
    date: "June 2026",
    title: "Position Sizing in Concentrated Portfolios",
    abstract:
      "Evaluating different weighting approaches under varying volatility regimes and assessing their impact on risk-adjusted outcomes.",
    readingTime: "10 min read",
    href: "/research/position-sizing",
  },
  {
    id: "3",
    category: "Market Structure",
    date: "May 2026",
    title: "Liquidity and Execution in Indian Mid-Cap Stocks",
    abstract:
      "Studying the relationship between liquidity constraints and systematic portfolio implementation in less liquid segments of the Indian equity market.",
    readingTime: "14 min read",
    href: "/research/liquidity-indian-mid-cap",
  },
  {
    id: "4",
    category: "Methodology",
    date: "April 2026",
    title: "Robustness Testing in Quantitative Research: A Framework",
    abstract:
      "Proposing a standardized framework for evaluating strategy robustness across multiple dimensions including parameter sensitivity, sample periods, and market regimes.",
    readingTime: "18 min read",
    href: "/research/robustness-testing",
  },
  {
    id: "5",
    category: "Factor Research",
    date: "March 2026",
    title: "Value and Quality in Indian Equities",
    abstract:
      "Analyzing the interaction between value and quality factors in the Indian equity market and constructing a combined factor approach.",
    readingTime: "11 min read",
    href: "/research/value-quality-india",
  },
  {
    id: "6",
    category: "Portfolio Construction",
    date: "February 2026",
    title: "Rebalancing Frequency and Turnover Costs",
    abstract:
      "Quantifying the trade-off between rebalancing frequency and transaction costs across different portfolio construction methodologies.",
    readingTime: "9 min read",
    href: "/research/rebalancing-frequency",
  },
  {
    id: "7",
    category: "Market Structure",
    date: "January 2026",
    title: "Market Impact Models for Institutional Execution",
    abstract:
      "Comparing alternative market impact models and their implications for execution strategy design in large-cap U.S. equities.",
    readingTime: "15 min read",
    href: "/research/market-impact-models",
  },
  {
    id: "8",
    category: "Methodology",
    date: "December 2025",
    title: "Handling Survivorship Bias in Historical Backtests",
    abstract:
      "A practical guide to detecting and correcting survivorship bias in equity backtesting datasets and its impact on strategy evaluation.",
    readingTime: "8 min read",
    href: "/research/survivorship-bias",
  },
  {
    id: "9",
    category: "Factor Research",
    date: "November 2025",
    title: "Low Volatility Anomaly in Emerging Markets",
    abstract:
      "Investigating whether the low volatility anomaly documented in developed markets is also present in emerging equity markets.",
    readingTime: "13 min read",
    href: "/research/low-volatility-emerging",
  },
];

export const RESEARCH_CATEGORIES = [
  "All",
  "Factor Research",
  "Portfolio Construction",
  "Market Structure",
  "Methodology",
] as const;