import { Attractions } from "@/components/blog/Attractions";
import { BlogOverview } from "@/components/blog/BlogOverview";
import { Hero } from "@/components/blog/Hero";
import { Introduction } from "@/components/blog/Introduction";
import { PopularRoute } from "@/components/blog/PopularRoute";


export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
        <Introduction />
        <PopularRoute />
        <BlogOverview />
        <Attractions />
      
      </div>
    </div>
  );
}