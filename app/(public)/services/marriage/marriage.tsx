import { Benefits } from "@/components/services/marriage/Benefits";
import { FAQ } from "@/components/services/marriage/Faq";
import { Hero } from "@/components/services/marriage/Hero";
import { Testimonials } from "@/components/services/marriage/Testimonials";
import { WeddingEvents } from "@/components/services/marriage/wedding";
import React from "react";

function Marriage() {
  return (
    <div>
      <Hero />
      <Benefits />
      <WeddingEvents />
      <Testimonials />
      <FAQ/>
    </div>
  );
}

export default Marriage;
