"use client";

import { motion } from "framer-motion";
import { Bus, Shield, Clock, HeartHandshake } from "lucide-react";
import { SectionHeading } from "../ui/section-heading";

export function MissionSection() {
  const values = [
    {
      icon: <Shield className="h-10 w-10 text-[#0f7bab]" />,
      title: "Safety First",
      description: "Your safety is our top priority with well-maintained vehicles and experienced drivers."
    },
    {
      icon: <Clock className="h-10 w-10 text-[#0f7bab]" />,
      title: "Reliability",
      description: "We're committed to safety, punctuality, dependability for every journey."
    },
    {
      icon: <Bus className="h-10 w-10 text-[#0f7bab]" />,
      title: "Comfort",
      description: "Clean, comfortable buses that make the journey as enjoyable as the destination."
    },
    {
      icon: <HeartHandshake className="h-10 w-10 text-[#0f7bab]" />,
      title: "Customer Focus",
      description: "Personal attention and service excellence from booking to arrival."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <SectionHeading 
            title="Our Mission"
            centered
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-xl text-gray-700 leading-relaxed">
              We believe travel should be about the moments you share—not the logistics that get in the way. Whether you're planning a wedding, a spiritual journey, a corporate outing, or a weekend escape, our mission is to deliver safe, dependable, and cost-effective transportation that keeps your group connected and on time.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed mt-4">
              By blending thoughtful service with smart technology, we're changing the way group travel works—starting in Bangalore and reaching far beyond.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div className="mx-auto bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}