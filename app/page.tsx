import Hero from "@/components/sections/Hero";
import StrategiesSection from "@/components/sections/StrategiesSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import TrustSection from "@/components/sections/TrustSection";
import PerformancePreviewSection from "@/components/sections/PerformancePreviewSection";
import NewsletterSection from "@/components/sections/NewsletterSection";

export const metadata = {
  title: "Stratova Quant — Quantitative Investment Research",
  description:
    "Stratova Quant develops disciplined, evidence-based systematic investment research for long-term investors across U.S. and Indian equity markets.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <hr className="border-border" />
      <StrategiesSection />
      <hr className="border-border" />
      <PhilosophySection />
      <hr className="border-border" />
      <TrustSection />
      <hr className="border-border" />
      <PerformancePreviewSection />
      <hr className="border-border" />
      <NewsletterSection />
    </>
  );
}