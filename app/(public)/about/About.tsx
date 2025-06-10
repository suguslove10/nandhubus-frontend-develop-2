import { CompanySection } from "@/components/about/CompanySection";
import { HeroSection } from "@/components/about/HeroSection";
import { IntroSection } from "@/components/about/Introsection";
import { MissionSection } from "@/components/about/MissionSection";
import { ServicesSection } from "@/components/about/SerivicesSection";


export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <IntroSection />
      <ServicesSection />
      <MissionSection />
      <CompanySection />
    </main>
  );
}