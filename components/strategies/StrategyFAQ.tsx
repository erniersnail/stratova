"use client";

import { useState } from "react";
import SectionHeader from "@/components/common/SectionHeader";
import type { StrategyFAQ as StrategyFAQItem } from "@/lib/strategies";

type StrategyFAQProps = {
  items: StrategyFAQItem[];
};

export default function StrategyFAQ({ items }: StrategyFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <SectionHeader title="Frequently Asked Questions" centered={false} />
      <div className="mt-6 space-y-3">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `strategy-faq-panel-${index}`;
          const buttonId = `strategy-faq-button-${index}`;

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
                  onClick={() => setOpenIndex(isOpen ? null : index)}
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
    </div>
  );
}