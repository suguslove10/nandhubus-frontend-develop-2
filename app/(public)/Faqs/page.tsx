import FAQSection from "./faq";

export const metadata = {
  title: 'FAQs - Frequently Asked Questions | Nandhu Bus',
  description: 'Find answers to common questions about Nandhu Bus services, bookings, cancellations, travel policies, and more.',
  keywords: [
    'Nandhu Bus FAQs',
    'bus booking questions',
    'bus cancellation policy',
    'travel policy Nandhu Bus',
    'how to book bus ticket',
    'bus travel tips',
    'bus journey guide',
    'Nandhu Bus support questions',
    'frequently asked questions bus',
    'bus customer service help'
  ],
  openGraph: {
    title: 'FAQs - Frequently Asked Questions | Nandhu Bus',
    description: 'Explore our FAQ section to get answers on bookings, cancellations, policies, and more.',
    url: 'https://nandhubus.com/Faqs',
    siteName: 'Nandhu Bus Booking',
    locale: 'en_US',
    type: 'website',
  },
 
};

export default function Page() {
  return <FAQSection />;
}
