export type StrategyFAQ = {
  question: string;
  answer: string;
};

export type Strategy = {
  slug: string;
  title: string;
  category: string;
  status: string;
  researchPeriod: string;
  description: string;
  heroTitle: string;
  heroDescription: string;
  region: "us" | "india";
  benchmarkLabel: string;
  overview: string[];
  performanceMetrics: {
    label: string;
    value: string;
    note?: string;
  }[];
  equityCurve: {
    labels: string[];
    strategy: number[];
    benchmark: number[];
  };
  drawdown: {
    labels: string[];
    strategy: number[];
    benchmark: number[];
  };
  annualReturns: {
    year: string;
    strategy: string;
    benchmark: string;
  }[];
  investmentPrinciples: {
    title: string;
    description: string;
  }[];
  faqs: StrategyFAQ[];
  riskDisclosure: string;
};

export const STRATEGIES: Strategy[] = [
  {
    slug: "stratova-us-equity-leadership",
    title: "Stratova U.S. Equity Leadership Strategy",
    category: "Nasdaq U.S. Equities",
    status: "Production",
    researchPeriod: "2011–2025",
    region: "us",
    benchmarkLabel: "QQQ",
    description:
      "A systematic quantitative investment strategy that selects a concentrated portfolio of Nasdaq stocks with the greatest sustained dollar-volume leadership, ranked by 90-day median dollar volume.",
    heroTitle: "Stratova U.S. Equity Leadership Strategy",
    heroDescription:
      "A concentrated Nasdaq equity-selection framework built around persistent trading-value leadership, disciplined semiannual review, and long-term capital compounding.",
    overview: [
      "The Stratova U.S. Equity Leadership Strategy is a concentrated Nasdaq equity-selection framework built around a deliberately simple idea: persistent trading-value leadership is evidence that large amounts of capital are continuously concentrating in a small set of securities. Rather than forecasting earnings, chasing short-term price momentum, or frequently rotating holdings, the strategy ranks eligible stocks by their 90-trading-day median dollar volume and owns a small group of the strongest absolute leaders.",
      "The core thesis is to own the Nasdaq stocks through which the greatest sustained amount of capital is trading, and to give established leaders enough time to compound instead of repeatedly interrupting them with short-term signals.",
      "Research for this strategy was conducted over the period 2011–2025, encompassing multiple market cycles including periods of expansion, contraction, and recovery. The strategy was validated through era-split testing and is currently designated as Production.",
    ],
    performanceMetrics: [
      { label: "2011–2025 CAGR", value: "30.61%", note: "Full research period" },
      { label: "2011–2017 CAGR", value: "25.17%", note: "Early research era" },
      { label: "2018–2025 CAGR", value: "35.57%", note: "Later research era" },
      { label: "QQQ CAGR", value: "18.56%", note: "2011–2025 benchmark" },
      { label: "Excess vs QQQ", value: "+12.05pp", note: "Annualized, 2011–2025" },
      { label: "Maximum Drawdown", value: "-44.15%", note: "Full period" },
      { label: "Sharpe Ratio", value: "~1.2", note: "Full period" },
      { label: "Portfolio Size", value: "7 stocks", note: "Concentrated" },
    ],
    equityCurve: {
      labels: ["2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
      strategy: [106100, 120010, 196732, 231416, 314471, 328433, 481385, 488461, 712811, 1555069, 2326539, 1350091, 2869618, 4564988, 5493506],
      benchmark: [103480, 122220, 166989, 199018, 217805, 233270, 309455, 309053, 429460, 637362, 812127, 547536, 847914, 1064810, 1285971],
    },
    drawdown: {
      labels: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
      strategy: [0, -2.1, -3.8, -2.4, -4.6, -4.2, -2.8, -3.6, -7.4, -5.2, -1.9, -2.6, -44.15, 0, 0, 0],
      benchmark: [0, -3.4, -5.1, -2.9, -4.2, -6.1, -3.2, -3.1, -9.3, -5.8, -2.4, -2.1, -32.58, 0, 0, 0],
    },
    annualReturns: [
      { year: "2011", strategy: "+6.10%", benchmark: "+3.48%" },
      { year: "2012", strategy: "+13.11%", benchmark: "+18.11%" },
      { year: "2013", strategy: "+63.93%", benchmark: "+36.63%" },
      { year: "2014", strategy: "+17.63%", benchmark: "+19.18%" },
      { year: "2015", strategy: "+35.89%", benchmark: "+9.44%" },
      { year: "2016", strategy: "+4.44%", benchmark: "+7.10%" },
      { year: "2017", strategy: "+46.57%", benchmark: "+32.66%" },
      { year: "2018", strategy: "+1.47%", benchmark: "-0.13%" },
      { year: "2019", strategy: "+45.93%", benchmark: "+38.96%" },
      { year: "2020", strategy: "+118.16%", benchmark: "+48.41%" },
      { year: "2021", strategy: "+49.61%", benchmark: "+27.42%" },
      { year: "2022", strategy: "-41.97%", benchmark: "-32.58%" },
      { year: "2023", strategy: "+112.55%", benchmark: "+54.86%" },
      { year: "2024", strategy: "+59.08%", benchmark: "+25.58%" },
      { year: "2025", strategy: "+20.34%", benchmark: "+20.77%" },
    ],
    investmentPrinciples: [
      {
        title: "Persistent leadership matters",
        description:
          "The strategy focuses on Nasdaq stocks through which the greatest sustained amount of capital is trading, measured by 90-day median dollar volume. Persistent leadership is evidence that large amounts of capital are continuously concentrating in a small set of securities.",
      },
      {
        title: "Let winners compound",
        description:
          "Established leaders are given time to compound. The portfolio is reviewed only twice per year, and winners are not sold because of short-term price noise or temporary market corrections.",
      },
      {
        title: "Keep it simple and disciplined",
        description:
          "The strategy avoids frequent intervention and short-term signals. A narrow retention buffer and equal-weight construction keep the process transparent, repeatable, and robust.",
      },
      {
        title: "Measure risk honestly",
        description:
          "This is a concentrated equity strategy, not a capital-preservation strategy. Drawdowns, volatility, and benchmark-relative behavior are presented transparently alongside performance.",
      },
    ],
    faqs: [
      {
        question: "What is the investment universe for this strategy?",
        answer:
          "The strategy focuses on Nasdaq-listed equities. The universe is constructed using objective, rules-based criteria designed to identify securities with sufficient liquidity and trading history for institutional-grade research.",
      },
      {
        question: "How is the strategy researched and validated?",
        answer:
          "The strategy was developed through a multi-year quantitative research program including historical backtesting, era-split validation, calendar-year behavior analysis, and transaction cost modeling. The research phase is considered complete for the primary model and its core methodology has been frozen.",
      },
      {
        question: "What does 'systematic' mean for this strategy?",
        answer:
          "Every stage of the strategy — from security selection to portfolio construction — is governed by a predefined, rules-based process. The primary ranking signal is 90-day median dollar volume, applied consistently across the eligible universe.",
      },
      {
        question: "How is performance reported?",
        answer:
          "Performance is reported relative to QQQ as the benchmark and includes risk metrics, drawdown analysis, and a full disclosure of assumptions. Historical performance is shown for research purposes and is not a guarantee of future results.",
      },
      {
        question: "Does Stratova Quant manage assets in this strategy?",
        answer:
          "No. Stratova Quant is an independent research firm. We develop and publish systematic investment research. We do not manage discretionary accounts or accept client assets.",
      },
      {
        question: "Why is the research period 2011–2025?",
        answer:
          "The research period represents the period over which the strategy was developed and validated. It encompasses multiple market cycles, including expansion, contraction, and recovery, providing a robust basis for evaluating strategy behavior.",
      },
    ],
    riskDisclosure:
      "Historical performance is presented for information and research purposes. Past performance is not indicative of future results, and historical performance is no guarantee of future performance. Equity investments involve risk, including the possible loss of principal. This is a concentrated equity strategy involving a small number of holdings, which can create substantial company, sector, and factor concentration. The strategy experienced a historical maximum drawdown of approximately -44% and can experience severe losses even when long-term compound returns are high. Quantitative models are based on historical data and may not perform as expected in future market conditions. No representation is made that any investment strategy will achieve its objectives. Investors should conduct their own due diligence and consult with qualified financial professionals before making any investment decision.",
  },
  {
    slug: "stratova-nse-momentum",
    title: "Stratova NSE Momentum Strategy",
    category: "NSE Indian Equities",
    status: "Production",
    researchPeriod: "2010–2026",
    region: "india",
    benchmarkLabel: "NIFTY Midcap 100",
    description:
      "A systematic quantitative investment strategy that selects a concentrated portfolio of NSE stocks with the strongest sustained relative momentum, ranked by proprietary quantitative models with liquidity filters.",
    heroTitle: "Stratova NSE Momentum Strategy",
    heroDescription:
      "A concentrated Indian equity-selection framework built around systematic momentum investing, disciplined portfolio management, and long-term capital compounding.",
    overview: [
      "The Stratova NSE Momentum Strategy is a concentrated Indian equity investment strategy designed to identify and own the country's strongest market leaders using a fully systematic investment process.",
      "Rather than forecasting earnings, interpreting news, or making discretionary investment decisions, the strategy ranks stocks using proprietary quantitative models that identify sustained relative strength while applying liquidity and investability filters.",
      "The portfolio is intentionally concentrated, allowing capital to be allocated only to the highest-conviction opportunities that satisfy every investment rule.",
      "Research for this strategy was conducted over the period 2010–2026, covering multiple bull markets, bear markets, high-volatility environments, and economic recovery cycles. The strategy has undergone extensive historical validation and is currently designated as Production.",
    ],
    performanceMetrics: [
      {
        label: "2010–2026 CAGR",
        value: "51.01%",
        note: "Full research period",
      },
      {
        label: "NIFTY Midcap 100 CAGR",
        value: "12.78%",
        note: "Benchmark",
      },
      {
        label: "Annualized Alpha",
        value: "+38.83pp",
        note: "vs benchmark",
      },
      {
        label: "Maximum Drawdown",
        value: "-55.02%",
        note: "Full period",
      },
      {
        label: "Sharpe Ratio",
        value: "1.00",
        note: "Full period",
      },
      {
        label: "Portfolio Size",
        value: "3 Stocks",
        note: "Concentrated",
      },
      {
        label: "Rebalancing",
        value: "Monthly",
        note: "Systematic",
      },
      {
        label: "Monthly Win Rate",
        value: "61.4%",
        note: "Outperformed benchmark",
      },
    ],
    equityCurve: {
      labels: [
        "2011", "2012", "2013", "2014",
        "2015", "2016", "2017", "2018", "2019",
        "2020", "2021", "2022", "2023", "2024",
        "2025", "2026",
      ],
      strategy: [
        892100, 1338573, 1821225, 1730884,
        6258385, 9166046, 6001478, 12652358, 11949008,
        18738096, 42845967, 124335849, 119350986, 214447021,
        411025089, 504821137, 668019800,
      ],
      benchmark: [
        979100, 719340, 882579, 829624,
        1325748, 1432750, 1579607, 2112336, 1891192,
        1834647, 2135000, 3213175, 3462850, 4653310,
        6114000, 6547000, 6650800,
      ],
    },
    drawdown: {
      labels: [
        "2011", "2012", "2013", "2014",
        "2015", "2016", "2017", "2018", "2019",
        "2020", "2021", "2022", "2023", "2024",
        "2025", "2026",
      ],
      strategy: [
        -11, -18, -25, -9,
        -14, -55, -24, -30, -12,
        -8, -5, -38, -14, -7,
        -5, -3,
      ],
      benchmark: [
        -27, -15, -19, -8,
        -11, -17, -9, -18, -10,
        -28, -6, -24, -11, -7,
        -4, -2,
      ],
    },
    annualReturns: [
      { year: "2011", strategy: "+50.06%", benchmark: "-26.53%" },
      { year: "2012", strategy: "+36.06%", benchmark: "+22.69%" },
      { year: "2013", strategy: "-4.96%", benchmark: "-6.00%" },
      { year: "2014", strategy: "+261.58%", benchmark: "+59.80%" },
      { year: "2015", strategy: "+46.45%", benchmark: "+8.07%" },
      { year: "2016", strategy: "-34.53%", benchmark: "+10.25%" },
      { year: "2017", strategy: "+110.85%", benchmark: "+33.72%" },
      { year: "2018", strategy: "-5.56%", benchmark: "-10.47%" },
      { year: "2019", strategy: "+56.82%", benchmark: "-2.99%" },
      { year: "2020", strategy: "+128.64%", benchmark: "+16.37%" },
      { year: "2021", strategy: "+190.18%", benchmark: "+50.50%" },
      { year: "2022", strategy: "-4.01%", benchmark: "+7.77%" },
      { year: "2023", strategy: "+79.68%", benchmark: "+34.38%" },
      { year: "2024", strategy: "+91.67%", benchmark: "+31.39%" },
      { year: "2025", strategy: "+22.82%", benchmark: "+7.09%" },
      { year: "2026*", strategy: "+30.52%", benchmark: "+1.58%" },
    ],
    investmentPrinciples: [
      {
        title: "Momentum persists",
        description:
          "Stocks demonstrating sustained relative strength often continue outperforming over intermediate time horizons. The strategy systematically identifies these market leaders using quantitative ranking models.",
      },
      {
        title: "Invest only in quality liquidity",
        description:
          "Only sufficiently liquid securities are eligible for investment, ensuring that every position remains practical, scalable, and efficiently tradable.",
      },
      {
        title: "Discipline over prediction",
        description:
          "Every investment decision follows predefined quantitative rules. The strategy avoids discretionary market timing, emotional decision-making, and subjective stock selection.",
      },
      {
        title: "Long-term compounding",
        description:
          "The objective is not to maximize trading activity but to allow exceptional businesses and market leaders the opportunity to compound capital over extended periods while maintaining disciplined portfolio management.",
      },
    ],
    faqs: [
      {
        question: "What companies are eligible for investment?",
        answer:
          "The strategy focuses on NSE-listed equities that meet specific liquidity, investability, and momentum criteria. The universe is constructed using objective, rules-based filters designed to identify securities suitable for institutional-grade portfolio construction.",
      },
      {
        question: "How is the strategy researched and validated?",
        answer:
          "The strategy was developed through extensive quantitative research including historical backtesting, robustness checks, and sensitivity analysis across multiple market regimes. The research phase is considered complete for the primary model.",
      },
      {
        question: "What makes this a systematic strategy?",
        answer:
          "Every stage of the strategy — from security selection to portfolio construction — is governed by predefined quantitative rules. The primary ranking signal is based on relative momentum, applied consistently across the eligible universe.",
      },
      {
        question: "How often is the portfolio reviewed?",
        answer:
          "The portfolio is reviewed on a disciplined schedule based on the strategy's predefined rules. Rebalancing occurs only when securities no longer meet the momentum or liquidity criteria, minimizing unnecessary turnover and transaction costs.",
      },
      {
        question: "How is risk managed?",
        answer:
          "Risk management is embedded in the strategy through position sizing limits, concentration constraints, and liquidity requirements. The strategy is designed to balance return potential with prudent risk controls.",
      },
      {
        question: "How is performance reported?",
        answer:
          "Performance will be reported relative to an appropriate NSE benchmark once finalized. Risk metrics, drawdown analysis, and full disclosure of assumptions will be provided alongside performance data.",
      },
    ],
    riskDisclosure:
      "Historical performance is presented for information and research purposes. Past performance is not indicative of future results, and historical performance is no guarantee of future performance. Equity investments involve risk, including the possible loss of principal. Quantitative investment models are based on historical market data and may not perform as expected under future market conditions. Concentrated portfolios may experience periods of significant volatility and drawdowns. Investors should conduct their own research and consult qualified financial professionals before making any investment decision.",
  },
];

export function getStrategy(slug: string): Strategy | undefined {
  return STRATEGIES.find((s) => s.slug === slug);
}