export type Role = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  blurb: string;
  about: string[];
  responsibilities: string[];
  requirements: string[];
};

export const ROLES: Role[] = [
  {
    slug: "quantitative-researcher",
    title: "Quantitative Researcher",
    department: "Research",
    location: "Bangalore",
    type: "Full-time",
    blurb:
      "Design and validate systematic equity strategies across India and U.S. markets.",
    about: [
      "You will work at the core of what we do: turning hypotheses about markets into tested, documented, and eventually deployed strategies. The role spans the full research loop — idea generation, data work, backtesting, walk-forward validation, and writing up the result.",
      "You will own problems end to end. Nobody hands you a specification. You decide what to test, how to test it, and when a result is solid enough to ship.",
    ],
    responsibilities: [
      "Develop and refine systematic equity signals across India and U.S. universes",
      "Run rigorous backtests with attention to costs, capacity, and out-of-sample behaviour",
      "Document methodology clearly enough for independent review",
      "Work alongside engineering to move validated strategies into production",
    ],
    requirements: [
      "Strong Python — pandas, numpy, and comfort with large datasets",
      "Solid grounding in statistics and time-series analysis",
      "Familiarity with equity factor models, momentum, or cross-sectional signals",
      "Degree in a quantitative discipline, or equivalent evidence of ability",
    ],
  },
  {
    slug: "quantitative-trader",
    title: "Quantitative Trader",
    department: "Trading",
    location: "Bangalore",
    type: "Full-time",
    blurb: "Own the daily execution workflow from signal to order.",
    about: [
      "You will run the daily trading operation: taking validated signals and turning them into executed rebalances across client portfolios, monitoring fills, and managing the small operational decisions that come up every day.",
      "Over time you will refine the execution layer — broker selection, order routing, timing, and cost measurement.",
    ],
    responsibilities: [
      "Execute daily and monthly rebalances across India and U.S. accounts",
      "Monitor fills, slippage, and transaction costs against expectations",
      "Maintain the trading ledger and reconcile positions end of day",
      "Improve the execution layer through measurement, not intuition",
    ],
    requirements: [
      "Hands-on experience executing Indian or U.S. equity orders",
      "Familiarity with broker APIs — Zerodha, Upstox, IBKR, or similar",
      "Understanding of transaction costs, market impact, and liquidity",
      "Comfort operating live production systems in Python",
    ],
  },
  {
    slug: "quantitative-developer",
    title: "Quantitative Developer",
    department: "Engineering",
    location: "Bangalore",
    type: "Full-time",
    blurb:
      "Build the research and production infrastructure behind our strategies.",
    about: [
      "You will build the systems researchers use to develop strategies, and the pipelines that run them in production every day. The work sits at the boundary of data engineering, research tooling, and deployment.",
      "Expect to own the reliability of what you build. If a nightly job fails, you will know about it and fix it.",
    ],
    responsibilities: [
      "Maintain and extend the backtesting and research tooling",
      "Build data pipelines for market data, fundamentals, and alternative sources",
      "Own the daily production run — data fetch, signal generation, publishing",
      "Work with research to move validated ideas into live workflows",
    ],
    requirements: [
      "Strong Python; some TypeScript or Next.js useful",
      "Experience with data pipelines, Parquet, or similar columnar formats",
      "Comfort with cloud deployment and Linux operations",
      "Postgres or Supabase experience preferred",
    ],
  },
  {
    slug: "machine-learning-engineer",
    title: "Machine Learning Engineer",
    department: "Engineering",
    location: "Bangalore",
    type: "Full-time",
    blurb: "Apply modern ML to signal generation and portfolio construction.",
    about: [
      "You will apply modern machine learning methods to problems in systematic equity investing — feature engineering, model selection, and portfolio construction — with an emphasis on out-of-sample performance rather than in-sample fit.",
      "The role is research-adjacent: you will spend as much time reading and validating as you will modelling.",
    ],
    responsibilities: [
      "Design and evaluate ML models for cross-sectional return prediction",
      "Build reproducible pipelines from raw data to model output",
      "Guard against overfitting through strict out-of-sample discipline",
      "Collaborate with research on blending ML signals with rules-based strategies",
    ],
    requirements: [
      "Strong Python — PyTorch or similar deep learning frameworks",
      "Solid understanding of overfitting, cross-validation, and feature selection",
      "Experience applying ML to time-series or financial data preferred",
      "Degree in a quantitative discipline or equivalent evidence of ability",
    ],
  },
  {
    slug: "data-engineer",
    title: "Data Engineer",
    department: "Engineering",
    location: "Bangalore",
    type: "Full-time",
    blurb:
      "Build pipelines for market data, fundamentals, and alternative datasets.",
    about: [
      "You will own the data layer that everything else depends on — ingestion, cleaning, storage, and quality checks. If the data is wrong, nothing downstream matters.",
      "The role is heavy on operational discipline: pipelines that run on time, datasets that reconcile, and clear lineage from source to signal.",
    ],
    responsibilities: [
      "Build and maintain ingestion pipelines for prices, fundamentals, and corporate actions",
      "Implement data quality checks and reconciliation routines",
      "Design storage layouts optimised for research and production access",
      "Document sources, update schedules, and known caveats",
    ],
    requirements: [
      "Strong Python and SQL",
      "Experience with batch data pipelines and scheduling",
      "Familiarity with Parquet, Postgres, or object storage",
      "Attention to correctness and reproducibility above all",
    ],
  },
  {
    slug: "research-analyst",
    title: "Research Analyst",
    department: "Research",
    location: "Bangalore",
    type: "Full-time",
    blurb:
      "Support the research process with data, validation, and written analysis.",
    about: [
      "You will work alongside the quantitative researchers, taking strategy outputs and turning them into clear, accurate, SEBI-compliant research notes. The role combines analytical work with disciplined writing.",
      "This is a good entry point into systematic research for someone with strong writing and quantitative instincts.",
    ],
    responsibilities: [
      "Write research notes that translate strategy output into readable commentary",
      "Validate data and calculations behind published recommendations",
      "Maintain the recommendation ledger and historical record",
      "Support compliance requirements around disclosure and documentation",
    ],
    requirements: [
      "Strong writing and analytical skills",
      "Familiarity with Indian equity markets and the SEBI RA framework",
      "NISM Series XV certification preferred, or willingness to obtain",
      "Attention to detail and process discipline",
    ],
  },
  {
    slug: "portfolio-analyst",
    title: "Portfolio Analyst",
    department: "Research",
    location: "Bangalore",
    type: "Full-time",
    blurb: "Monitor live portfolios, attribution, and risk exposures.",
    about: [
      "You will monitor live portfolios day to day — tracking positions, attributing returns, and flagging deviations from expectation before they become problems.",
      "The role sits between research and operations: you see what the strategies are actually doing, and feed that back into the research process.",
    ],
    responsibilities: [
      "Monitor live portfolios against target weights and expectations",
      "Produce periodic attribution reports by strategy, sector, and factor",
      "Flag anomalies in positions, exposures, or returns",
      "Feed observations back into the research and risk processes",
    ],
    requirements: [
      "Strong analytical skills and comfort with portfolio mathematics",
      "Experience with performance attribution or risk reporting preferred",
      "Proficiency with Excel and Python for analysis",
      "Degree in finance, economics, or a quantitative discipline",
    ],
  },
  {
    slug: "risk-analyst",
    title: "Risk Analyst",
    department: "Risk",
    location: "Bangalore",
    type: "Full-time",
    blurb: "Own portfolio-level risk measurement, limits, and reporting.",
    about: [
      "You will own the risk framework: defining limits, measuring exposure, and reporting what the portfolios are actually carrying. The role is analytical and independent — you report on the strategies, not for them.",
      "Over time you will refine how we think about drawdowns, concentration, and tail risk across strategies.",
    ],
    responsibilities: [
      "Measure and monitor portfolio-level risk — volatility, drawdown, concentration",
      "Define and enforce risk limits across strategies",
      "Produce periodic risk reports for internal use and compliance",
      "Stress-test portfolios under historical and hypothetical scenarios",
    ],
    requirements: [
      "Strong grounding in quantitative risk measurement",
      "Familiarity with VaR, expected shortfall, and factor risk models",
      "Proficiency in Python and statistical analysis",
      "Degree in a quantitative discipline",
    ],
  },
  {
    slug: "head-of-marketing",
    title: "Head of Marketing",
    department: "Marketing",
    location: "Bangalore",
    type: "Full-time",
    blurb:
      "Own brand, positioning, and growth across digital and institutional channels.",
    about: [
      "You will own how Simplicial Capital is seen by the market — brand, positioning, messaging, and the channels we use to reach investors and institutional allocators.",
      "The role is both strategic and hands-on: you will set direction, but you will also write the copy and run the campaigns.",
    ],
    responsibilities: [
      "Own brand strategy, positioning, and messaging across all channels",
      "Lead content, paid acquisition, and lifecycle marketing",
      "Build and manage a small marketing team as the firm grows",
      "Partner with research and compliance on all published material",
    ],
    requirements: [
      "Experience leading marketing for a financial or technology firm",
      "Strong writing ability and a clear point of view on positioning",
      "Familiarity with SEBI or financial-services compliance preferred",
      "Comfort operating at both strategic and execution levels",
    ],
  },
  {
    slug: "growth-marketing-manager",
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Bangalore",
    type: "Full-time",
    blurb: "Drive acquisition and retention across paid and organic channels.",
    about: [
      "You will run the day-to-day growth engine: paid acquisition, SEO, email, and analytics. The goal is qualified signups, not vanity metrics.",
      "The role reports to the Head of Marketing and owns numbers end to end.",
    ],
    responsibilities: [
      "Manage paid acquisition across search, social, and finance-specific channels",
      "Own SEO and content distribution",
      "Build and run lifecycle email and retention campaigns",
      "Report on acquisition cost, conversion, and retention weekly",
    ],
    requirements: [
      "2–5 years of growth or performance marketing experience",
      "Hands-on with Google Ads, Meta, and analytics platforms",
      "Comfort with numbers — CAC, LTV, payback, cohort analysis",
      "Interest in financial services or investing",
    ],
  },
  {
    slug: "content-lead",
    title: "Content Lead",
    department: "Marketing",
    location: "Bangalore",
    type: "Full-time",
    blurb:
      "Write the research notes, product copy, and long-form content we publish.",
    about: [
      "You will own the written voice of the firm — from product copy and onboarding emails to long-form essays on systematic investing and market structure.",
      "This is a writing-first role. You should enjoy the craft of making complicated things clear.",
    ],
    responsibilities: [
      "Write and edit long-form content on systematic investing and markets",
      "Own product copy across the website, emails, and onboarding",
      "Work with research to turn technical output into readable prose",
      "Maintain a consistent voice across every surface",
    ],
    requirements: [
      "Exceptional writing — portfolio of published work required",
      "Ability to explain quantitative concepts to a non-specialist audience",
      "Interest in markets, investing, and financial writing",
      "Attention to accuracy and compliance in published material",
    ],
  },
  {
    slug: "institutional-sales",
    title: "Institutional Sales",
    department: "Sales",
    location: "Bangalore",
    type: "Full-time",
    blurb:
      "Build relationships with family offices, RIAs, and institutional allocators.",
    about: [
      "You will build the institutional side of the business — relationships with family offices, RIAs, and allocators who want exposure to systematic equity strategies.",
      "The role is consultative. You will spend as much time understanding client needs as you will pitching.",
    ],
    responsibilities: [
      "Build and manage a pipeline of institutional prospects",
      "Run the full sales cycle from first meeting to onboarding",
      "Represent Simplicial Capital at industry events and conferences",
      "Work with research to tailor pitches to specific allocator needs",
    ],
    requirements: [
      "Experience selling investment products to institutional clients",
      "Existing network in Indian or global allocator markets preferred",
      "Strong presentation and relationship skills",
      "Understanding of SEBI regulations around research distribution",
    ],
  },
];
