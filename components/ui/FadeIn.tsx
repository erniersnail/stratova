"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  /** Optional stagger delay in ms, applied to the transition. */
  delay?: number;
  className?: string;
};

/**
 * Wraps content in a fade+rise reveal that triggers the first time the
 * element enters the viewport. Uses IntersectionObserver — no library.
 *
 * IntersectionObserver is supported in every browser Next.js 16 targets,
 * so no fallback path is needed. If it ever becomes unavailable the
 * element simply remains visible (initial render state is "not yet
 * revealed", which the observer flips in the first frame it runs).
 *
 * No-JS fallback is handled by a <noscript> style rule in app/layout.tsx.
 */
export default function FadeIn({
  children,
  delay = 0,
  className = "",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`fade-in-section ${visible ? "is-visible" : ""} ${className}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
