import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import wedding from "../../../public/assests/a4.png";
import Link from "next/link";

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-screen">
      {/* Background Image with Overlay */}
      {/* <div className="absolute inset-0 bg-black/50"></div> */}
      <div className="absolute inset-0">
        <Image
          src={wedding}
          alt="Wedding"
          fill
          className="object-cover object-[center_10%]"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center z-0">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <p className="text-lg max-w-xl">Your Journey Begins With</p>
            <p className="block text-blue-400 text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight animate-fade-in">
              NandhuBus
            </p>
            <p className="text-lg mb-8 max-w-xl">
              Premium bus rentals and tour packages from Bangalore for groups of
              all sizes. Experience comfort, reliability, and unforgettable
              journeys.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="bg-[#0f7bab] hover:bg-[#0c6991] text-white px-6 py-3 rounded-md transition-colors text-lg font-medium flex items-center justify-center sm:justify-start"
              >
                Book Now
                <ChevronRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
