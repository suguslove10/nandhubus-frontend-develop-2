"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Bus,
  Calendar,
  Users,
  MapPin,
  Clock,
  ArrowLeft,
} from "lucide-react";
import BlogSection from "@/components/blog/mantralayam/BlogSection";
import FeatureCard from "@/components/blog/mantralayam/FeatureCard";
import BlogFAQ from "@/components/blog/mantralayam/BlogFAQ";
import CTASection from "@/components/blog/mantralayam/CTASection";
import BlogHero from "@/components/blog/mantralayam/BlogHero";
import image from "../../../../public/assests/m1.jpeg";
import { useRouter } from "next/navigation";

export default function MantralayamBlogPage() {
  const router = useRouter();
  // Smooth scroll effect for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute("href");
        if (targetId) {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <main className="min-h-screen ">
      <BlogHero
        title="Bengaluru to Mantralayam Temple Trip"
        subtitle="A Spiritual Journey to the Samadhi of Saint Raghavendra Swamy"
        imageSrc={image.src}
      />
      <div className="absolute top-25 left-6 md:left-8">
        <a
          href="/blog"
          className="flex items-center gap-2 px-4 py-2 bg-black/50 rounded-lg text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Blogs</span>
        </a>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* <nav className="mb-8 p-4 rounded-lg bg-white shadow-sm sticky top-4 z-10 overflow-x-auto">
          <ul className="flex space-x-4 text-sm md:text-base">
            <li><a href="#introduction" className="text-gray-600 hover:text-[#0f7bab] transition-colors whitespace-nowrap">Introduction</a></li>
            <li><a href="#why-choose" className="text-gray-600 hover:text-[#0f7bab] transition-colors whitespace-nowrap">Why Choose</a></li>
            <li><a href="#highlights" className="text-gray-600 hover:text-[#0f7bab] transition-colors whitespace-nowrap">Highlights</a></li>
            <li><a href="#bus-options" className="text-gray-600 hover:text-[#0f7bab] transition-colors whitespace-nowrap">Bus Options</a></li>
            <li><a href="#inclusions" className="text-gray-600 hover:text-[#0f7bab] transition-colors whitespace-nowrap">Inclusions</a></li>
            <li><a href="#ideal-for" className="text-gray-600 hover:text-[#0f7bab] transition-colors whitespace-nowrap">Ideal For</a></li>
            <li><a href="#booking" className="text-gray-600 hover:text-[#0f7bab] transition-colors whitespace-nowrap">Booking</a></li>
            <li><a href="#faqs" className="text-gray-600 hover:text-[#0f7bab] transition-colors whitespace-nowrap">FAQs</a></li>
          </ul>
        </nav> */}

        <BlogSection
          id="introduction"
          title="Introduction to Mantralayam"
          icon={<BookOpen className="w-6 h-6 text-[#0f7bab]" />}
          content={
            <div className="space-y-4">
              <p className="leading-relaxed">
                Mantralayam is a sacred pilgrimage town located in Andhra
                Pradesh, renowned for the samadhi (final resting place) of the
                revered Saint Raghavendra Swamy. It attracts thousands of
                devotees every year who come seeking blessings, spiritual
                solace, and healing.
              </p>

              <p className="leading-relaxed">
                The tranquil surroundings and powerful spiritual energy make
                Mantralayam an ideal destination for a one-day or weekend
                pilgrimage from Bangalore, Hyderabad, or neighboring cities.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/assests/m3.jpg"
                    alt="Mantralayam Temple"
                    fill
                    className="object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <h3 className="text-xl font-semibold text-[#0f7bab]">
                    Perfect for Spiritual Seekers
                  </h3>
                  <p>
                    Mantralayam offers a unique blend of deep spirituality,
                    serene nature, and rich cultural heritage. The temple
                    complex is peaceful, perfect for families, senior citizens,
                    and devotees looking for a meaningful spiritual retreat.
                  </p>
                </div>
              </div>
            </div>
          }
        />

        <BlogSection
          id="why-choose"
          title="Why Bangalore to Mantralayam is a Popular Route"
          icon={<MapPin className="w-6 h-6 text-[#0f7bab]" />}
          content={
            <div className="space-y-6">
              <div className="bg-[#f8fcff] border-l-4 border-[#0f7bab] p-4 rounded-r-lg">
                <p className="font-medium">
                  The journey from Bangalore to Mantralayam covers approximately
                  330 km, which can be comfortably done in 6 to 7 hours by road.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <FeatureCard
                  icon={<Bus className="w-8 h-8 text-[#0f7bab]" />}
                  title="Well-Connected Routes"
                  description="Well-connected by highways, making bus travel smooth and hassle-free."
                />
                <FeatureCard
                  icon={<Users className="w-8 h-8 text-[#0f7bab]" />}
                  title="Perfect for Groups"
                  description="Ideal for spiritual seekers, families, and group travelers looking to combine devotion with a peaceful getaway."
                />
                <FeatureCard
                  icon={<Calendar className="w-8 h-8 text-[#0f7bab]" />}
                  title="Flexible Duration"
                  description="The route offers convenient options for day trips, overnight journeys, or weekend stays."
                />
              </div>

              <p className="mt-6 leading-relaxed">
                Are you planning a Mantralayam pilgrimage from Bangalore with
                family, friends, or a group? Nandhu Bus is your complete guide
                to a smooth and comfortable group travel experience. We'll walk
                you through every step of booking your bus package and what to
                expect during your journey.
              </p>

              <div className="bg-gradient-to-r from-[#0f7bab]/10 to-white p-6 rounded-lg mt-6">
                <h3 className="text-xl font-semibold mb-4">
                  With Nandhu Bus, expect:
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#0f7bab] mt-2 mr-2"></span>
                    <span>
                      Comfortable and well-maintained bus options—AC, Non-AC,
                      Sleeper, and Seater
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#0f7bab] mt-2 mr-2"></span>
                    <span>
                      Convenient pickup and drop-off from your location in
                      Bangalore
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#0f7bab] mt-2 mr-2"></span>
                    <span>Transparent pricing and group-friendly packages</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#0f7bab] mt-2 mr-2"></span>
                    <span>
                      Professional drivers with experience on the Mantralayam
                      route
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          }
        />

        <BlogSection
          id="highlights"
          title="Highlights of the Mantralayam Trip"
          icon={<BookOpen className="w-6 h-6 text-[#0f7bab]" />}
          content={
            <div>
              <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                <Image
                  src="/assests/am.webp"
                  alt="Mantralayam Temple Interior"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <p className="text-white p-4 text-lg font-medium">
                    Experience divine blessings at the sacred Brindavana
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-[#0f7bab] mb-3">
                    Sri Raghavendra Swamy Mutt
                  </h3>
                  <p>
                    Visit to the main Brindavana (samadhi) where devotees can
                    offer prayers and seek blessings from the saint known for
                    his miracles and healing powers.
                  </p>
                </div>
                <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-[#0f7bab] mb-3">
                    Seva and Archana
                  </h3>
                  <p>
                    Participate in special poojas, sevas, or archanas that can
                    be pre-booked for a more personal spiritual experience at
                    the temple.
                  </p>
                </div>
                <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-[#0f7bab] mb-3">
                    Time for Meditation
                  </h3>
                  <p>
                    Enjoy quiet time for meditation and self-reflection in the
                    serene environment of the temple complex, away from city
                    life's hustle.
                  </p>
                </div>
                <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-[#0f7bab] mb-3">
                    Prasadam
                  </h3>
                  <p>
                    Receive sacred prasadam after darshan, believed to carry the
                    blessings and energy of the saint.
                  </p>
                </div>
              </div>
            </div>
          }
        />

        <BlogSection
          id="bus-options"
          title="Bus Options Available"
          icon={<Bus className="w-6 h-6 text-[#0f7bab]" />}
          content={
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-3 px-6 bg-[#0f7bab] text-white text-left rounded-tl-lg">
                        Bus Type
                      </th>
                      <th className="py-3 px-6 bg-[#0f7bab] text-white text-left">
                        Capacity
                      </th>
                      <th className="py-3 px-6 bg-[#0f7bab] text-white text-left">
                        Features
                      </th>
                      <th className="py-3 px-6 bg-[#0f7bab] text-white text-left rounded-tr-lg">
                        Best For
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6">Mini Bus (Non-AC)</td>
                      <td className="py-4 px-6">21 Seater</td>
                      <td className="py-4 px-6">
                        Comfortable seating, Luggage space
                      </td>
                      <td className="py-4 px-6">Small groups, Budget trips</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6">Standard Bus (AC)</td>
                      <td className="py-4 px-6">32 Seater</td>
                      <td className="py-4 px-6">
                        AC, Push-back seats, Entertainment
                      </td>
                      <td className="py-4 px-6">Medium groups, Day trips</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6">Deluxe Bus (AC)</td>
                      <td className="py-4 px-6">40 Seater</td>
                      <td className="py-4 px-6">
                        AC, Reclining seats, TV, Charging points
                      </td>
                      <td className="py-4 px-6">
                        Large groups, Comfort travelers
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6">Sleeper Coach</td>
                      <td className="py-4 px-6">30 Berths</td>
                      <td className="py-4 px-6">
                        AC, Sleeper berths, Reading lights
                      </td>
                      <td className="py-4 px-6">Overnight journeys</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 rounded-bl-lg">
                        Multi-Axle Volvo
                      </td>
                      <td className="py-4 px-6">52 Seater</td>
                      <td className="py-4 px-6">
                        Premium AC, Extra legroom, USB ports
                      </td>
                      <td className="py-4 px-6 rounded-br-lg">
                        Premium groups, Extra comfort
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/assests/busBackground.jpg"
                    alt="AC Bus Interior"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Sleeper Bus Interior"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <p className="mt-6 text-center font-medium text-[#0f7bab]">
                All buses are regularly maintained and sanitized for your safety
                and comfort
              </p>
            </div>
          }
        />

        <BlogSection
          id="inclusions"
          title="Tour Inclusions"
          icon={<BookOpen className="w-6 h-6 text-[#0f7bab]" />}
          content={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0f7bab]/10 mb-4">
                  <Bus className="w-6 h-6 text-[#0f7bab]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Bus & Transport</h3>
                <p className="text-gray-600">
                  Bus fare, fuel, tolls, and driver charges included in the
                  package.
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0f7bab]/10 mb-4">
                  <MapPin className="w-6 h-6 text-[#0f7bab]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Pickup & Drop</h3>
                <p className="text-gray-600">
                  Convenient pickup and drop from your location in Bangalore.
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0f7bab]/10 mb-4">
                  <Clock className="w-6 h-6 text-[#0f7bab]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Experienced Drivers
                </h3>
                <p className="text-gray-600">
                  Well-experienced drivers with knowledge of the Mantralayam
                  route.
                </p>
              </div>
            </div>
          }
        />

        <BlogSection
          id="ideal-for"
          title="Ideal for Group Travel"
          icon={<Users className="w-6 h-6 text-[#0f7bab]" />}
          content={
            <div className="space-y-6">
              <p>
                Our Mantralayam packages are specially designed for groups
                seeking a spiritual journey together:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-40 relative">
                    <Image
                      src="/assests/a6.png"
                      alt="Family pilgrimage"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#0f7bab]">
                      Family Pilgrimages
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Multi-generational family groups seeking blessings
                      together
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-40 relative">
                    <Image
                      src="https://images.pexels.com/photos/7114184/pexels-photo-7114184.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Elderly group tours"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#0f7bab]">
                      Elderly Group Tours
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Senior citizen groups with special attention to comfort
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-40 relative">
                    <Image
                      src="/assests/m4.jpg"
                      alt="Spiritual communities"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#0f7bab]">
                      Bhakti Groups
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Spiritual communities and devotee groups
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-40 relative">
                    <Image
                      src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Corporate retreats"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#0f7bab]">
                      Corporate Retreats
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Corporate spiritual retreats or stress-relief tours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        <BlogSection
          id="booking"
          title="How to Book Your Mantralayam Package"
          icon={<Calendar className="w-6 h-6 text-[#0f7bab]" />}
          content={
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#0f7bab] text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="font-semibold mb-3">Choose Travel Date</h3>
                  <p className="text-sm text-gray-600">
                    Select your preferred date for the Mantralayam trip
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm text-center relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#0f7bab] text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="font-semibold mb-3">Select Group Size</h3>
                  <p className="text-sm text-gray-600">
                    Tell us how many people will be traveling
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm text-center relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#0f7bab] text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="font-semibold mb-3">Choose Bus Type</h3>
                  <p className="text-sm text-gray-600">
                    Select AC or Non-AC and other preferences
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm text-center relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#0f7bab] text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <h3 className="font-semibold mb-3">Confirm Booking</h3>
                  <p className="text-sm text-gray-600">
                    Make payment and receive confirmation
                  </p>
                </div>
              </div>

              <div className="bg-[#f8fcff] border border-[#0f7bab]/20 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-[#0f7bab] mb-4">
                  Ready to Book Your Spiritual Journey?
                </h3>
                <p className="mb-6">
                  Our team is available to help you plan the perfect Mantralayam
                  trip for your group
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    onClick={() => {
                      router.push("/contact");
                    }}
                    variant="outline"
                    className="border-[#0f7bab] text-[#0f7bab] hover:bg-[#0f7bab]/10"
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          }
        />

        <BlogSection
          id="faqs"
          title="Frequently Asked Questions"
          icon={<BookOpen className="w-6 h-6 text-[#0f7bab]" />}
          content={<BlogFAQ />}
        />

        <CTASection />
      </div>
    </main>
  );
}
