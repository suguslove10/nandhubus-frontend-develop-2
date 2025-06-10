import { Suspense } from "react";
import List from "./List";

export const metadata = {
  title: 'Available Buses  - Explore Routes, Prices & Timings | Nandhu Bus',
  description: 'Browse through available bus routes, check prices, departure times, and select the best options for your journey with Nandhu Bus.',
  keywords: [
    'bus listings Nandhu',
    'bus route details',
    'available buses',
    'bus schedule',
    'bus timings Nandhu',
    'compare bus prices',
    'select bus seat',
    'bus options Nandhu',
    'Nandhu bus list',
    'bus availability check'
  ],
  openGraph: {
    title: 'Bus Listings - Explore Routes, Prices & Timings | Nandhu Bus',
    description: 'Compare prices, timings, and routes for available buses with Nandhu Bus.',
    url: 'https://nandhubus.com/list',
    siteName: 'Nandhu Bus Booking',
    locale: 'en_US',
    type: 'website',
  },
 
};

export default function Page() {
  return (
    <Suspense>
      <List />
    </Suspense>
  );
}
