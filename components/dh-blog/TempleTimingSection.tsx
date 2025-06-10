import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionTitle } from "./SectionTitle";
import { templeTimings } from "./constants";

export function TempleTimingSection() {
  return (
    <section className="py-16 md:py-24 bg-[url('/assests/d4.jpg')] bg-fixed bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/60 "></div>
      <div className="container relative z-10">
        <SectionTitle 
          title="Temple Timings" 
          subtitle=""
          centered 
          className="mb-12 text-white"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Darshana & Pooja</CardTitle>
                <CardDescription>Daily timings for temple visit</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {templeTimings.darshana.map((time:any, i:any) => (
                  <li key={i} className="text-base flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    {time}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Abhisheka & Archana</CardTitle>
                <CardDescription>Special ritual timings</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {templeTimings.abhisheka.map((time:any, i:any) => (
                  <li key={i} className="text-base flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    {time}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Thulabhara Seva</CardTitle>
                <CardDescription>Special service timings</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {templeTimings.thulabhara.map((time, i) => (
                  <li key={i} className="text-base flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    {time}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                {templeTimings.note}
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}