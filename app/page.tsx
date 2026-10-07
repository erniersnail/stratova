import Hero from "@/components/sections/Hero";
import StrategiesSection from "@/components/sections/StrategiesSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import TrustSection from "@/components/sections/TrustSection";
import PerformancePreviewSection from "@/components/sections/PerformancePreviewSection";
import NewsletterSection from "@/components/sections/NewsletterSection";

export const metadata = {
  title: "Stratova Quant — Systematic Investing",
  description:
    "Stratova applies the same rigor quant funds use — algorithms, data, discipline — bringing institutional-grade systematic research to individual investors.",
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