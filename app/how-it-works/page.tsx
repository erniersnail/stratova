import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "How It Works — Simplicial Capital",
  description:
    "From choosing a strategy to acting on your first rebalance. A step-by-step guide for new subscribers.",
};

const STEPS = [
  {
    number: "01",
    title: "Review the strategies",
    body: "Start on the Strategies page. Each strategy is defined by its universe, benchmark, and rebalance cadence. Read those before reading the returns — if a strategy's universe is outside your comfort zone, it will be outside it at every performance number too. Performance data for each strategy is on the Performance page.",
  },
  {
    number: "02",
    title: "Choose a strategy that fits your risk",
    body: "Each strategy carries a distinct risk profile. Broad Market and Multicap spread exposure across the full market-cap spectrum. Midcap and Smallcap concentrate in narrower segments and carry higher volatility. U.S. Equity Leadership is concentrated across a small number of large-cap U.S. names. The right choice depends on your horizon, your tolerance for drawdown, and how much of your portfolio you intend to allocate. We do not provide personalised advice — the choice is yours.",
  },
  {
    number: "03",
    title: "Subscribe",
    body: "On the strategy page, click 'Pay & subscribe'. You will receive a payment reference and instructions. Once payment is confirmed, your subscription activates immediately and your dashboard unlocks. Subscriptions run to the end of the current calendar month. There is no auto-renewal — each month is a deliberate, fresh decision.",
  },
  {
    number: "04",
    title: "Check your dashboard after each rebalance",
    body: "Each strategy rebalances on a fixed schedule — monthly for Broad Market, Multicap, and U.S. Equity Leadership; quarterly for Midcap and Smallcap. On the rebalance evening, the new set of recommendations is published to your dashboard. The dashboard shows each symbol, the action (BUY/SELL/HOLD), the target weight, and a suggested share count based on your allocated capital.",
  },
  {
    number: "05",
    title: "Act on the recommendations on your own",
    body: "We do not place trades. We do not connect to your broker. Every recommendation is published to your dashboard for you to review. If you choose to act on it, you place the orders yourself, through your own broker, at your own discretion. The natural window is the first trading session after the recommendation is published — this gives you time to review the full list, size positions against your actual capital, and place orders without rushing.",
  },
  {
    number: "06",
    title: "If the market is closed",
    body: "If a rebalance falls before a weekend or an exchange holiday, the recommendation remains valid. Trade on the first trading day the market is open. The recommendation stays current until the next rebalance — there is no penalty for trading a day later. Do not force a trade on a day the market is closed.",
  },
  {
    number: "07",
    title: "Adding capital mid-cycle",
    body: "If you want to add fresh capital to an existing subscription — for example, a monthly top-up — the cleanest window is the first 3 trading days after a rebalance. This lets you enter at prices close to the ones the strategy assumed, so you join the current book cleanly. Adding capital mid-cycle means you enter at current market prices, which may differ materially from the strategy's modelled entry. Neither approach is wrong, but the first is closer to how the strategy is designed to work.",
  },
  {
    number: "08",
    title: "Cancel any time from your dashboard",
    body: "Each active subscription has a Cancel link on your dashboard. Cancelling is immediate — access ends, and current recommendations for that strategy become unreadable. There is no refund for the current month once recommendations have been delivered. If you cancel before the month ends, you can subscribe again the next cycle.",
  },
  {
    number: "09",
    title: "Renew at end of month",
    body: "Subscriptions expire on the last day of the calendar month. To continue receiving recommendations into the next month, subscribe again when the new cycle opens. There is no auto-renewal.",
  },
];

export default function HowItWorksPage() {
  return (
    <main>
      <Container size="default" className="py-20">
        <PageHeader
          title="How It Works"
          description="From first visit to first rebalance. What to expect, when to act, and what you receive."
        />

        <div className="mt-12 space-y-10">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className={index === 0 ? "" : "border-t border-border pt-10"}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[80px_1fr] md:gap-8">
                <span className="text-4xl font-light leading-none text-tertiary">
                  {step.number}
                </span>
                <div className="max-w-[680px]">
                  <h2 className="text-xl font-medium text-foreground">
                    {step.title}
                  </h2>
                  <p className={`${typography.body} mt-3 text-secondary`}>
                    {step.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-md border border-border bg-surface px-8 py-10">
          <h2 className={`${typography.h3} text-foreground`}>
            Ready to start?
          </h2>
          <p className={`${typography.body} mt-4 max-w-[560px] text-secondary`}>
            Browse our strategies, review the performance data, and subscribe
            when you find one that fits your objectives.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/strategies"
              className="inline-flex items-center rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity duration-200 hover:opacity-90"
            >
              View Strategies
            </Link>
            <Link
              href="/performance"
              className="inline-flex items-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-foreground/40"
            >
              See Performance
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
