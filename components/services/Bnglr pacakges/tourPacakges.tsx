"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Package } from "@/types/types";

const packages: Package[] = [
  {
    id: "dharmasthala",
    title: "Dharmasthala Package Tour",
    duration: "2 Days",
    image: "/assests/d1.jpg",
    description: "Travel in comfort to the spiritual Dharmasthala temple. This package includes visits to the famous Sowthadka Shree Mahaganapati Temple, with flexible stops and plenty of time for darshan.",
    category: "spiritual",
    highlights: ["Comfortable Travel", "Clean Interiors", "Experienced Driver", "On-Time Pickup"],
    inclusions: [
      "AC Bus Transportation",
      "Professional Driver",
      "Clean & Well-Maintained Interiors",
      "On-Time Pickup & Drop",
      "Punctual Service"
    ],
    itinerary: [
      {
        day: "Day 1",
        activities: [
          "Early morning departure from Bangalore",
          "Breakfast en route",
          "Arrive at Dharmasthala",
          // "Temple darshan",
          // "Evening accommodation and dinner"
        ]
      },
      {
        day: "Day 2",
        activities: [
          "Morning prayers",
          "Visit to Sowthadka Shree Mahaganapati Temple",
          "Lunch break",
          "Return journey to Bangalore",
          "Evening arrival in Bangalore"
        ]
      }
    ]
  },
  {
    id: "mantralayam",
    title: "Bangalore to Mantralayam",
    duration: "2 Days",
    image: "/assests/m1.jpeg",
    description: "Visit the renowned Sri Raghavendra Swamy Matham with our trusted bus rental service for a peaceful pilgrimage trip.",
    category: "spiritual",
    highlights: ["Safe & Comfortable Journey", "On-Time Pickup & Drop", "Spacious & Clean Buses", "Professional Drivers"],
    inclusions: [
      "AC Bus with Clean Interiors",
      "Experienced & Courteous Driver",
      "Punctual Pickup & Drop",
      "Spacious & Comfortable Seating",
      "Safe & Smooth Travel Experience"
    ],
    itinerary: [
      {
        day: "Day 1",
        activities: [
          "Morning departure from Bangalore",
          "Breakfast en route",
          "Arrive at Mantralayam",
          // "Temple darshan",
          // "Evening accommodation"
        ]
      },
      {
        day: "Day 2",
        activities: [
          "Morning prayers",
          // "Special darshan",
          "Lunch break",
          "Return journey to Bangalore",
          "Night arrival in Bangalore"
        ]
      }
    ]
  },
  {
    id: "tirupati",
    title: "Bangalore to Tirupati",
    duration: "2 Days",
    image: "/assests/ss.jpg",
    description: "Explore the spiritual beauty of Tirupati and nearby Kanipakam Vinayaka Temple with our comfortable bus service.",
    category: "spiritual",
    highlights: ["Well-Maintained AC Coaches", "On-Time Departures", "Comfortable Journey", "Friendly & Skilled Staff"],
    inclusions: [
      "Premium AC Bus Travel",
      "Trained & Courteous Drivers",
      "Neat & Sanitized Interiors",
      "Timely Pickup & Drop Services",
      "Relaxed & Hassle-Free Ride"
    ],
    itinerary: [
      {
        day: "Day 1",
        activities: [
          "Early morning departure from Bangalore",
          "Breakfast en route",
          "Arrive at Tirupati",
          "Visit Kanipakam Vinayaka Temple",
          // "Evening accommodation"
        ]
      },
      {
        day: "Day 2",
        activities: [
          // "Early morning darshan",
          // "Breakfast",
          // "Local temple visits",
          "Return journey to Bangalore",
          "Evening arrival in Bangalore"
        ]
      }
    ]
  },
  {
    id: "mysore",
    title: "Bangalore to Mysore",
    duration: "1 Day",
    image: "/assests/m2.jpg",
    description: "A quick getaway to Mysore including stops at Chamundi Betta, Mysore Palace, and the scenic KRS Dam.",
    category: "sightseeing",
    highlights: ["Palace Visit", "Dam Excursion", "Chamundi Hill", "City Tour"],
    inclusions: [
      "AC Bus Transportation",
      "Professional Driver",
      "Entry Tickets",
      "Breakfast",
      "Guide Services"
    ],
    itinerary: [
      {
        day: "Day 1",
        activities: [
          "Morning departure from Bangalore",
          "Visit Mysore Palace",
          "Lunch break",
          // "Chamundi Hill visit",
          // "KRS Dam excursion",
          "Evening return to Bangalore"
        ]
      }
    ]
  },
  {
    id: "wedding",
    title: "Wedding Bus Rental",
    duration: "Custom",
    image: "/assests/marriage.jpg",
    description: "Comfortable and reliable transportation for your wedding guests. Available for single or multiple day rentals.",
    category: "rental",
    highlights: ["Clean & Well-Maintained Buses", "Neat & Hygienic Interiors", "Professional Drivers", "Comfortable Ride"],
    inclusions: [
      "AC/Non-AC Bus Options",
      "Professional Drivers",
      // "Basic Bus Decoration",
      "Multiple Pickup/Drop Points",
      "Flexible Timing"
    ],
    itinerary: [
      {
        day: "Service Details",
        activities: [
          "Customizable pickup locations",
          "Flexible scheduling",
          "Multiple bus size options",
          "Professional chauffeurs",
          // "Wedding venue coordination"
        ]
      }
    ]
  },
  {
    id: "corporate",
    title: "Corporate Outings",
    duration: "Custom",
    image: "/assests/n2.webp",
    description: "Perfect transportation solution for team outings, retreats, and corporate events from Bangalore.",
    category: "rental",
    highlights: ["Group Transportation", "Professional Service", "Multiple Bus Options", "Custom Itinerary"],
    inclusions: [
      "AC Bus Fleet",
      "Professional Drivers",
      "Flexible Scheduling",
      "Multiple Vehicle Options",
      "Event Coordination"
    ],
    itinerary: [
      {
        day: "Service Details",
        activities: [
          "Customizable routes",
          "Multiple pickup points",
          "Various bus size options",
          "Professional drivers",
          "24/7 support"
        ]
      }
    ]
  }
];

const categories = [
  { id: "all", label: "All Packages" },
  { id: "spiritual", label: "Spiritual Tours" },
  { id: "sightseeing", label: "Sightseeing" },
  { id: "rental", label: "Bus Rentals" },
];

export default function TourPackages() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPackages = packages.filter(
    (pkg) => selectedCategory === "all" || pkg.category === selectedCategory
  );

  return (
    <section id="packages" className="bg-gray-50 py-24 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Popular Bus Tour Packages from Bangalore
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Discover our most popular bus tour packages and bus rental services for your
            next trip from Bangalore. From spiritual journeys to sightseeing adventures.
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="mx-auto grid max-w-md gap-8 grid-cols-2 sm:grid-cols-4">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
    "transition-all duration-200",
    "data-[state=active]:bg-blue-400 text-[12px] data-[state=active]:text-primary-foreground",
    "data-[state=active]:scale-110"
  )}
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-blue-800"
              >
                <div className="relative h-48">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-2 top-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-900 dark:text-white">
                    {pkg.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    {pkg.title}
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {pkg.description}
                  </p>
                  <div className="mb-4">
                    <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                      Highlights:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.map((highlight: string, index: number) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                      Inclusions:
                    </h4>
                    <ul className="list-inside list-disc text-gray-600 dark:text-gray-400">
                      {pkg.inclusions.map((inclusion: string, index: number) => (
                        <li key={index}>{inclusion}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                      Itinerary:
                    </h4>
                    {pkg.itinerary.map((day: { day: string; activities: string[] }, index: number) => (
                      <div key={index} className="mb-2">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {day.day}
                        </h5>
                        <ul className="list-inside list-disc text-gray-600 dark:text-gray-400">
                          {day.activities.map((activity: string, actIndex: number) => (
                            <li key={actIndex}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}