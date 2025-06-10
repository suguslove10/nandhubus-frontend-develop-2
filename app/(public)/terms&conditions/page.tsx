import TermsAndConditions from "../terms-and-conditions/terms";

export const metadata = {
  title: 'Terms and Conditions - Service Agreement | Nandhu Bus',
  description: 'Review the terms and conditions of using Nandhu Bus services. Understand your rights and obligations when booking or traveling with us.',
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
    url: 'https://dev.nandhubus.com/terms',
    siteName: 'Nandhu Bus Booking',
    locale: 'en_US',
    type: 'website',
  }
};

export default function Page() {
  return <TermsAndConditions />;
}
