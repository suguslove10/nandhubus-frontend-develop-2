"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import aaa from "../../public/assests/a4.png"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={aaa}
          alt="Luxury bus on road"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-8"
          >
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm md:text-base mb-6">
              Welcome to NandhuBus
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
              Your Journey, <br className="hidden md:block" />
              <span className="text-[#e2f4ff]">Your Experience</span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl"
          >
            NandhuBus offers safe, comfortable, and hassle-free group travel experiences from Bangalore for weddings, temple tours, corporate outings, and family getaways.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <a 
              href="#services" 
              className="inline-block bg-white text-[#0f7bab] font-medium rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 text-base md:text-lg"
            >
              Explore Our Services
            </a>
            <a 
              href="/contact" 
              className="inline-block border-2 border-white text-white font-medium rounded-full px-8 py-4 hover:bg-white/10 transition-all duration-300 text-base md:text-lg"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1,
          delay: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/60 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
}