import FAQ from "@/components/services/Bnglr pacakges/FAQs";
import { Hero } from "@/components/services/Bnglr pacakges/hero";
import Testimonials from "@/components/services/Bnglr pacakges/testimonials";
import TourPackages from "@/components/services/Bnglr pacakges/tourPacakges";
import WhyChooseUs from "@/components/services/Bnglr pacakges/whyChoseUS";
import React from "react";

function bngPackage() {
  return (
    <div>
        <Hero />
        <TourPackages />
        <WhyChooseUs />
          <Testimonials />
          <FAQ />
    </div>
  );
}

export default bngPackage;
