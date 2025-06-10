"use client";

import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';

export function Attractions() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const attractions = [
    {
      name: "Mysore Palace",
      description: "Experience the royal heritage of Mysuru at this magnificent palace, one of the most visited monuments in India. Marvel at the Indo-Saracenic architecture, intricate interiors, and the stunning palace illumination.",
      image: "/assests/m2.jpg",
     
    },
    {
      name: "Chamundi Hills",
      description: "Visit the sacred temple atop Chamundi Hills and enjoy panoramic views of Mysuru city. The hill is home to the famous Chamundeshwari Temple, dedicated to the patron goddess of the Mysore Maharajas.",
      image: "/assests/chamundihills.jpg",
    
    },
    {
      name: "Brindavan Gardens",
      description: "Explore the terraced gardens and dancing fountains at KRS Dam. The symmetrically laid out garden with water channels, fountains, and terraces is a perfect place to unwind in the evening.",
      image: "/assests/brinda.jpg",
    
    },
    {
      name: "St. Philomena's Church",
      description: "Admire the Neo-Gothic architecture of one of the largest churches in India. The twin spires, stained glass windows, and impressive interiors make this a must-visit historical landmark.",
      image: "/assests/st.jpg",
   
    },
    {
      name: "Mysore Zoo",
      description: "One of the oldest and most popular zoos in India with a wide variety of species in spacious, natural enclosures. Perfect for wildlife enthusiasts and families with children.",
      image: "/assests/zoo.jpg",
   
    }
  ];

  return (
    <section id="attractions" ref={ref} className="">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Top Attractions Covered in the Package
        </h2>
        <p className="text-lg text-gray-600">
          Our carefully designed itinerary ensures you experience the best of Mysuru in a single day.
          Each attraction offers a unique glimpse into the city's rich heritage and natural beauty.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {attractions.map((attraction, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            className="h-full"
          >
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={attraction.image}
                  alt={attraction.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{attraction.name}</h3>
              
                </div>
              
                <p className="text-gray-600">{attraction.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Photography tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100"
      >
        <h3 className="text-xl font-bold mb-4 text-center text-blue-800">Photography Tips for Mysuru Attractions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-medium text-blue-700">Mysore Palace</p>
            <p className="text-sm text-gray-600">Best photographed in the evening when illuminated. No photography allowed inside the palace.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-medium text-blue-700">Chamundi Hills</p>
            <p className="text-sm text-gray-600">Early morning visits offer clear panoramic views of the city. Great for landscape photography.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-medium text-blue-700">Brindavan Gardens</p>
            <p className="text-sm text-gray-600">Visit around sunset for golden hour lighting and stay for the illuminated fountains.</p>
          </div>
        </div>

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
      </motion.div>
    </section>
  );
}