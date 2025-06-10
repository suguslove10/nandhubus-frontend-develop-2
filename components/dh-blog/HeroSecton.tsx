import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <div className="relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/assests/d1.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </div>
      <div className="absolute top-25 left-6 md:left-8 ">
        <a
          href="/blog"
          className="flex items-center gap-2 px-4 py-2 bg-black/50 rounded-lg text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Blogs</span>
        </a>
      </div>
      {/* Content */}
      <div className="container relative z-10  px-8 py-20 md:py-32 text-white">
        <div className="max-w-3xl mx-auto md:mx-0">
          <div className="inline-block px-3 py-1 mb-4 mt-12 text-sm font-medium rounded-full bg-primary/20 backdrop-blur-sm">
            Premium Spiritual Journey
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-4">
            Bengaluru to Dharmasthala
            <span className="block text-primary-foreground mt-1">
              Spiritual Bus Journey
            </span>
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-xl text-gray-200">
            Experience a comfortable and hassle-free journey to one of
            Karnataka's most revered spiritual destinations.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-[#0f7bab] backdrop-blur-sm hover:bg-white/20 font-medium"
            >
              <Link href="/packages" className="group">
                View Packages
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <svg
        className="w-full h-auto fill-background"
        viewBox="0 0 1440 74"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,37L80,43.2C160,49,320,62,480,56.8C640,52,800,31,960,24.7C1120,19,1280,31,1360,37.2L1440,43L1440,74L1360,74C1280,74,1120,74,960,74C800,74,640,74,480,74C320,74,160,74,80,74L0,74Z" />
      </svg>
    </div>
  );
}
