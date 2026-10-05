"use client";

import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How long does it take to develop a new investment strategy?",
    answer:
      "The timeline varies depending on the complexity of the hypothesis and the availability of data. A typical research cycle from hypothesis to published strategy takes between three and six months, including data collection, validation, documentation, and review.",
  },
  {
    question: "What data sources does Stratova Quant use?",
    answer:
      "We use a combination of market data, fundamental data, corporate actions, macroeconomic indicators, and select alternative data sources. All data is sourced from reputable providers and undergoes rigorous validation before being used in research.",
  },
  {
    question: "How are strategies validated before publication?",
    answer:
      "Every strategy undergoes a multi-stage validation process including historical backtesting, walk-forward analysis, robustness checks, sensitivity analysis, and transaction cost modeling. Strategies are reviewed internally before any research is published.",
  },
  {
    question: "Does Stratova Quant manage client assets?",
    answer:
      "No. Stratova Quant is an independent research firm. We develop systematic investment strategies and publish our research. We do not manage discretionary accounts or accept client assets.",
  },
  {
    question: "How often is the methodology updated?",
    answer:
      "Our research methodology is continuously refined as new data, techniques, and academic research become available. Significant methodology updates are documented and published in our research library alongside the relevant research papers.",
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