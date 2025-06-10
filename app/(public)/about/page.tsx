import AboutPage from './About';

export const metadata = {
  title: 'About Nandhubus | Trusted Bus Rental Company in Bangalore',
  description: 'Nandhubus is a leading bus rental service in Bangalore offering bus bookings service for group travel, weddings, and tours. Learn more about our mission and service quality',
  keywords: [
    'About Nandhu Bus',
    'bus rental company',
    'Bangalore bus services',
    'Nandhubus information',
    'company overview',
    'bus travel Bangalore',
    'luxury bus rentals',
    'bus booking service',
    'team Nandhubus',
    'why choose Nandhubus'
  ],
  openGraph: {
    title: 'About Nandhubus | Reliable Bus Rentals in Bangalore',
    description: 'Explore Nandhubus – your trusted provider for full bus rentals in Bangalore. Learn who we are and why customers rely on our services.',
    url: 'https://nandhubus.com/about',
    siteName: 'Nandhu Bus Booking',
    locale: 'en_US',
    type: 'website',
  }
};

export default function Page() {
  return <AboutPage />;
}
