"use client";

import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How long does it take to develop a new strategy?",
    answer:
      "Development timelines vary and are not publicised. A strategy is published only after it has been backtested, documented, and reviewed internally.",
  },
  {
    question: "What data sources does Stratova Quant use?",
    answer:
      "End-of-day market data for NSE-listed equities, index constituents, and benchmark values. We do not use alternative or private datasets.",
  },
  {
    question: "How are strategies validated?",
    answer:
      "Through point-in-time backtesting with realistic transaction costs, out-of-sample testing, and ongoing comparison to the benchmark on a net-return basis. Known limitations are published alongside results.",
  },
  {
    question: "Does Stratova Quant manage client assets?",
    answer:
      "No. Stratova Quant publishes research and recommendations. Subscribers receive strategy signals and target allocations; they execute trades themselves through their own broker. We do not hold client funds, manage discretionary accounts, or place orders on behalf of subscribers.",
  },
  {
    question: "How often is the methodology updated?",
    answer:
      "The methodology is fixed by design. Strategy rules do not change. Data sources may be extended as new markets are added. Any material change to the framework is documented on this page.",
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