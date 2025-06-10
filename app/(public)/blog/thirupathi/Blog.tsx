"use client";
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Bus, Clock } from 'lucide-react';
import BlogHero from '@/components/blog/BlogHero';
import BlogContent from '@/components/blog/BlogContent';
import CallToAction from '@/components/blog/CallToAction';
import SeoMeta from '@/components/seo/SeoMeta';

const Blog = () => {
  return (
    <>
     <SeoMeta
        title="Bus Travel Blog - Tips, Routes & Booking Advice | Nandhu Bus"
        description="Explore our bus travel blog..."
        keywords="bus travel tips, bus booking guide..."
        ogUrl="https://nandhubus.com/blog"
      />
    <div > {/* Add padding to account for fixed navbar */}
    <BlogHero />
    <BlogContent />
    {/* <CallToAction /> */}
  </div>
  </>
  );
};

export default Blog;