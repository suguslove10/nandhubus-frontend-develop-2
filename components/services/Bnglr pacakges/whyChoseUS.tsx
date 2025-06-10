"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Shield, Clock, CreditCard, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: CreditCard,
    title: "Affordable Bus Rent",
    description:
      "Competitive rates make bus hire in Bangalore easy and affordable for family, friends, or colleagues.",
  },
  {
    icon: Clock,
    title: "Flexible & Customized Packages",
    description:
      "Schedule your trip according to your preference with our customizable packages.",
  },
  {
    icon: Shield,
    title: "Safe and Comfortable Travel",
    description:
      "Clean, well-maintained buses driven by experienced drivers to ensure a safe journey.",
  },
  {
    icon: Users,
    title: "Convenient Pickup Locations",
    description:
      "We provide convenient pickup from major locations in Bangalore for all our packages.",
  },
];

export default function WhyChooseUs() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="why-us" className="bg-white py-24 dark:bg-gray-800" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Why Choose NandhuBus?
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            We're committed to providing the best bus rental experience with
            premium service and comfortable travel solutions for all your needs.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={cn(
                "rounded-lg bg-gray-50 p-8 shadow-sm transition-all duration-300",
                "hover:shadow-md dark:bg-gray-700"
              )}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
