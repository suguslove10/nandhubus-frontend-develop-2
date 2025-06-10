import React from "react";
import PaymentPage from "./PaymentPage";

export const metadata = {
  title: 'Payment - Secure Checkout | Nandhu Bus',
  description: 'Complete your bus ticket booking securely with Nandhu Bus. Enter payment details and confirm your journey with confidence.',
  keywords: [
    'bus booking payment',
    'Nandhu Bus checkout',
    'secure bus booking',
    'bus ticket confirmation',
    'online payment Nandhu Bus',
    'pay for bus tickets',
    'bus booking final step',
    'payment gateway bus ticket',
    'Nandhu Bus secure payment',
    'bus ticket transaction'
  ],
  openGraph: {
    title: 'Payment - Secure Checkout | Nandhu Bus',
    description: 'Finalize your bus booking and complete payment through our secure gateway.',
    url: 'https://nandhubus.com/payments',
    siteName: 'Nandhu Bus Booking',
    locale: 'en_US',
    type: 'website',
  },
 
};

export default function Page() {
  return <PaymentPage />;
}
