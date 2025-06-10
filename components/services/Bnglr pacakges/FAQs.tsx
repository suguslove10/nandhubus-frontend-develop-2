"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "What types of buses are available for rent in Bangalore?",
    answer:
      "We offer AC and Non-AC buses with seating capacities from 20 to 50 seats, suitable for family trips, weddings, pilgrimages, and corporate outings.",
  },
  {
    question: "Can I hire a bus in Bangalore for wedding transportation?",
    answer:
      "Yes! We provide reliable and comfortable buses for wedding transportation to make your special day hassle-free.",
  },
  {
    question:
      "Do you offer tour packages from Bangalore to popular destinations?",
    answer:
      "Absolutely! We have popular package trips from Bangalore to places like Dharmasthala, Tirupati, Mantralayam, and Mysore.",
  },
  {
    question: "How do I book a bus rental or tour package?",
    answer:
      "You can book easily through our website or by calling our customer support team. We will help you choose the best package and bus size for your group.",
  },
  {
    question: "Is pickup available only from Bangalore?",
    answer:
      "Yes, all our bus rent packages include pickup only from Bangalore for smooth and convenient travel.",
  },
  {
    question: "What is the distance from Tirupati to Bangalore?",
    answer:
      "The distance is approximately 250 kilometers, and our comfortable buses cover this in about 5-6 hours, depending on traffic.",
  },
  {
    question: "Are the buses safe and well-maintained?",
    answer:
      "Safety is our priority. All buses undergo regular maintenance, and our experienced drivers follow strict safety guidelines.",
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleAccordionChange = (value: string) => {
    setOpenItems((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <section id="faq" className="bg-white py-24 dark:bg-gray-800" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Find answers to common questions about our bus rental services and
            tour packages from Bangalore.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="mx-auto max-w-3xl"
        >
          <Accordion
            type="multiple"
            value={openItems}
            onValueChange={setOpenItems}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="rounded-lg border border-gray-200 px-6 dark:border-gray-700"
                >
                  <AccordionTrigger
                    onClick={() => handleAccordionChange(`item-${index}`)}
                    className="py-4 text-left text-lg font-medium text-gray-900 dark:text-white"
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-1 text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
        {/* Final CTA */}
        <div className="border border-[#0f7bab] rounded-2xl p-6 sm:p-8 text-center mt-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#0f7bab]">
            Ready for Your Journey?
          </h2>
          <p className="text-sm sm:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto text-gray-700">
            Let us handle the travel while you focus on the spiritual
            experience. Our team is available 24/7 to assist with your booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a href="tel:+917090007776">
              <Button className="bg-[#0f7bab] text-white hover:bg-[#0c6a92] transition-colors duration-200 px-4 py-3 sm:px-8 sm:py-4 rounded-lg shadow-md text-sm sm:text-base">
                Call Now: +91 7090007776
              </Button>
            </a>

            <a
              href="https://wa.me/917090007776"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="border-[#0f7bab] text-[#0f7bab] hover:bg-[#0f7bab]/10 transition-colors duration-200 px-4 py-3 sm:px-8 sm:py-4 rounded-lg text-sm sm:text-base"
              >
                WhatsApp Enquiry
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
