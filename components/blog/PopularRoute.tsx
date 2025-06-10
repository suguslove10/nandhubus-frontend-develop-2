"use client";

import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Clock, Map, Users, Car } from 'lucide-react';

export function PopularRoute() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="popular-route" ref={ref} className="">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Why Bangalore to Mysuru is a <span className="text-primary">Popular Route</span>
        </h2>
        <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          The journey from Bangalore to Mysuru is one of the most traveled routes in South India, 
          and for good reason. Here's why this short trip is a favorite among travelers.
        </p>
      </motion.div>

      <div className="relative">
        {/* Road illustration */}
        <div className="absolute top-1/2 left-0 right-0 h-4 bg-gray-200 rounded-full transform -translate-y-1/2 z-0" />
        
        {/* Route features */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Clock className="h-10 w-10 text-primary" />,
              title: "Short Journey",
              description: "A convenient 3-4 hour drive covering approximately 150 kilometers, perfect for a day trip."
            },
            {
              icon: <Map className="h-10 w-10 text-primary" />,
              title: "Well Connected",
              description: "Excellent connectivity via NICE Road and Mysore Highway with good road conditions throughout."
            },
            {
              icon: <Users className="h-10 w-10 text-primary" />,
              title: "Group-Friendly",
              description: "Ideal for families, school/college groups, and corporate teams looking for a day outing."
            },
            {
              icon: <Car className="h-10 w-10 text-primary" />,
              title: "Scenic Drive",
              description: "Enjoy beautiful countryside views, small towns, and cultural landmarks along the way."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden p-6 flex flex-col items-center text-center"
            >
              <div className="mb-4 p-3 bg-primary/10 rounded-full">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Map or route visualization */}
      <div className="mt-16 bg-gray-100 rounded-xl p-6 overflow-hidden">
        <div className="aspect-w-16 aspect-h-9 relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d498133.3267282889!2d76.57537226562497!3d12.839572300000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!3m2!1d12.9715987!2d77.5945627!4m5!1s0x3baf70381d572ef9%3A0x2b89ece8c0f8396d!2sMysuru%2C%20Karnataka!3m2!1d12.295810199999999!2d76.6393805!5e0!3m2!1sen!2sin!4v1689338732621!5m2!1sen!2sin" 
            className="absolute inset-0 w-full h-full rounded-lg"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          The scenic route from Bangalore to Mysuru via Mysore Road (NH275)
        </p>
      </div>
    </section>
  );
}