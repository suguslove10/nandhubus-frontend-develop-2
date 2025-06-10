import { Bus, Clock, MapPin, Shield } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { FeatureCard } from "./FeatureCard";

export function FeaturesSection() {
  const features = [
    {
      title: "Comfortable Fleet",
      description: "Travel in our modern fleet of AC and non-AC buses with push-back seats and clean interiors for a relaxed journey.",
      icon: <Bus className="h-6 w-6" />,
    },
    {
      title: "Experienced Drivers",
      description: "Our professional drivers ensure your safety with years of experience navigating the route from Bengaluru to Dharmasthala.",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      title: "Convenient Timings",
      description: "Choose from multiple departure times to fit your schedule, with both overnight and day journey options available.",
      icon: <Clock className="h-6 w-6" />,
    },
    {
      title: "Bonus Temple Visit",
      description: "Enhance your spiritual journey with our special stop at the unique Sowthadka Shree Mahaganapati Temple.",
      icon: <MapPin className="h-6 w-6" />,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        <SectionTitle 
          title="Why Choose Nandhu Bus" 
          subtitle="Experience premium service with features designed for your comfort and convenience"
          centered 
          className="mb-12"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <FeatureCard 
              key={i}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              className="animate-fade-in"
              style={{ 
                animationDelay: `${i * 150}ms`,
                animationFillMode: "both" 
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </section>
  );
}