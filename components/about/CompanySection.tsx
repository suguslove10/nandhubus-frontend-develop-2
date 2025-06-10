"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Code, Server, Globe, Shield } from "lucide-react";
import { SectionHeading } from "../ui/section-heading";

export function CompanySection() {
  const techFeatures = [
    {
      icon: <Code className="h-6 w-6 text-[#0f7bab]" />,
      title: "Modern Booking System",
      description: "Easy-to-use platform for quick and efficient booking process."
    },
 
    {
      icon: <Globe className="h-6 w-6 text-[#0f7bab]" />,
      title: "Seamless Communication",
      description: "Direct channel with our team for assistance throughout your journey."
    },
    {
      icon: <Shield className="h-6 w-6 text-[#0f7bab]" />,
      title: "Secure Transactions",
      description: "Protected payment gateway for worry-free bookings."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Powered by S2C Technologies Pvt. Ltd."
          subtitle="NandhuBus is operated by SeaBed2Crest Technologies Private Limited, an innovative IT company based in Bangalore."
          centered
        />

        <div className="flex flex-col lg:flex-row items-center gap-12 mt-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2"
          >
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Technology and Travel"
                width={640}
                height={427}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0f7bab]/70 to-transparent opacity-60"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2"
          >
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Technology Meets Travel</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              By harnessing SeaBed2Crest's tech expertise, we've created a seamless system that offers easy bookings, real-time assistance, and a customer experience you can rely on. Our mission is to bridge technology and travel—delivering group transportation that's not just smarter and safer, but also more enjoyable from start to finish.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {techFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="shrink-0 bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}