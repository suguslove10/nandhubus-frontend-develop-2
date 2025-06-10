"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "../ui/section-heading";

export function ServicesSection() {
  const services = [
    {
      title: "Wedding Transportation",
      description: "Keep your wedding guests comfortable and on time with our dedicated group transportation services.",
      image: "/assests/a2.jpeg",    },
    {
      title: "Temple Tours",
      description: "Experience spiritual journeys together with comfortable transportation to sacred destinations.",
      image: "/assests/a5.png",
    },
    {
      title: "Corporate Outings",
      description: "Build team unity with hassle-free group transportation for corporate retreats and events.",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      title: "Family Getaways",
      description: "Create memorable family experiences with comfortable, convenient group travel solutions.",
      image: "/assests/a6.png",
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Our Services"
          subtitle="From weddings to corporate events, we provide tailored transportation solutions for every occasion."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="relative h-64">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
                  {service.title}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}