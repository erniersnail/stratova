export type Role = {
  title: string;
  department: string;
  location: string;
  blurb: string;
};

export const ROLES: Role[] = [
  {
    title: "Quantitative Researcher",
    department: "Research",
    location: "Bangalore",
    blurb:
      "Design and validate systematic equity strategies across India and U.S. markets.",
  },
  {
    title: "Quantitative Trader",
    department: "Trading",
    location: "Bangalore",
    blurb: "Own the daily execution workflow from signal to order.",
  },
  {
    title: "Quantitative Developer",
    department: "Engineering",
    location: "Bangalore",
    blurb:
      "Build the research and production infrastructure behind our strategies.",
  },
  {
    title: "Machine Learning Engineer",
    department: "Engineering",
    location: "Bangalore",
    blurb:
      "Apply modern ML to signal generation and portfolio construction.",
  },
  {
    title: "Data Engineer",
    department: "Engineering",
    location: "Bangalore",
    blurb:
      "Build pipelines for market data, fundamentals, and alternative datasets.",
  },
  {
    title: "Research Analyst",
    department: "Research",
    location: "Bangalore",
    blurb:
      "Support the research process with data, validation, and written analysis.",
  },
  {
    title: "Portfolio Analyst",
    department: "Research",
    location: "Bangalore",
    blurb: "Monitor live portfolios, attribution, and risk exposures.",
  },
  {
    title: "Risk Analyst",
    department: "Risk",
    location: "Bangalore",
    blurb:
      "Own portfolio-level risk measurement, limits, and reporting.",
  },
  {
    title: "Head of Marketing",
    department: "Marketing",
    location: "Bangalore",
    blurb:
      "Own brand, positioning, and growth across digital and institutional channels.",
  },
  {
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Bangalore",
    blurb:
      "Drive acquisition and retention across paid and organic channels.",
  },
  {
    title: "Content Lead",
    department: "Marketing",
    location: "Bangalore",
    blurb:
      "Write the research notes, product copy, and long-form content we publish.",
  },
  {
    title: "Institutional Sales",
    department: "Sales",
    location: "Bangalore",
    blurb:
      "Build relationships with family offices, RIAs, and institutional allocators.",
  },
];
