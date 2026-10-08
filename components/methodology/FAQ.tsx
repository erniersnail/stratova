"use client";

import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What does a subscription give me?",
    answer:
      "Every subscriber receives the current holdings for each strategy they are subscribed to, the target allocation for their capital, and advance notice of the next rebalance date. Recommendations are published on the rebalance date and remain visible until the next one.",
  },
  {
    question: "How much capital do I need to follow a strategy?",
    answer:
      "There is no minimum. The target allocation scales to whatever capital you allocate — ₹50,000 and ₹5,00,000 receive the same proportional holdings. You execute at your own broker.",
  },
  {
    question: "How often will I receive recommendations?",
    answer:
      "Each strategy rebalances on a fixed schedule — monthly for large-cap and broad-market strategies, quarterly for midcap and smallcap. Between rebalances, your dashboard shows your current positions and their performance. We do not issue intraday or off-cycle signals.",
  },
  {
    question: "How does Stratova make money — and do you manage my assets?",
    answer:
      "Subscriptions only. We do not manage client assets, hold client funds, or place orders on behalf of subscribers. You execute trades yourself through your own broker. Our revenue comes entirely from subscription fees — no commissions, no performance fees, no conflicts of interest.",
  },
  {
    question: "What happens if I want to stop?",
    answer:
      "Subscriptions can be cancelled at any time. You keep access to your current recommendations until the end of your paid period. No exit fees, no lock-in. Deleting your account removes your data on request, subject to statutory record-keeping requirements.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div
            key={index}
            className="rounded-lg border border-border bg-surface"
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-foreground transition-colors duration-150 hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <span>{item.question}</span>
                <span
                  className={`ml-4 shrink-0 text-secondary transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="overflow-hidden"
            >
              <div className="px-6 pb-4 text-sm leading-relaxed text-secondary">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}