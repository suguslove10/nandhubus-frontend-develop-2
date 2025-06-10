"use client";

import { motion } from "framer-motion";
import { Bus, Users, Calendar, UserCheck } from "lucide-react";

export function IntroSection() {
  const features = [
    {
      icon: <Bus className="h-6 w-6 text-[#0f7bab]" />,
      title: "Exclusive Bookings",
      description: "No strangers, no split seating—just your group, your way."
    },
    {
      icon: <Users className="h-6 w-6 text-[#0f7bab]" />,
      title: "Group Coordination",
      description: "We simplify group travel, making your journey smooth and perfectly coordinated."
    },
    {
      icon: <Calendar className="h-6 w-6 text-[#0f7bab]" />,
      title: "Event Travel",
      description: "Specialized in weddings, spiritual retreats, corporate outings, and family functions."
    },
    {
      icon: <UserCheck className="h-6 w-6 text-[#0f7bab]" />,
      title: "Experienced Drivers",
      description: "Courteous professionals who value your time and safety."
    }
  ];

  return (
    <section id="intro" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Experience the Difference of{" "}
              <span className="text-[#0f7bab]">Personalized Group Travel</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Coordinating travel for large groups can be overwhelming—keeping everyone on schedule, 
              staying organized, and ensuring comfort throughout. That's where NandhuBus comes in.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Whether it's a spiritual retreat, a scenic getaway, a family function, or a big wedding celebration, 
            we make sure your travel is as special as the event itself.
          </p>
        </motion.div>
      </div>
    </section>
  );
}