"use client";
import { Bus, MapPin, Clock, Shield, Star } from "lucide-react";
import { useRouter } from "next/navigation";

const WelcomePage = () => {
    const router=useRouter();
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
   

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0f7bab] from-nandhu-blue to-nandhu-blue-dark">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-white/5 bg-[radial-gradient(circle,_transparent_20%,_rgba(255,255,255,0.05)_21%)] bg-[length:60px_60px]"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
              Welcome to
              <span className="block text-5xl lg:text-7xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Nandhu Bus
              </span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in delay-200">
              Your trusted partner for comfortable and reliable bus journeys across the country
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 max-w-sm mx-auto animate-fade-in delay-300 cursor-pointer">
            <button className="text-white/90 text-2xl leading-relaxed" onClick={()=>router.push('/')}>
               start now 
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
              Why Choose Nandhu Bus?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in delay-100">
              We are committed to providing you with the best travel experience possible
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: MapPin,
                title: "Wide Network",
                description: "Extensive routes covering major cities and towns"
              },
              {
                icon: Clock,
                title: "On-Time Service",
                description: "Punctual departures and arrivals you can count on"
              },
              {
                icon: Shield,
                title: "Safe & Secure",
                description: "Your safety is our top priority with trained drivers"
              },
              {
                icon: Star,
                title: "Premium Comfort",
                description: "Modern buses with comfortable seating and amenities"
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 text-center animate-slide-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-nandhu-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-nandhu-blue" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Message Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-nandhu-blue/5 to-nandhu-blue-light/5 rounded-2xl p-12 animate-fade-in">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
                Ready to Start Your Journey?
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                At Nandhu Bus, we believe every journey should be memorable. Whether you are traveling 
                for business, leisure, or visiting loved ones, we are here to make your trip comfortable, 
                safe, and enjoyable.
              </p>
              <div className="bg-white rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
                <p className="text-nandhu-blue font-semibold text-lg">
                  "Your comfort is our commitment, your safety is our promise"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default WelcomePage;
