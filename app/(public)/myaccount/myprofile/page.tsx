import React from 'react';
import MyProfile from './MyProfile';
import ProtectedRoute from '@/components/protectedroute/protectedRoute';

export const metadata = {
  title: 'My Profile - Manage Your Account | Nandhu Bus',
  description: 'View and manage your personal information, saved addresses, and travel preferences on your Nandhu Bus account.',
  keywords: [
    'my profile Nandhu Bus',
    'manage bus account',
    'update user profile',
    'Nandhu Bus user settings',
    'saved bus addresses',
    'travel preferences',
    'bus booking profile',
    'Nandhu account management',
    'bus profile page',
    'user dashboard bus travel'
  ],
  openGraph: {
    title: 'My Profile - Manage Your Account | Nandhu Bus',
    description: 'Easily update your Nandhu Bus account settings and preferences.',
    url: 'https://nandhubus.com/myprofile',
    siteName: 'Nandhu Bus Booking',
    locale: 'en_US',
    type: 'website',
  },
 
};

export default function Page() {
  return (
    <ProtectedRoute>
      <MyProfile />
    </ProtectedRoute>
  );
}
