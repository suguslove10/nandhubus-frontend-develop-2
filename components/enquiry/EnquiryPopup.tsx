import { useState } from 'react';
import { X, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';

type EnquiryPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const EnquiryPopup: React.FC<EnquiryPopupProps> = ({ isOpen, onClose }) => {
  const contactInfo = {
    email: process.env.NEXT_PUBLIC_EMAIL || 'support@nandhubus.com',
    phone1: process.env.NEXT_PUBLIC_PHONE_1 || '+91 7090007776',
    socialMedia: {
      facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL,
      linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL,
      twitter: process.env.NEXT_PUBLIC_TWITTER_URL,
      instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    }
  };

  const handleSocialClick = (url: string | undefined) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handlePhoneClick = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber.replace(/\s+/g, '')}`);
  };

  const handleEmailClick = () => {
    window.open(`mailto:${contactInfo.email}`);
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-[#0f7bab] text-white p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Contact Nandhu Bus</h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close contact popup"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-5 flex-grow overflow-y-auto">
            <p className="text-gray-600 text-sm mb-5">Get in touch with us for any enquiries or support</p>
            
            {/* Contact Cards */}
            <div className="space-y-4 mb-6">
              {/* Phone 1 */}
              <div 
                className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handlePhoneClick(contactInfo.phone1)}
              >
                <div className="bg-cyan-100 p-2 rounded-full mr-3">
                  <Phone className="text-cyan-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Mobile Number</p>
                  <p className="text-sm font-medium text-gray-800">{contactInfo.phone1}</p>
                </div>
              </div>
              
           
              
              {/* Email */}
              <div 
                className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handleEmailClick}
              >
                <div className="bg-cyan-100 p-2 rounded-full mr-3">
                  <Mail className="text-cyan-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email Support</p>
                  <p className="text-sm font-medium text-gray-800">{contactInfo.email}</p>
                </div>
              </div>
            </div>
            
            {/* Social Media Section */}
            <div className="mb-6">
              <h3 className="font-medium text-base text-gray-800 mb-3">Connect With Us</h3>
              <div className="flex space-x-3">
                {contactInfo.socialMedia.facebook && (
                  <button 
                    onClick={() => handleSocialClick(contactInfo.socialMedia.facebook)}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    aria-label="Facebook"
                  >
                    <FaFacebook size={18} />
                  </button>
                )}
                
                {contactInfo.socialMedia.twitter && (
                  <button 
                    onClick={() => handleSocialClick(contactInfo.socialMedia.twitter)}
                    className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                    aria-label="Twitter"
                  >
                    <FaTwitter size={18} />
                  </button>
                )}
                
                {contactInfo.socialMedia.instagram && (
                  <button 
                    onClick={() => handleSocialClick(contactInfo.socialMedia.instagram)}
                    className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={18} />
                  </button>
                )}
                
                {contactInfo.socialMedia.linkedin && (
                  <button 
                    onClick={() => handleSocialClick(contactInfo.socialMedia.linkedin)}
                    className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={18} />
                  </button>
                )}
                
            
              </div>
            </div>
            
            {/* Support Info */}
            <div className="bg-cyan-50 p-4 rounded-lg">
              <h3 className="font-medium text-base text-cyan-800 mb-2">Support Hours</h3>
              <p className="text-xs text-cyan-700 mb-1">Monday - Sunday: 10:00 AM to 11:00 PM</p>
              <p className="text-xs text-cyan-700">We're available 7 days a week for your travel needs</p>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handlePhoneClick(contactInfo.phone1)}
                className="flex items-center justify-center space-x-1 bg-[#0f7bab] text-white py-2 px-3 text-xs rounded-md hover:bg-[#0f7bab]transition-colors"
              >
                <Phone size={14} />
                <span>Call Now</span>
              </button>
              <button
                onClick={handleEmailClick}
                className="flex items-center justify-center space-x-1 bg-[#0f7bab] text-white py-2 px-3 text-xs rounded-md hover:bg-[#0f7bab] transition-colors"
              >
                <Mail size={14} />
                <span>Email Us</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};