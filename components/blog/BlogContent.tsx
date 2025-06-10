"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Bus, Clock, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BlogContent = () => {
  const router = useRouter();
  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 sm:py-12">
      {/* Introduction Section */}
      <section className="mb-10 sm:mb-16">
        <div className="mb-6 sm:mb-8">
          <span className="text-[#0f7bab] font-medium text-xs sm:text-sm uppercase tracking-wider">Spiritual Journeys</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1 sm:mt-2 mb-3 sm:mb-4 text-gray-900">Bengaluru to Tirupati: A Complete Travel Guide</h1>
          <div className="h-1 w-16 sm:w-20 bg-[#0f7bab] rounded-full"></div>
        </div>
        
        <div className="prose max-w-none space-y-4 sm:space-y-6 text-gray-700">
          <p className="text-base sm:text-lg leading-relaxed">
            Tirupati, nestled in the serene hills of Andhra Pradesh, is one of India's most revered pilgrimage destinations, famous for the Sri Venkateswara Swamy Temple. But the spiritual journey doesn't end there. Many devotees now enhance their pilgrimage by visiting the sacred Kanipakam Ganesha Temple .
          </p>
          
          <div className="bg-blue-50 p-4 sm:p-6 rounded-xl border-l-4 border-[#0f7bab]">
            <p className="font-medium text-[#0f7bab] text-sm sm:text-base">
              Pro Tip: Combining Tirupati with visits to Kanipakam creates a more comprehensive spiritual experience, addressing different aspects of devotion and worship.
            </p>
          </div>
          
          <p className="text-base sm:text-lg leading-relaxed">
            These three temples form what many call the "Golden Triangle" of Andhra Pradesh spirituality, each offering unique blessings and experiences for pilgrims traveling from Bengaluru.
          </p>
        </div>
      </section>
      
      {/* Temple Highlights */}
      <section className="mb-10 sm:mb-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-gray-900 relative pb-2">
          <span className="relative">
            Sacred Temples to Visit
            <span className="absolute bottom-0 left-0 w-12 sm:w-16 h-1 bg-[#0f7bab] rounded-full"></span>
          </span>
        </h2>
        
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-xl hover:border-[#0f7bab]/30">
            <div className="h-48 sm:h-64 bg-cover bg-center relative" 
                 style={{
                  backgroundImage: "url('/assests/kanipaka.jpg')"
                }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white">Kanipakam Temple</h3>
                <div className="flex items-center mt-1 sm:mt-2 text-white/90">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="text-xs sm:text-sm">Chittoor, Andhra Pradesh</span>
                </div>
              </div>
            </div>
            <CardContent className="p-4 sm:p-6">
              <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">
                The Kanipakam temple houses a self-manifested idol of Lord Ganesha that is believed to be growing in size. Devotees flock here seeking divine intervention in personal problems and legal matters.
              </p>
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-[#0f7bab] text-sm sm:text-base mb-1">Special Significance</h4>
                <p className="text-xs sm:text-sm text-blue-700">
                  Known as "Varasiddhi Vinayaka" - the grantor of boons and solver of problems.
                </p>
              </div>
            </CardContent>
          </Card>
          
         
        </div>
      </section>
      
      {/* Why Popular Section */}
      <section className="mb-10 sm:mb-16 bg-gradient-to-r from-blue-50 to-blue-100 p-6 sm:p-8 rounded-2xl">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">
            Why Bengaluru to Tirupati is a Pilgrim's Favorite
          </h2>
          
          <div className="grid gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:border-[#0f7bab]/50 transition-colors">
              <div className="text-[#0f7bab] mb-2 sm:mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                  <path d="M12 7v5l3 3"></path>
                </svg>
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-800">Convenient Distance</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                The 250km journey is perfect for a weekend pilgrimage, taking just 5-6 hours by road.
              </p>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:border-[#0f7bab]/50 transition-colors">
              <div className="text-[#0f7bab] mb-2 sm:mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                  <path d="M12 12l4 0"></path>
                  <path d="M12 12l-8 0"></path>
                  <path d="M12 16l0 4"></path>
                  <path d="M12 8l0 -8"></path>
                </svg>
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-800">Multiple Transport Options</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Choose from buses, private rentals, or self-drive options to suit your group size and budget.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-blue-200 shadow-sm">
            <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-gray-800">Cultural Connection</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
              Bengaluru and Tirupati share deep cultural and spiritual ties, with many Bengaluru residents considering Tirupati their "kula deivam" (family deity).
            </p>
            <Button 
              onClick={() => router.push('/')}
              className="bg-[#0f7bab] hover:bg-[#0c6a92] text-white text-sm sm:text-base"
            >
              Explore Route Map <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Nandhu Bus Value Proposition */}
      <section className="mb-10 sm:mb-16">
        <div className="text-center mb-6 sm:mb-10">
          <span className="inline-block px-2 py-1 text-xs font-semibold text-[#0f7bab] bg-blue-100 rounded-full mb-3 sm:mb-4">WHY CHOOSE US</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Your Hassle-Free Pilgrimage with Nandhu Bus</h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            We specialize in making group travel to Tirupati comfortable, affordable, and spiritually fulfilling.
          </p>
        </div>
        
        <div className="grid gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:border-[#0f7bab]/50 transition-all">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <Bus className="h-5 w-5 sm:h-6 sm:w-6 text-[#0f7bab]" />
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-800">Variety of Vehicles</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Choose from AC/Non-AC, Seater/Sleeper buses with capacities from 20 to 52+ seats.
            </p>
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:border-[#0f7bab]/50 transition-all">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"></path>
                <path d="M12 11m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M12 12l0 2.5"></path>
              </svg>
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-800">Spiritual Expertise</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Our drivers know all temple routes and optimal darshan timings for the best experience.
            </p>
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:border-[#0f7bab]/50 transition-all">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                <path d="M9 12h6"></path>
                <path d="M9 16h6"></path>
              </svg>
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-800">Transparent Pricing</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              No hidden charges - fuel, tolls, parking and driver allowances all included.
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 sm:p-6 rounded-xl border border-blue-200">
          <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900">Customizable Itineraries</h3>
          <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">
            We understand every group has unique needs. Our packages can be tailored to include:
          </p>
          <ul className="grid gap-2 sm:gap-3 mb-4 sm:mb-6">
            <li className="flex items-start">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-[#0f7bab] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 text-sm sm:text-base">Additional temple visits (Kanipakam)</span>
            </li>
            <li className="flex items-start">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-[#0f7bab] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 text-sm sm:text-base">Flexible pickup/drop locations in Bengaluru</span>
            </li>
            <li className="flex items-start">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-[#0f7bab] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 text-sm sm:text-base">Special arrangements for senior citizens</span>
            </li>
            <li className="flex items-start">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-[#0f7bab] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 text-sm sm:text-base">Luggage storage solutions</span>
            </li>
          </ul>
        </div>
      </section>
      
      {/* Package Options */}
      <section className="mb-10 sm:mb-16">
        <div className="text-center mb-6 sm:mb-10">
          <span className="inline-block px-2 py-1 text-xs font-semibold text-[#0f7bab] bg-blue-100 rounded-full mb-3 sm:mb-4">PACKAGES</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Explore Our Popular Pilgrimage Packages</h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Whether you're planning a quick weekend trip or an extended spiritual journey, we have the perfect option for your group.
          </p>
        </div>
       
        <div className="text-center">
          <Button
            onClick={() => router.push('/')}
            variant="outline" 
            className="border-[#0f7bab] text-[#0f7bab] hover:bg-blue-50 text-sm sm:text-base"
          >
            View All Packages
          </Button>
        </div>
      </section>
      
      {/* Booking Process */}
      <section className="mb-10 sm:mb-16 bg-gray-50 p-6 sm:p-8 rounded-2xl">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-gray-900">Simple 4-Step Booking Process</h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">Book your spiritual journey in just a few minutes</p>
          
          <div className="space-y-6 sm:space-y-8">
            <div className="flex gap-4 sm:gap-6">
              <div className="flex flex-col items-center">
                <div className="bg-[#0f7bab] text-white rounded-full h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center flex-shrink-0 text-sm sm:text-lg font-bold">1</div>
                <div className="w-0.5 bg-gray-200 h-full mt-2"></div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Select Your Package</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Choose from our range of Tirupati packages based on your group size, budget, and travel preferences.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 sm:gap-6">
              <div className="flex flex-col items-center">
                <div className="bg-[#0f7bab] text-white rounded-full h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center flex-shrink-0 text-sm sm:text-lg font-bold">2</div>
                <div className="w-0.5 bg-gray-200 h-full mt-2"></div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Customize Your Trip</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Add optional destinations like Kanipakam, select your bus type, and choose pickup locations.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 sm:gap-6">
              <div className="flex flex-col items-center">
                <div className="bg-[#0f7bab] text-white rounded-full h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center flex-shrink-0 text-sm sm:text-lg font-bold">3</div>
                <div className="w-0.5 bg-gray-200 h-full mt-2"></div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Enter Travel Details</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Provide your travel dates, passenger information, and any special requirements.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 sm:gap-6">
              <div className="flex flex-col items-center">
                <div className="bg-[#0f7bab] text-white rounded-full h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center flex-shrink-0 text-sm sm:text-lg font-bold">4</div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Secure Payment</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Pay securely online with multiple payment options. Get instant confirmation and e-ticket.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 sm:mt-12 text-center">
            <Button 
              onClick={() => router.push('/')}
              className="bg-[#0f7bab] hover:bg-[#0c6a92] text-white px-6 py-4 sm:px-8 sm:py-6 text-sm sm:text-lg"
            >
              Book Your Spiritual Journey Now
            </Button>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="border border-[#0f7bab] rounded-2xl p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#0f7bab]">
          Ready for Your Divine Journey?
        </h2>
        <p className="text-sm sm:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto text-gray-700">
          Let us handle the travel while you focus on the spiritual experience. Our team is available 24/7 to assist with your booking.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <a href="tel:+917090007776">
  <Button 
    className="bg-[#0f7bab] text-white hover:bg-[#0c6a92] transition-colors duration-200 px-4 py-3 sm:px-8 sm:py-4 rounded-lg shadow-md text-sm sm:text-base"
  >
    Call Now: +91 7090007776
  </Button>
</a>

<a href="https://wa.me/917090007776" target="_blank" rel="noopener noreferrer">
  <Button 
    variant="outline" 
    className="border-[#0f7bab] text-[#0f7bab] hover:bg-[#0f7bab]/10 transition-colors duration-200 px-4 py-3 sm:px-8 sm:py-4 rounded-lg text-sm sm:text-base"
  >
    WhatsApp Enquiry
  </Button>
</a>

        </div>
      </section>
    </div>
  );
};

export default BlogContent;