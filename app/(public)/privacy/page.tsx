import React from 'react'
import PrivacyPolicy from './privacy'

export const metadata = {
  title: 'Privacy Policy | Nandhubus - Bus Rental Services in Bangalore',
  description: 'Read the privacy policy of Nandhubus to learn how we handle user data, secure your information, and ensure safe online bus rental experiences',
  keywords: [
    'Nandhu Bus privacy policy',
    'bus booking data policy',
    'user data protection',
    'how we use data',
    'Nandhu Bus personal information',
    'data collection policy',
    'privacy agreement',
    'bus service privacy',
    'online booking privacy policy',
    'data usage terms Nandhu Bus'
  ],
  openGraph: {
    title: 'Privacy Policy - Your Data, Our Responsibility | Nandhu Bus',
    description: 'Learn about our data practices and how we ensure the privacy and safety of your personal information.',
    url: 'https://nandhubus.com/privacy',
    siteName: 'Nandhu Bus Booking',
    locale: 'en_US',
    type: 'website',
  }
}

export default function page() {
  return <PrivacyPolicy />
}
