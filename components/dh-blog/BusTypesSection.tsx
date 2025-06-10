import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { busTypes } from "./constants";
import { Check } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

export function BusTypesSection() {
  return (
    <section className="md:py-24">
      <div className="container">
        <SectionTitle 
          title="Our Fleet" 
          subtitle=""
          centered 
          className="mb-12"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {busTypes.map((bus, i) => (
            <Card 
              key={bus.id} 
              className="overflow-hidden transition-all hover:shadow-lg animate-fade-in"
              style={{ 
                animationDelay: `${i * 150}ms`,
                animationFillMode: "both" 
              } as React.CSSProperties}
            >
              <div className="relative h-48 w-full">
                <Image 
                  src={bus.image} 
                  alt={bus.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{bus.name}</CardTitle>
                <p className="text-sm font-medium text-muted-foreground">{bus.capacity}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {bus.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}