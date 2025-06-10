"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Bus, ArrowLeft } from "lucide-react";

export function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assests/my.jpg')",
          transform: `translateY(${scrollY * 0.5}px)`,
          height: `calc(100% + ${scrollY * 0.5}px)`,
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Back link positioned absolutely within the content container */}
        <div className="absolute top-25 left-6 md:left-8 ">
          <a
            href="/blog"
            className="flex items-center gap-2 px-4 py-2 bg-black/50 rounded-lg text-white hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Blogs</span>
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Experience the Magic of Mysuru in a Day
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Explore Karnataka's cultural capital with our comfortable bus
            packages from Bangalore.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              variant="outline"
              className="text-white bg-[#0f7bab] hover:bg-[#0f7bab]"
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              View Packages
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
