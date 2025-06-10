"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, Mail } from "lucide-react";

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('cta-section');
      if (element) {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight - 100) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="border border-[#0f7bab] rounded-2xl p-6 mt-10 sm:p-8 text-center">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#0f7bab]">
      Ready for Your Divine Journey?
    </h2>
    <p className="text-sm sm:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto text-gray-700">
      Let us handle the travel while you focus on the spiritual experience. Our team is available 24/7 to assist with your booking.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
    <a href="tel:+917090007776">
<Button 
className="bg-[#0f7bab] text-white hover:bg-[#0c6a92] transition-colors duration-200 px-4 py-3 sm:px-8 sm:py-4 rounded-lg shadow-md text-sm sm:text-base"
>
Call Now: +91 7090007776
</Button>
</a>

<a href="https://wa.me/917090007776" target="_blank" rel="noopener noreferrer">
<Button 
variant="outline" 
className="border-[#0f7bab] text-[#0f7bab] hover:bg-[#0f7bab]/10 transition-colors duration-200 px-4 py-3 sm:px-8 sm:py-4 rounded-lg text-sm sm:text-base"
>
WhatsApp Enquiry
</Button>
</a>

    </div>
  </section>
  );
}