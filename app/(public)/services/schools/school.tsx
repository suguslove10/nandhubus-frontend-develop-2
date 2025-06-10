"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Bus,
  Shield,
  Clock,
  DollarSign,
  Users,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Star,
  GraduationCap,
  Building2,
  Calendar,
  Trophy,
  ArrowRight,
  Zap,
  Heart,
  Award,
} from "lucide-react";

export default function School() {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      title: "Educational Trips & Excursions",
      description:
        "Perfect for field trips, museum visits, science exhibitions, and historical site tours",
      icon: GraduationCap,
      features: [
        "Day trips & full-day excursions",
        "Safe & clean transportation",
        "20-50 seater options",
      ],
    },
    {
      title: "College Industrial Visits",
      description:
        "Reliable transport for industrial visits, seminars, factory tours, and training programs",
      icon: Building2,
      features: [
        "Multi-location trips",
        "25 & 35-seater options",
        "AC buses available",
      ],
    },
    {
      title: "School Picnics & Events",
      description:
        "Transportation for cultural programs, annual day events, and school picnics",
      icon: Calendar,
      features: [
        "AC & Non-AC options",
        "25-50 seater buses",
        "Event coordination support",
      ],
    },
    {
      title: "University Competitions",
      description:
        "Dependable travel for inter-college fests, sports events, and cultural competitions",
      icon: Trophy,
      features: [
        "Short & long-distance travel",
        "32-50 seater options",
        "Experienced drivers",
      ],
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Safety First",
      description:
        "Professional drivers, sanitized vehicles, first-aid kits, and 24/7 support",
    },
    {
      icon: Clock,
      title: "Timely & Reliable",
      description:
        "Punctual pickups, smooth coordination, and strict adherence to schedules",
    },
    {
      icon: DollarSign,
      title: "Budget-Friendly",
      description:
        "All-inclusive packages with no hidden costs, perfect for educational budgets",
    },
    {
      icon: Users,
      title: "Fleet Options",
      description:
        "18-50+ seater buses with AC/Non-AC options for every group size",
    },
  ];

  const bookingSteps = [
    {
      step: 1,
      title: "Reach Out",
      description: "Call us or email with your requirements",
    },
    {
      step: 2,
      title: "Share Details",
      description: "Group size, destination, and travel date",
    },
    {
      step: 3,
      title: "Get Quote",
      description: "Receive customized bus and package options",
    },
    {
      step: 4,
      title: "Confirm & Ride",
      description: "We handle everything from pickup to drop-off",
    },
  ];

  const faqs = [
    {
      question: "Do you provide daily transport services?",
      answer:
        "No. We offer rental-based bus services for schools and colleges — perfect for one-time or event-specific travel like picnics, excursions, or industrial visits.",
    },
    {
      question: "Can we hire multiple buses for a large student group?",
      answer:
        "Yes. We can arrange multiple buses and manage coordinated pick-ups/drop-offs for large groups.",
    },
    {
      question: "Are staff or teacher seats included in the rental?",
      answer:
        "Absolutely. Our buses accommodate both students and faculty comfortably.",
    },
    {
      question: "What areas do you serve?",
      answer:
        "We serve all parts of Bangalore and offer outstation trips across Karnataka and India.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl mt-20 md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Reliable Bus Transportation for Schools & Colleges
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Safe, comfortable, and well-maintained buses for educational
              trips, industrial visits, and college events from Bangalore. From
              20 to 50 seaters - we have the perfect vehicle for your group.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              >
                <a href="tel:+917090007776">
                  <Phone className="h-5 w-5 mr-2" />
                  +91 7090007776
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
              >
                <a href="mailto:support@nandhubus.com">
                  <Mail className="h-5 w-5 mr-2" />
                  Get Quote
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-orange-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </div>
      </section>
      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Student Transportation Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive bus rental services designed specifically for
              educational institutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                    activeService === index
                      ? "border-blue-500 shadow-lg"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setActiveService(index)}
                >
                  <CardHeader className="text-center">
                    <div
                      className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                        activeService === index ? "bg-blue-600" : "bg-blue-100"
                      }`}
                    >
                      <Icon
                        className={`h-8 w-8 ${
                          activeService === index
                            ? "text-white"
                            : "text-blue-600"
                        }`}
                      />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center mb-4">
                      {service.description}
                    </CardDescription>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      {/* Why Choose Us Section */}
      <section className="py-20 bg-blue-100 text-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose NandhuBus?</h2>
            <p className="text-xl text-black max-w-3xl mx-auto">
              We're committed to providing the safest, most reliable
              transportation for your students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-black leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Fleet Options */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fleet Options for Every Group Size
            </h2>
            <p className="text-xl text-gray-600">
              Choose from our range of well-maintained buses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <CardHeader className="text-center">
                <Bus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Small Groups</CardTitle>
                <CardDescription>18-25 Seaters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Perfect for small excursions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">AC & Non-AC options</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Budget-friendly</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 shadow-lg">
              <CardHeader className="text-center">
                <Badge className="mb-2 bg-blue-600 text-white">
                  Most Popular
                </Badge>
                <Bus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Medium Groups</CardTitle>
                <CardDescription>32-35 Seaters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Ideal for most school trips</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Comfortable seating</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Professional drivers</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <CardHeader className="text-center">
                <Bus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Large Groups</CardTitle>
                <CardDescription>45-50+ Seaters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Maximum capacity</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Long-distance comfort</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Multiple buses available</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Booking Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple Booking Process
            </h2>
            <p className="text-xl text-gray-600">
              Get your bus rental sorted in just 4 easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {bookingSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="bg-blue-400 text-white rounded-full w-16 h-16 mx-auto flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                    {step.step}
                  </div>
                  {index < bookingSteps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600  text-white px-8 py-4"
            >
              Start Booking Process
            </Button>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to know about our services
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        <div className="border border-[#0f7bab] md:ml-[230px] md:w-[900px] rounded-2xl p-6 sm:p-8 text-center mt-12">
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
      </section>
      
    </div>
  );
}
