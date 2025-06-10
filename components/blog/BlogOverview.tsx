"use client";

import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { ScrollText, Clock, MapPin, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BlogOverview() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const topics = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Full Itinerary Overview",
      description: "Detailed hour-by-hour plan for making the most of your day in Mysuru",
      color: "bg-blue-100 text-blue-700"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Must-Visit Places",
      description: "All the essential attractions covered in our carefully designed tour package",
      color: "bg-purple-100 text-purple-700"
    },
    {
      icon: <ScrollText className="h-6 w-6" />,
      title: "Bus Package Details",
      description: "Types of buses, features, amenities, and pricing options for your journey",
      color: "bg-amber-100 text-amber-700"
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Booking Process",
      description: "Simple step-by-step guide to book your Mysuru day trip with Nandhu Bus",
      color: "bg-green-100 text-green-700"
    }
  ];

  return (
    <section id="blog-overview" ref={ref} className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          What This Blog Will Cover
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Your comprehensive guide to planning the perfect Mysuru day trip from Bangalore.
          We've covered everything you need to know before booking your journey.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {topics.map((topic, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            className="flex items-start p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className={cn("p-3 rounded-full mr-4", topic.color)}>
              {topic.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
              <p className="text-gray-600">{topic.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}