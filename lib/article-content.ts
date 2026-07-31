export type ArticleBlock =
  | { type: "heading"; content: string }
  | { type: "subheading"; content: string }
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "pull-quote"; content: string; attribution?: string }
  | { type: "code"; content: string; language?: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "figure"; caption: string }
  | { type: "math"; content: string };

export type ArticleContent = {
  slug: string;
  title: string;
  category: string;
  date: string;
  readingTime: string;
  abstract: string;
  blocks: ArticleBlock[];
};

export const ARTICLE_CONTENT: Record<string, ArticleContent> = {
  "momentum-after-earnings": {
    slug: "momentum-after-earnings",
    title: "Momentum After Earnings: Evidence from U.S. Equities",
    category: "Factor Research",
    date: "July 2026",
    readingTime: "12 min read",
    abstract:
      "Examining whether post-earnings momentum persists after controlling for size and sector effects in a comprehensive sample of U.S. listed equities.",
    blocks: [
      {
        type: "heading",
        content: "Introduction",
      },
      {
        type: "paragraph",
        content:
          "Momentum is one of the most extensively documented anomalies in empirical finance. Since Jegadeesh and Titman (1993), researchers have consistently found that stocks with higher past returns tend to outperform stocks with lower past returns over holding periods of three to twelve months. However, the interaction between momentum and earnings announcements remains an area of active research.",
      },
      {
        type: "paragraph",
        content:
          "This paper investigates whether the momentum effect is amplified or attenuated around earnings announcements. Specifically, we test whether post-earnings announcement drift (PEAD) and price momentum represent distinct or overlapping sources of return predictability.",
      },
      {
        type: "heading",
        content: "Data and Methodology",
      },
      {
        type: "subheading",
        content: "Sample Selection",
      },
      {
        type: "paragraph",
        content:
          "Our sample includes all U.S.-listed common stocks on the NYSE, AMEX, and NASDAQ from January 2000 through December 2025. We exclude stocks with a market capitalization below the 20th percentile of NYSE-listed stocks to mitigate the influence of micro-cap securities. Daily returns are sourced from the CRSP database, and earnings announcement dates are obtained from Compustat.",
      },
      {
        type: "list",
        items: [
          "Minimum market capitalization: $200 million at portfolio formation",
          "Minimum average daily trading volume: $5 million",
          "Exclusion of stocks with fewer than 12 months of price history",
          "Exclusion of stocks in the bottom price decile (penny stocks)",
        ],
      },
      {
        type: "subheading",
        content: "Portfolio Construction",
      },
      {
        type: "paragraph",
        content:
          "At the beginning of each calendar month, we sort stocks into decile portfolios based on their cumulative return over the prior twelve months, skipping the most recent month to avoid short-term reversal effects. The top decile forms the winner portfolio, and the bottom decile forms the loser portfolio. The momentum strategy is long the winner portfolio and short the loser portfolio, rebalanced monthly.",
      },
      {
        type: "pull-quote",
        content:
          "The momentum effect is not a single phenomenon but a constellation of related anomalies that interact with firm characteristics, market conditions, and information events in complex ways.",
        attribution: "— Jegadeesh & Titman (1993)",
      },
      {
        type: "heading",
        content: "Results",
      },
      {
        type: "subheading",
        content: "Baseline Momentum Returns",
      },
      {
        type: "paragraph",
        content:
          "Table 1 presents the baseline results for the momentum strategy across the full sample period. The long-short portfolio generates an average monthly return of 0.89% (t-statistic: 3.42), which is economically and statistically significant. The strategy exhibits positive returns in approximately 68% of calendar months, with a monthly standard deviation of 3.1%.",
      },
      {
        type: "table",
        headers: [
          "Portfolio",
          "Monthly Return",
          "Volatility",
          "Sharpe Ratio",
          "Win Rate",
        ],
        rows: [
          ["Winner", "1.12%", "3.8%", "0.35", "61%"],
          ["Loser", "0.23%", "4.2%", "0.07", "48%"],
          ["Long-Short", "0.89%", "3.1%", "0.34", "68%"],
        ],
        caption:
          "Table 1: Baseline momentum strategy returns, January 2000 – December 2025.",
      },
      {
        type: "subheading",
        content: "Earnings Announcement Effects",
      },
      {
        type: "paragraph",
        content:
          "To examine the interaction between momentum and earnings announcements, we partition the monthly holding period into two segments: the three-day window surrounding earnings announcements and the remaining non-announcement days. We then compute the cumulative return attributable to each segment.",
      },
      {
        type: "figure",
        caption:
          "Figure 1: Cumulative momentum returns around earnings announcement dates. The shaded region represents the three-day window surrounding each firm's quarterly earnings announcement.",
      },
      {
        type: "paragraph",
        content:
          "The results reveal a striking pattern. Approximately 35% of the total momentum return is concentrated in the three-day windows surrounding earnings announcements, which represent only 4% of total trading days. This concentration is consistent with the hypothesis that momentum profits are partially driven by the gradual incorporation of earnings information into prices.",
      },
      {
        type: "code",
        content:
          "def calculate_earnings_momentum(prices, earnings_dates, pre_window=1, post_window=1):\n    \"\"\"\n    Calculate momentum returns around earnings announcements.\n\n    Parameters\n    ----------\n    prices : pd.DataFrame\n        Daily closing prices with columns ['date', 'ticker', 'close']\n    earnings_dates : pd.Series\n        Earnings announcement dates per ticker\n    pre_window, post_window : int\n        Days before and after announcement to include\n    \"\"\"\n    returns = prices.pct_change()\n    momentum = returns.rolling(252).mean()\n    return momentum",
        language: "python",
      },
      {
        type: "heading",
        content: "Robustness Checks",
      },
      {
        type: "paragraph",
        content:
          "We conduct several robustness checks to ensure our findings are not driven by specific methodological choices. First, we repeat the analysis using alternative formation periods (six months and eighteen months). Second, we control for the Fama-French five factors to isolate the incremental predictive power of momentum beyond known risk factors. Third, we examine subsample stability by dividing the sample into pre-2008 and post-2008 periods.",
      },
      {
        type: "ordered-list",
        items: [
          "Six-month formation period: Monthly return of 0.72% (t-stat: 2.89)",
          "Eighteen-month formation period: Monthly return of 0.64% (t-stat: 2.41)",
          "Fama-French five-factor alpha: 0.67% per month (t-stat: 2.78)",
          "Pre-2008 subsample: 0.95% per month (t-stat: 3.12)",
          "Post-2008 subsample: 0.83% per month (t-stat: 2.94)",
        ],
      },
      {
        type: "math",
        content:
          "E[R_p - R_f] = alpha + beta_1 * (R_m - R_f) + beta_2 * SMB + beta_3 * HML + beta_4 * RMW + beta_5 * CMA + epsilon",
      },
      {
        type: "heading",
        content: "Conclusion",
      },
      {
        type: "paragraph",
        content:
          "Our findings confirm that momentum remains a robust predictor of cross-sectional returns in U.S. equities, even after controlling for size and sector effects. The concentration of momentum returns around earnings announcement dates suggests that post-earnings announcement drift and price momentum are partially overlapping phenomena. This has important implications for portfolio construction: a momentum strategy that explicitly accounts for earnings announcement timing may achieve superior risk-adjusted returns.",
      },
      {
        type: "paragraph",
        content:
          "Future research could extend this analysis to international markets, particularly emerging markets where the interaction between momentum and earnings announcements may differ due to differences in information dissemination and market microstructure.",
      },
    ],
  },
};

export function getArticleContent(slug: string): ArticleContent | undefined {
  return ARTICLE_CONTENT[slug];
}