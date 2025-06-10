import React from "react";
import Buses from "./Buses";

export const metadata = {
  title: "Available Buses - Package Routes & Timings | Nandhu Bus",
  description:
    "Explore all available buses for your selected travel package with Nandhu Bus. Check bus timings, amenities, and choose the best option for your journey.",
  keywords: [
    "available buses Nandhu",
    "package bus list",
    "bus timings Nandhu",
    "book package bus",
    "bus options for package",
    "Nandhu Bus packages",
    "bus route details",
    "bus travel schedule",
    "bus amenities list",
    "Nandhu bus availability"
  ],
  openGraph: {
    title: "Available Buses - Package Routes & Timings | Nandhu Bus",
    description:
      "Find and compare all available buses for your chosen Nandhu Bus travel package.",
    url: "https://nandhubus.com/packages", 
    siteName: "Nandhu Bus Booking",
    locale: "en_US",
    type: "website"
  }
};

const page = () => {
  return <Buses />;
};

export default page;
