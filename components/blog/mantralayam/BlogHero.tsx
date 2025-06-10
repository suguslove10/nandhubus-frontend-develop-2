"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface BlogHeroProps {
  title: string;
  subtitle: string;
  imageSrc: string;
}

export default function BlogHero({ title, subtitle, imageSrc }: BlogHeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover opacity-60 scale-105 transform transition-transform duration-[2s]"
          priority
          quality={90}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"
          style={{
            backgroundImage: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 100%)`
          }}
        ></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div 
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Decorative Line */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-[1px] w-12 bg-[#0f7bab]"></div>
            <span className="mx-4 text-[#0f7bab] font-medium tracking-wider uppercase text-sm">Spiritual Journey</span>
            <div className="h-[1px] w-12 bg-[#0f7bab]"></div>
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <Link
              href="/" 
              className="px-8 py-4 bg-[#0f7bab] text-white rounded-full hover:bg-[#0d6b96] transition-colors duration-300 font-medium min-w-[200px] flex items-center justify-center group"
            >
              Book Your Journey
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
         
          </div>

     
        </div>
      </div>
    </div>
  );
}