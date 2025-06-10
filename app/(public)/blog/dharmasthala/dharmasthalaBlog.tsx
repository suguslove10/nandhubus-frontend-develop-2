import { AboutSection } from "@/components/dh-blog/AboutSection";
import { BusTypesSection } from "@/components/dh-blog/BusTypesSection";
import { CTASection } from "@/components/dh-blog/CTASection";
import { FeaturesSection } from "@/components/dh-blog/FeaturesSection";
import { HeroSection } from "@/components/dh-blog/HeroSecton";
import { RouteSection } from "@/components/dh-blog/RouteSection";
import { SowthadkaSection } from "@/components/dh-blog/SowthadkaSection";
import { TempleTimingSection } from "@/components/dh-blog/TempleTimingSection";
import { WhyChooseSection } from "@/components/dh-blog/WhyChooseSection";


export default function Home() {
  return (
    <>
    <div className="min-h-screen">

      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  space-y-24">

      <FeaturesSection />
      <AboutSection />
      <TempleTimingSection />
      <RouteSection />
      <SowthadkaSection />
      <BusTypesSection />
      <WhyChooseSection />
      <CTASection />
      </div>
      </div>
    </>

  );
}