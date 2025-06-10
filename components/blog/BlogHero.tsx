"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BlogHero = () => {
  const router = useRouter();
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
      {/* Background image layer */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assests/thirumala.jpg')",
        }}
      />

      {/* Overlay (optional for dimming effect) */}
      <div className="absolute inset-0 bg-black opacity-40" />

      {/* Content container */}
      <div className="relative h-full flex flex-col  justify-end mt-20 md:pb-24 lg:pb-32 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
        {/* Back button */}
        <div className="absolute top-12 left-6 md:left-8">
          <a
            href="/blog"
            className="flex items-center gap-2 px-4 py-2 bg-black/50 rounded-lg text-white hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Blogs</span>
          </a>
        </div>

        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl mt-6 font-bold text-white leading-tight tracking-tight drop-shadow-xl">
            Bengaluru to Tirupati Bus Trip
            <br className="hidden md:block" />
            Visit Kanipakam
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl leading-relaxed opacity-90">
            Discover the spiritual journey from Bengaluruto Tirupati with sacred
            stops at Kanipakam temples
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
