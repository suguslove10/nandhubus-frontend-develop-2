import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionTitle } from "./SectionTitle";

export function AboutSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-video lg:aspect-square overflow-hidden rounded-xl">
            <Image 
  src="/assests/d2.jpg"               alt="Dharmasthala Temple"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <SectionTitle 
              title="About Dharmasthala" 
              subtitle="A spiritual journey spanning over 800 years of history and tradition"
            />
            
            <p className="mt-6 text-base md:text-lg text-gray-600">
              Dharmasthala temple has its own rich history spanning more than 8 centuries. 
              It is believed that the presence of Lord Manjunatha in the form of a Shivalinga 
              turned this quiet town into a deeply spiritual hub. Over time, the temple has 
              become not just a religious center but also a place of service, community, 
              and moral values.
            </p>
            
            <p className="mt-4 text-base md:text-lg text-gray-600">
              The word Dharmasthala means "the place of Dharma," or morality. Dharma isn't just 
              about religious duty; it represents kindness, truth, justice, and serving humanity. 
              In Dharmasthala, every visitor is welcomed with equal respect; it does not matter 
              what your caste, creed, or background is.
            </p>

            <p className="mt-4 text-base md:text-lg text-gray-600">
              Daily, around thousands of devotees visit the Dharmasthala temple, not just to 
              offer prayers but to find peace, clarity, and a sense of inner calm. That's why 
              so many people from Bangalore and beyond make this trip to reconnect with their 
              spirit and find a break from the busy pace of their lives.
            </p>
            
         
          </div>
        </div>
      </div>
    </section>
  );
}