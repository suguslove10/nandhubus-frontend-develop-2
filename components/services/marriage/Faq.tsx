import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { faqs } from '@/components/data/faqs';
import { Button } from '@/components/ui/button';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-800">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Find answers to common questions about our wedding bus rental services.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={faq.id} 
              className="mb-4 border border-neutral-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-medium text-neutral-800">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="text-[#0f7bab]" />
                ) : (
                  <ChevronDown className="text-neutral-400" />
                )}
              </button>
              <div 
                className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-64 pb-6' : 'max-h-0'
                }`}
              >
                <p className="text-neutral-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        
           
      {/* Final CTA */}
      <section className="border border-[#0f7bab] rounded-2xl p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#0f7bab]">
          Ready for Your  Journey?
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
    </section>
  );
};