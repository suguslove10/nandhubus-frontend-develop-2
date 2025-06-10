import React from 'react';
import { Shield, Clock, DollarSign, Users, Heart, Leaf } from 'lucide-react';

export const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: <Shield className="w-12 h-12 text-[#0f7bab]" />,
      title: 'Dedicated Wedding Service',
      description: 'Our focus on weddings means we know exactly how important punctuality, comfort, and reliability are on your big day.'
    },
    {
      icon: <Users className="w-12 h-12 text-[#0f7bab]" />,
      title: 'Wide Variety of Buses',
      description: 'From comfortable 20-seaters to 50-seaters, available in both AC and Non-AC options to match your budget and preferences.'
    },
    {
      icon: <Clock className="w-12 h-12 text-[#0f7bab]" />,
      title: 'Punctual and Reliable',
      description: 'We respect your wedding timeline and guarantee on-time arrivals and departures for a stress-free experience.'
    },
    {
      icon: <DollarSign className="w-12 h-12 text-[#0f7bab]" />,
      title: 'Affordable Rates',
      description: 'Our affordable pricing makes it easy to rent a bus for marriage without stretching your wedding budget.'
    },
    {
      icon: <Heart className="w-12 h-12 text-[#0f7bab]" />,
      title: 'Expert Drivers',
      description: 'Our professional drivers are experienced in group travel and familiar with routes to popular wedding destinations.'
    },
    {
      icon: <Leaf className="w-12 h-12 text-[#0f7bab]" />,
      title: 'Environmentally Friendly',
      description: 'Group travel reduces carbon footprint compared to multiple vehicles on the road.'
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-800">
            Why Choose NandhuBus for Your Wedding
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            When you hire a bus in Bangalore with NandhuBus for your wedding, you're choosing more than just a vehicle; you're choosing peace of mind.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <div className="mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-800">
                {benefit.title}
              </h3>
              <p className="text-neutral-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};