import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "./SectionTitle";

export function WhyChooseSection() {
  const benefits = [
    "Clean, comfortable buses with both AC and non-AC options",
    "Professional drivers prioritizing your safety",
    "Timely pick-up and drop-off at convenient Bangalore locations",
    "Affordable prices compared to taxis or trains",
    "All-inclusive pricing with no hidden charges",
    "Bonus visit to Sowthadka Shree Mahaganapati Temple",
    "Easy booking process and flexible payments",
    "Friendly customer support throughout your journey",
    "Perfect for families, friends, and groups",
    "End-to-end support from departure to return"
  ];

  return (
    <section className=" md:py-24 bg-gray-50">
      <div className="container">
        <SectionTitle 
          title="Why Choose Nandhu Bus" 
          subtitle="Experience a smooth and stress-free journey to Dharmasthala"
          centered 
          className="mb-12"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, i) => (
            <Card 
              key={i}
              className="transition-all hover:shadow-md animate-fade-in"
              style={{ 
                animationDelay: `${i * 100}ms`,
                animationFillMode: "both" 
              } as React.CSSProperties}
            >
              <CardContent className="flex items-start gap-3 p-6">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p>{benefit}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}