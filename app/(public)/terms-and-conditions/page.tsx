import TermsAndConditions from './terms'

export const metadata = {
  title: 'Terms and Conditions | Nandhubus – Bus Booking Bangalore',
  description: 'Review the terms and conditions of booking full bus rentals with Nandhubus. Know your rights and responsibilities before hiring AC or Non-AC buses',
  keywords: [
    'Nandhu Bus terms',
    'bus booking conditions',
    'terms of service',
    'Nandhu Bus agreement',
    'bus travel terms',
    'user obligations',
    'booking rules',
    'bus service policy',
    'terms of use',
    'Nandhu Bus legal policy'
  ],
  openGraph: {
    title: 'Terms and Conditions - Service Agreement | Nandhu Bus',
    description: 'Familiarize yourself with the official terms and conditions that govern use of the Nandhu Bus booking platform.',
    url: 'https://nandhubus.com/terms',
    siteName: 'Nandhu Bus Booking',
    locale: 'en_US',
    type: 'website',
  }
};

export default function Page() {
  return <TermsAndConditions />;
}
