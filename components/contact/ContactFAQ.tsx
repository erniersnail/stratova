"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  { question: "Do you accept research collaborations?", answer: "We occasionally collaborate with academic institutions and other research firms on specific projects. Collaboration inquiries should be directed to research@stratovaquant.com." },
  { question: "Can I license your research?", answer: "Research licensing is available for institutional investors on a case-by-case basis. Please contact business@stratovaquant.com to discuss your requirements." },
  { question: "Do you offer consulting services?", answer: "We do not offer consulting services. Our focus is on developing and publishing independent quantitative research." },
  { question: "How quickly will I receive a response?", answer: "We aim to respond to all inquiries within two business days. For time-sensitive matters, please indicate the urgency in your message." },
];

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `cf-panel-${i}`;
        const buttonId = `cf-button-${i}`;
        return (
          <div key={i} className="rounded-lg border border-border bg-surface">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-foreground transition-colors hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <span>{item.question}</span>
                <span className={`ml-4 shrink-0 text-secondary transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`} aria-hidden="true">+</span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <div className="px-6 pb-4 text-sm leading-relaxed text-secondary">{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}