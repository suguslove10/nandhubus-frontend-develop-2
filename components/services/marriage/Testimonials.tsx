import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '@/components/data/testimonial';

export const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handlePrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-800">
            What Our Customers Say
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Hear from couples who chose NandhuBus for their wedding transportation needs.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          size={20}
                          className={i < testimonial.rating ? "text-[#D4AF37] fill-[#D4AF37]" : "text-neutral-300"}
                        />
                      ))}
                    </div>
                    <p className="text-lg italic mb-6 text-neutral-700">
                      "{testimonial.testimonial}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-[#0f7bab] rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-800">{testimonial.name}</h4>
                        <p className="text-neutral-500">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button 
            className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-neutral-100 transition-colors z-10"
            onClick={handlePrev}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-neutral-100 transition-colors z-10"
            onClick={handleNext}
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-[#0f7bab]' : 'bg-neutral-300'
                }`}
                onClick={() => setActiveIndex(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};