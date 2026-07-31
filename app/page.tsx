import Hero from "@/components/sections/Hero";
import StrategiesSection from "@/components/sections/StrategiesSection";
import ResearchLibrarySection from "@/components/sections/ResearchLibrarySection";
import ResearchProcessSection from "@/components/sections/ResearchProcessSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import TrustSection from "@/components/sections/TrustSection";
import PerformancePreviewSection from "@/components/sections/PerformancePreviewSection";
import NewsletterSection from "@/components/sections/NewsletterSection";

export default function Home() {
  return (
    <>
      <Hero />
      <StrategiesSection />
      <ResearchLibrarySection />
      <ResearchProcessSection />
      <PhilosophySection />
      <TrustSection />
      <PerformancePreviewSection />
      <NewsletterSection />
    </>
  );
}