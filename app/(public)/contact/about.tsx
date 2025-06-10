"use client";
import { Mail, MapPin, Phone, Clock, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { getInTouch } from "@/app/services/data.service";
import { useLanguage } from "@/app/context/language-context";
import Link from "next/link";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function About() {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    name: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useLanguage();

  const mutation = useMutation({
    mutationFn: getInTouch,
    onSuccess: () => {
      setSuccessMessage(t('messageSentSuccess'));
      setFormData({
        email: "",
        subject: "",
        name: "",
        message: "",
      });
    },
    onError: () => {
      setErrorMessage(t('messageFailed'));
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    mutation.mutate(formData);
  };

  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <main className="min-h-screen">
    {/* Updated Hero Section with increased height */}
    <div className="relative h-[200px] md:h-[450px] lg:h-[350px]">
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "transparent",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <div className="text-center py-8 md:py-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            {t('contactUs')}
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-white sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            {t('contactDescription')}
          </p>
        </div>
        <nav className="flex justify-center items-center space-x-2 mt-4 mb-8 text-sm text-indigo-100">
          <Link
            href="/"
            className="flex items-center text-white transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            {t('home')}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{t('contactUs')}</span>
        </nav>
      </div>
    </div>
  
    {/* Main Content - No changes below this point */}
    <div className="grid md:grid-cols-12 gap-6 md:gap-10 px-4 sm:px-6 lg:px-8 py-12">
      {/* Left Sidebar */}
      <div className="md:col-span-5 space-y-6 md:space-y-8">
        {/* Contact Info Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('getInTouch')}</h2>
          
          <div className="space-y-6">
            {/* Phone Support */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg flex-shrink-0">
                <Phone className="w-5 h-5 text-[#0f7bab]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{t('phoneSupport')}</h3>
                <p 
                  className="text-[#0f7bab] hover:text-[#0c6591] cursor-pointer transition-colors"
                  onClick={() => window.open("tel:+917090007776")}
                >
                  +91 7090007776
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {t('supportHoursWeek')}
                </p>
              </div>
            </div>
  
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg flex-shrink-0">
                <Mail className="w-5 h-5 text-[#0f7bab]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{t('email')}</h3>
                <p 
                  className="text-[#0f7bab] hover:text-[#0c6591] cursor-pointer transition-colors"
                  onClick={() => window.open("mailto:support@nandhubus.com")}
                >
                  support@nandhubus.com
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {t('responseTime')}
                </p>
              </div>
            </div>
  
            {/* Head Office */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg flex-shrink-0">
                <MapPin 
                  className="w-5 h-5 text-[#0f7bab] cursor-pointer hover:text-[#0c6591] transition-colors"
                  onClick={() => window.open("https://maps.app.goo.gl/QUzokAf5EQ1aUYip8", "_blank")}
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">⇢ 584 (Seabed2Crest Pvt Ltd)</h3>
                <p className="text-gray-500 text-sm">
                  {t('officeAddress1')}
                </p>
                <p className="text-gray-500 text-sm">{t('officeAddress2')}</p>
                <p className="text-gray-500 text-sm">{t('officeAddress3')}</p>
              </div>
            </div>
  
            {/* Support Hours */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg flex-shrink-0">
                <Clock className="w-5 h-5 text-[#0f7bab]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{t('supportHours')}</h3>
                <p className="text-gray-500 text-sm">{t('weekdayHours')}</p>
                <p className="text-gray-500 text-sm">{t('saturdayHours')}</p>
                <p className="text-gray-500 text-sm">{t('sundayHours')}</p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Social Media Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('followUs')}</h2>
          <div className="flex gap-4">
            <button
              onClick={() => window.open("https://www.facebook.com/NandhuBusIndia", "_blank")}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer transition-colors hover:text-[#0f7bab]"
            >
              <FaFacebookF className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.open("https://twitter.com/NanduBus", "_blank")}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer transition-colors hover:text-[#0f7bab]"
            >
              <FaTwitter className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.open("https://www.linkedin.com/in/nandu-bus-2755622aa/", "_blank")}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer transition-colors hover:text-[#0f7bab]"
            >
              <FaLinkedinIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.open("https://www.instagram.com/nandhubusindia?igsh=MWhpMGo2emxjamhxdA==", "_blank")}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer transition-colors hover:text-[#0f7bab]"
            >
              <FaInstagram className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
  
      {/* Right Content Area */}
      <div className="md:col-span-7">
        <Tabs defaultValue="contact-form" className="w-full">
          <TabsList className="w-full grid grid-cols-1 mb-6 md:mb-8 bg-gray-50 p-1 h-auto rounded-xl">
            <TabsTrigger
              value="contact-form"
              className="py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              {t('contactForm')}
            </TabsTrigger>
        
          </TabsList>
          
          <TabsContent value="contact-form">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t('sendMessage')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-gray-700">{t('name')}</Label>
                  <Input
                    id="name"
                    placeholder={t('yourName')}
                    value={formData.name}
                    className={`border-gray-300 focus:border-[#0f7bab] focus:ring-1 focus:ring-[#0f7bab] ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setFormData({ ...formData, name: value });
                      // Immediate validation
                      if (!value.trim()) {
                        setErrors({ ...errors, name: 'Name is required' });
                      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                        setErrors({ ...errors, name: 'Only letters and spaces allowed' });
                      } else {
                        setErrors({ ...errors, name: '' });
                      }
                    }}
                    onBlur={() => {
                      if (!formData.name.trim()) {
                        setErrors({ ...errors, name: 'Name is required' });
                      } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
                        setErrors({ ...errors, name: 'Only letters and spaces allowed' });
                      }
                    }}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
  
                {/* Email Field */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-gray-700">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('yourEmail')}
                    value={formData.email}
                    className={`border-gray-300 focus:border-[#0f7bab] focus:ring-1 focus:ring-[#0f7bab] ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setFormData({ ...formData, email: value });
                      // Immediate validation
                      if (!value.trim()) {
                        setErrors({ ...errors, email: 'Email is required' });
                      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        setErrors({ ...errors, email: 'Please enter a valid email address' });
                      } else {
                        setErrors({ ...errors, email: '' });
                      }
                    }}
                    onBlur={() => {
                      if (!formData.email.trim()) {
                        setErrors({ ...errors, email: 'Email is required' });
                      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                        setErrors({ ...errors, email: 'Please enter a valid email address' });
                      }
                    }}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
  
                {/* Subject Field */}
                <div className="space-y-3">
                  <Label htmlFor="subject" className="text-gray-700">{t('subject')}</Label>
                  <Input
                    id="subject"
                    placeholder={t('howCanWeHelp')}
                    value={formData.subject}
                    className={`border-gray-300 focus:border-[#0f7bab] focus:ring-1 focus:ring-[#0f7bab] ${
                      errors.subject ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setFormData({ ...formData, subject: value });
                      // Immediate validation
                      if (!value.trim()) {
                        setErrors({ ...errors, subject: 'Subject is required' });
                      } else if (value.length < 5) {
                        setErrors({ ...errors, subject: 'Subject must be at least 5 characters' });
                      } else {
                        setErrors({ ...errors, subject: '' });
                      }
                    }}
                    onBlur={() => {
                      if (!formData.subject.trim()) {
                        setErrors({ ...errors, subject: 'Subject is required' });
                      } else if (formData.subject.length < 5) {
                        setErrors({ ...errors, subject: 'Subject must be at least 5 characters' });
                      }
                    }}
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>
  
                {/* Message Field */}
                <div className="space-y-3">
                  <Label htmlFor="message" className="text-gray-700">{t('message')}</Label>
                  <Textarea
                    id="message"
                    placeholder={t('yourMessage')}
                    className={`min-h-[150px] border-gray-300 focus:border-[#0f7bab] focus:ring-1 focus:ring-[#0f7bab] ${
                      errors.message ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      const value = e.target.value;
                      setFormData({ ...formData, message: value });
                      // Immediate validation
                      if (!value.trim()) {
                        setErrors({ ...errors, message: 'Message is required' });
                      } else if (value.length < 10) {
                        setErrors({ ...errors, message: 'Message must be at least 10 characters' });
                      } else {
                        setErrors({ ...errors, message: '' });
                      }
                    }}
                    onBlur={() => {
                      if (!formData.message.trim()) {
                        setErrors({ ...errors, message: 'Message is required' });
                      } else if (formData.message.length < 10) {
                        setErrors({ ...errors, message: 'Message must be at least 10 characters' });
                      }
                    }}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>
  
                <Button
                  type="submit"
                  disabled={
                    mutation.isPending || 
                    Object.values(errors).some(error => error) ||
                    !formData.name || 
                    !formData.email || 
                    !formData.subject || 
                    !formData.message
                  }
                  className="w-full bg-[#0f7bab] hover:bg-[#0c6591] text-white py-6 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('sending')}
                    </span>
                  ) : (
                    t('sendMessage')
                  )}
                </Button>
  
                {successMessage && (
                  <div className="p-3 bg-green-50 text-green-700 rounded-lg text-center">
                    {successMessage}
                  </div>
                )}
                {errorMessage && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-center">
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>
          </TabsContent>
  
         
        </Tabs>
      </div>
    </div>
  </main>
  );
}

export default About;
