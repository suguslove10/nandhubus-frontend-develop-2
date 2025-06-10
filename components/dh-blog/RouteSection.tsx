import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Bus } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

export function RouteSection() {
  return (
    <section className="md:py-24">
      <div className="container">
        <SectionTitle 
          title="Bangalore to Dharmasthala Journey" 
          subtitle="A spiritual journey spanning approximately 300 kilometers"
          centered 
          className="mb-12"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="transition-all hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Route Distance</h3>
                  <p className="text-muted-foreground">
                    The journey covers approximately 300 km from Bangalore to Dharmasthala, 
                    taking you through scenic routes of Karnataka.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Journey Duration</h3>
                  <p className="text-muted-foreground">
                    The trip typically takes 7-8 hours, including comfort breaks 
                    and the special stop at Sowthadka Temple.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Bus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Perfect Weekend Trip</h3>
                  <p className="text-muted-foreground">
                    Ideal for weekend spiritual seekers, with convenient departure 
                    times and comfortable travel options.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}