"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const testimonials = [
  {
    id: 1,
    name: "Anitha R.",
    location: "Bangalore",
    text: "We booked the wedding bus rental from NandhuBus, and the whole experience was fantastic. The bus was clean, the driver was punctual, and everyone enjoyed the comfortable ride. Highly recommended!",
  },
  {
    id: 2,
    name: "Rajesh K.",
    location: "Bangalore",
    text: "Our pilgrimage trip to Tirupati was smooth and hassle-free thanks to NandhuBus. The driver was experienced, and the bus was very comfortable for our large group. Will definitely book again.",
  },
  {
    id: 3,
    name: "Priya S.",
    location: "Bangalore",
    text: "NandhuBus made our Mysuru day trip so easy! The booking process was simple, and the bus was spacious and air-conditioned. A wonderful service for group travelers.",
  },
  {
    id: 4,
    name: "Vivek M.",
    location: "Bangalore",
    text: "We rented a bus for our college excursion to Dharmasthala. The service was professional, and the driver was very helpful. The whole group was pleased with the trip.",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const next = () => {
    setCurrent((current + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      next();
    }, 6000);

    return () => clearInterval(interval);
  }, [current, autoplay]);

  return (
    <section
      id="testimonials"
      className="bg-blue-50 py-24 dark:bg-gray-900"
      ref={ref}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Don't just take our word for it - hear from our satisfied customers
            about their experiences with NandhuBus.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute -top-10 left-0 hidden h-20 w-20 text-blue-300 opacity-50 dark:text-blue-700 md:block">
            <Quote className="h-full w-full" />
          </div>

          <div className="relative min-h-[250px] overflow-hidden rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 gap-6 md:grid-cols-3"
                onMouseEnter={() => setAutoplay(false)}
                onMouseLeave={() => setAutoplay(true)}
              >
                <div className="md:col-span-3">
                  <blockquote className="mb-6 text-lg italic text-gray-700 dark:text-gray-300">
                    "{testimonials[current].text}"
                  </blockquote>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {testimonials[current].name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {testimonials[current].location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-6 right-6 flex space-x-3 sm:bottom-10 sm:right-10">
              <button
                onClick={prev}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-all hover:bg-blue-600 hover:text-white dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-700"
                aria-label="Previous testimonial"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-all hover:bg-blue-600 hover:text-white dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-700"
                aria-label="Next testimonial"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`mx-1 h-3 w-3 rounded-full transition-all ${
                current === index
                  ? "bg-blue-600 dark:bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
