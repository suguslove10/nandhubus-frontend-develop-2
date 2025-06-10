"use client";

import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Bus, Settings, ShieldCheck, Smile } from "lucide-react";

export default function CorporateTravel() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <SolutionsSection />
      <FleetSection />
      <WhyChooseUsSection />
      <ProcessSection />
      <CtaSection />
      <FaqSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative mt-8 bg-[#0f7bab] text-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Your Corporate Travel with NandhuBus
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Reliable and comfortable bus rental services in Bangalore designed
              specifically for corporate groups.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white hover:bg-blue-700 text-black font-semibold px-6 py-3 rounded-md transition-colors duration-300"
            >
              Request a Quote
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-4 -left-4 w-full h-full bg-white rounded-lg"></div>
              <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/2402648/pexels-photo-2402648.jpeg"
                  alt="Luxury Corporate Bus"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionsSection() {
  const solutions = [
    {
      title: "Corporate Travel Booking",
      description:
        "Hire a bus in Bangalore for your company's trip with simple online or phone booking. We'll help you choose the right vehicle and route.",
      image: "/assests/a1.jpg",
    },
    {
      title: "Economical Business Solutions",
      description:
        "Enjoy affordable bus rent pricing with no compromise on quality. Whether you need a 20-seater bus or a 50-seater bus for hire in Bangalore, We offer flexible rates.",
      image: "/assests/idea.jpg",
    },
    {
      title: "Executive Travel with Style",
      description:
        "Travel with nandhubus for comfort and professionalism with our well-kept, spacious buses meant to deliver your team and customers a seamless and pleasant ride.",
      image: "/assests/travelwithstyle.jpg",
    },
    {
      title: "Effective Travel for Corporate Groups",
      description:
        "Take the stress out of coordinating multiple vehicles. Our private bus travels in Bangalore are perfect for large teams, ensuring everyone stays together and arrives on time.",
      image: "/assests/corporatetravel.jpg",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-blue-800">
          Corporate Travel Solutions That Work for You
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-blue-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-blue-100"
            >
              <div className="h-48 relative">
                <Image
                  src={solution.image}
                  alt={solution.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-blue-800">
                  {solution.title}
                </h3>
                <p className="text-gray-600">{solution.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FleetSection() {
  const fleetOptions = [
    {
      size: "21-Seater",
      description:
        "For smaller groups or startups, our 21-seater buses offer a relaxing and convenient travel option.",
      image: "/assests/21seater.png",
    },
    {
      size: "25-Seater",
      description:
        "Medium-sized teams or vendor groups can comfortably choose our 25-seater buses.",
      image: "/assests/25seater.png",
    },
    {
      size: "32-Seater",
      description:
        "If you're planning offsite workshops or events, the 32-seater buses provide extra space and comfort.",
      image: "/assests/32seater.png",
    },
    {
      size: "35-Seater",
      description:
        "For HR training sessions or team outings, our 35-seater buses are an excellent fit.",
      image: "/assests/35seater.png",
    },
    {
      size: "50-Seater",
      description:
        "For larger corporate events like conferences or family days, our 50-seater buses can accommodate everyone with ease.",
      image: "/assests/50seater.png",
    },
  ];

  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-blue-800">
          Our Fleet: Perfect Bus Sizes for Every Group
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Whether you have a small team or a large department, we have the right
          bus to suit your needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fleetOptions.map((option, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 relative">
                <Image
                  src={option.image}
                  alt={option.size}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-blue-700">
                  {option.size}
                </h3>
                <p className="text-gray-600">{option.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-100 rounded-lg p-6 text-center">
          <p className="text-blue-800 font-medium mb-4">
            All buses are available in AC and Non-AC. Are you in search of an AC
            rental in Bangalore? Just ask—our buses come with high-performance
            air conditioning to keep your team cool and comfortable throughout
            the trip.
          </p>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUsSection() {
  const reasons = [
    "Private buses in Bangalore are dedicated solely for your team.",
    "Pickup only from Bangalore – Focused, extremely reliable city-based services",
    "Experienced drivers – Trained for long-distance corporate and city trips",
    "Easy booking process – Book online service every time.",
    "Punctual and professional – On-time service every time",
    "Flexible travel plans—customized routes and timing",
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-blue-800">
          Why should you choose Nandhubus for your corporate and office travel
          needs?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex items-start p-4 bg-blue-50 rounded-lg"
            >
              <CheckCircle
                className="text-blue-600 mr-3 mt-1 flex-shrink-0"
                size={20}
              />
              <p className="text-gray-700">{reason}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    {
      title: "Inquire & Select Your Bus Size",
      description:
        "Do you need to rent a 25-seater, 35-seater, or 50-seater bus in Bangalore? Please let us know your group size and destination.",
      icon: Bus,
    },
    {
      title: "Customize Your Package",
      description:
        "Whether it's a package trip from Bangalore or a one-day outing, we help you plan everything.",
      icon: Settings,
    },
    {
      title: "Confirm and Pay Securely",
      description:
        "Our booking process is safe and secure, with no surprises or hidden charges.",
      icon: ShieldCheck,
    },
    {
      title: "Travel Stress-Free",
      description:
        "Sit back and enjoy the journey. Our professional team handles the rest.",
      icon: Smile,
    },
  ];

  return (
    <section className="py-16  text-blue">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <h2 className="text-2xl  md:text-3xl font-bold text-center mb-12">
          Experience Smooth Corporate Travel in 4 Simple Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-4 -top-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold z-10 text-black">
                {index + 1}
              </div>
              <div className="bg-blue-600 rounded-lg h-full overflow-hidden">
                <div className="flex justify-center items-center h-48 bg-blue-500">
                  <step.icon className="text-white w-16 h-16" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-blue-100">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-16 bg-white" id="contact">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="bg-blue-50 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-800">
            Are you prepared to schedule a Corporate Trip?
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
            Make your next team outing simple, efficient, and enjoyable with
            Nandhubus. Whether you're planning a local city retreat or a
            long-distance journey, we offer trusted bus rental services in
            Bangalore tailored for corporate needs.
          </p>
          <Link href="/contact">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-md transition-colors duration-300 text-lg">
              Get a Quote Today
            </button>
          </Link>
          <p className="mt-4 text-gray-500">
            Contact us today to choose the best bus for rent in Bangalore for
            your next office event!
          </p>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const faqs = [
    {
      question:
        "What is the best way to hire a bus in Bangalore for an office trip?",
      answer:
        "You can book through our website or call us directly. Just tell us your group size and destination, and we'll suggest the best bus rental options.",
    },
    {
      question: "Do you offer AC buses for rent in Bangalore?",
      answer:
        "Yes, we offer both AC and Non-AC options. Our AC rentals in Bangalore are ideal for long or hot-weather trips.",
    },
    {
      question: "What's the most popular corporate bus size?",
      answer:
        "Our 25-seater bus hire in Bangalore and 35-seater buses are popular for team outings. We also have 50-seater bus rental options for larger groups.",
    },
    {
      question: "Can we customize our corporate package trip from Bangalore?",
      answer:
        "Absolutely. You can plan stops, schedule timing, and choose places to visit. We'll help you create the perfect plan for your team.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-blue-800">
          Frequently Asked Questions (FAQs)
        </h2>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 border border-blue-200 rounded-lg overflow-hidden bg-white"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
              >
                <span className="font-semibold text-blue-800">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp size={20} className="text-blue-600" />
                ) : (
                  <ChevronDown size={20} className="text-blue-600" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
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
