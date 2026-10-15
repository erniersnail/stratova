import Hero from "@/components/sections/Hero";
import StrategiesSection from "@/components/sections/StrategiesSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import PerformancePreviewSection from "@/components/sections/PerformancePreviewSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import FadeIn from "@/components/ui/FadeIn";

export const metadata = {
  title: "Simplicial Capital — Systematic Investing",
  description:
    "Simplicial Capital applies the same rigor quant funds use — algorithms, data, discipline — bringing institutional-grade systematic research to investors.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <hr className="border-border" />
      <FadeIn>
        <StrategiesSection />
      </FadeIn>
      <hr className="border-border" />
      <FadeIn>
        <PhilosophySection />
      </FadeIn>
      <hr className="border-border" />
      <FadeIn>
        <HowItWorksSection />
      </FadeIn>
      <hr className="border-border" />
      <FadeIn>
        <PerformancePreviewSection />
      </FadeIn>
      <hr className="border-border" />
      <FadeIn>
        <NewsletterSection />
      </FadeIn>
    </>
  );
}
