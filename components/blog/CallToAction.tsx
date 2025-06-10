"use client";
import React from 'react';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <div className="py-16" style={{ backgroundColor: '#0f7bab' }}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready for Your Spiritual Journey?
        </h2>
        <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
          Book your Bengaluruto Tirupati bus package now and embark on a journey of divine blessings at Tirupati, Kanipakam, and Srikalahasti.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="bg-white text-lg px-8 py-6"
            style={{ color: '#0f7bab' }}
          >
            Book Bus Package
          </Button>
          <Button
            variant="outline"
            className="border-white text-white text-lg px-8 py-6"
            style={{ backgroundColor: 'transparent' }}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
