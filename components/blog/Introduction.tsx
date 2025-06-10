"use client";

import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Introduction() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="introduction" ref={ref} className="">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Mysuru: Karnataka's Cultural Jewel
          </span>
        </h2>
        
        <div className="space-y-6 text-lg text-gray-700">
          <p>
            Mysuru (formerly Mysore) stands as Karnataka's cultural capital, a city where royal heritage and natural beauty blend seamlessly. Just a short journey from Bangalore, it offers the perfect escape for those seeking a brief yet enriching getaway.
          </p>
          <p>
            What makes Mysuru special is its ability to transport visitors to a different era. The city's well-preserved architecture, stunning palace, sacred hills, and meticulously maintained gardens create an experience that stays with travelers long after they return home.
          </p>
          <p>
            Our one-day tour packages are carefully designed to showcase the best of Mysuru - from its magnificent palace to the serene temples, Gothic architecture, and beautiful gardens - all in a single, well-planned journey that maximizes your time and experience.
          </p>
        </div>
      </motion.div>
      
      {/* Decorative elements */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { 
            title: "Rich Heritage", 
            description: "Experience centuries of royal history and cultural traditions.",
            color: "from-blue-500 to-purple-600"
          },
          { 
            title: "Scenic Beauty", 
            description: "From hilltop vistas to manicured gardens and sacred spaces.",
            color: "from-purple-600 to-pink-500"
          },
          { 
            title: "Culinary Delights", 
            description: "Sample authentic Karnataka cuisine and Mysuru specialties.",
            color: "from-amber-500 to-red-500"
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className={cn("h-2 bg-gradient-to-r", item.color)} />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}