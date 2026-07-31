"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  { question: "Are performance returns audited?", answer: "Performance data is calculated using standardized methodologies and verified through internal review processes. Independent audits are conducted periodically and are available to qualified institutional investors upon request." },
  { question: "How are transaction costs estimated?", answer: "Transaction costs are estimated using a multi-factor model that accounts for commissions, bid-ask spreads, market impact, and opportunity costs. Cost estimates are based on historical execution data and are reviewed regularly." },
  { question: "What assumptions are made about capacity?", answer: "Capacity estimates are based on liquidity analysis, market impact modeling, and position size constraints. Estimates are reviewed and updated as market conditions evolve." },
  { question: "How often are performance reports published?", answer: "Performance reports are typically published on a quarterly basis. Reports include the full set of metrics described in our reporting framework, along with benchmark comparisons and commentary." },
  { question: "Can I receive historical performance data?", answer: "Historical performance data and methodology documentation are available to qualified institutional investors through a confidential process. Please contact us to begin that conversation." },
];

export default function PerformanceFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="rounded-lg border border-border bg-surface">
            <h3>
              <button type="button" aria-expanded={isOpen} aria-controls={`pf-panel-${i}`} onClick={() => setOpenIndex(isOpen ? null : i)} className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-foreground transition-colors hover:text-secondary">
                <span>{item.question}</span>
                <span className={`ml-4 shrink-0 text-secondary transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`} aria-hidden="true">+</span>
              </button>
            </h3>
            <div id={`pf-panel-${i}`} role="region" aria-labelledby={`pf-button-${i}`} hidden={!isOpen}><div className="px-6 pb-4 text-sm leading-relaxed text-secondary">{item.answer}</div></div>
          </div>
        );
      })}
    </div>
  );
}