import React from "react";
import Summary from "./Summary";

export const metadata = {
  title: "Package Payment Summary - Review & Confirm | Nandhu Bus",
  description:
    "Review your package booking summary and confirm your payment with Nandhu Bus. Secure, quick, and hassle-free bus package payment process.",
  keywords: [
    "package payment Nandhu Bus",
    "Nandhu Bus summary page",
    "review booking",
    "bus package payment",
    "confirm bus package",
    "Nandhu travel payment",
    "secure bus payment",
    "payment summary Nandhu",
    "Nandhu checkout page",
    "bus booking review"
  ],
  openGraph: {
    title: "Package Payment Summary - Review & Confirm | Nandhu Bus",
    description:
      "Confirm your package booking and make payment easily with Nandhu Bus.",
    url: "https://nandhubus.com/summary", // update if needed
    siteName: "Nandhu Bus Booking",
    locale: "en_US",
    type: "website"
  }
};

const page = () => {
  return <Summary />;
};

export default page;
