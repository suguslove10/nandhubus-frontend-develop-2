"use client";
import { useState, useEffect } from 'react';
import { 
  ChevronUp, 
  Menu, 
  ArrowLeft, 
  FileText, 
  BookOpen, 
  Database, 
  Cookie, 
  RefreshCw, 
  Clock,
  Globe, 
  Trash2, 
  MessageCircle, 
  Lock, 
  CreditCard, 
  Baby, 
  Link as LinkIcon, 
  Edit2,
  Phone,
  User,
  Activity,
  Megaphone,
  HelpCircle,
  Briefcase,
  LineChart,
  PackageX
} from 'lucide-react';
import Link from "next/link";
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = 'https://nandubus-images.s3.ap-south-1.amazonaws.com/Privacy+Policy+for+Nandhubus.pdf';
    link.target = '_blank';  // This makes it open in a new tab
    link.rel = 'noopener noreferrer';  // Recommended for security with target="_blank"
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

  // Define all sections for navigation with Lucide icons
  const sections = [
    { id: 'introduction', title: 'Introduction', icon: FileText },
    { id: 'definitions', title: 'Definitions', icon: BookOpen },
    { id: 'data-collected', title: 'Data Collected', icon: Database },
    { id: 'cookies', title: 'Cookies & Tracking', icon: Cookie },
    { id: 'data-use', title: 'Use of Your Data', icon: RefreshCw },
    { id: 'data-retention', title: 'Data Retention', icon: Clock },
    { id: 'data-transfer', title: 'Data Transfer', icon: Globe },
    { id: 'data-deletion', title: 'Delete Your Data', icon: Trash2 },
    { id: 'data-disclosure', title: 'Data Disclosure', icon: MessageCircle },
    { id: 'security', title: 'Security', icon: Lock },
    { id: 'payments', title: 'Payments Policy', icon: CreditCard },
    { id: 'children', title: "Children's Privacy", icon: Baby },
    { id: 'other-sites', title: 'Links to Other Sites', icon: LinkIcon },
    { id: 'changes', title: 'Policy Changes', icon: Edit2 },
    { id: 'contact', title: 'Contact Us', icon: Phone },
  ];

 // Track scroll position to update active section and show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      // Show back to top button after scrolling down 300px
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // Find the current active section
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      })).filter(item => item.element !== null);

      const currentSection = sectionElements.find(section => {
        if (!section.element) return false;
        const rect = section.element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);

  // Scroll to a section when clicked in the navigation
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setMobileNavOpen(false);
    }
  };

  // Scroll back to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header */}
      <header className="bg-white/90 border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8  top-0 z-40 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
            >
              <ArrowLeft 
                size={20} 
                className="mr-2 group-hover:-translate-x-1 transition-transform" 
              />
            </Link>
            <h1 className="text-[18px] font-semibold text-gray-800">Privacy Policy</h1>

          </div>
          <div className="md:hidden">
            <button 
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <div className="text-center sm:text-left mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">Privacy Policy</h1>
          <p className="text-gray-600 md:text-lg">Your privacy matters to us. This document outlines how we collect, use, and protect your data.</p>
          <Badge variant="outline" className="mt-4 sm:hidden bg-blue-50 text-blue-700 border-blue-200">
            Last updated: April 16, 2025
          </Badge>
        </div> */}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Navigation (Shown only on mobile) */}
          {mobileNavOpen && (
            <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in" onClick={() => setMobileNavOpen(false)}>
              <div 
                className="bg-white w-72 h-full overflow-y-auto p-4 shadow-xl animate-slide-in-right" 
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-semibold text-lg text-gray-900">Sections</h2>
                  <button 
                    onClick={() => setMobileNavOpen(false)} 
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                  >
                    &times;
                  </button>
                </div>
                <nav>
                  <ul className="space-y-1">
                    {sections.map((section) => {
                      const SectionIcon = section.icon;
                      return (
                        <li key={section.id}>
                          <button
                            onClick={() => scrollToSection(section.id)}
                            className={cn(
                              "w-full text-left px-3 py-3 rounded-md transition-colors flex items-center",
                              activeSection === section.id
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                            )}
                          >
                            <SectionIcon className="mr-3 h-5 w-5" />
                            {section.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </div>
          )}

          {/* Desktop Sidebar Navigation */}
          <aside className="hidden md:block w-72 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24 border border-gray-100">
              <h2 className="font-semibold text-[18px] mb-4 text-gray-900 pb-2 border-b border-gray-100">Quick Navigation</h2>
              <nav className="pr-1">
                <ul className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 -mr-2">
                  {sections.map((section) => {
                    const SectionIcon = section.icon;
                    return (
                      <li key={section.id}>
                        <button
                          onClick={() => scrollToSection(section.id)}
                          className={cn(
                            "w-full text-left px-3 py-2.5 rounded-md transition-all duration-200 flex items-center group",
                            activeSection === section.id
                              ? "bg-blue-100 text-blue-700 font-medium shadow-sm"
                              : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                          )}
                        >
                          <SectionIcon className="mr-3 h-4 w-4 opacity-80 group-hover:opacity-100" />
                          <span className="text-sm">{section.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
              {/* Introduction Section */}
              <section id="introduction" className="mb-12">
                <div className="flex items-center mb-4">
                  <FileText size={20} className="mr-3 text-blue-600" />
                  <h2 className="text-[18px] font-bold text-gray-900">Introduction</h2>
                </div>
                <Card className="bg-blue-50/50 mb-4">
                  <CardContent className="pt-6">
                    <p className="text-gray-700 text-[14px]">
                    This Privacy Policy explains how NandhuBus collects, uses, and protects your information when you use our services. By accessing or using our Service, you agree to the terms outlined below.
                    </p>
                  </CardContent>
                </Card>
                <p className="text-gray-700 text-[14px]">
                We are committed to safeguarding your personal data and ensuring transparency in compliance with applicable privacy laws. For questions, contact us at +917090007776/support@nandhubus.com.
                </p>
              </section>

              {/* Interpretation and Definitions */}
              <section id="definitions" className="mb-12">
                <div className="flex items-center mb-4">
                  <BookOpen size={20} className="mr-3 text-blue-600" />
                  <h2 className="text-[18px] font-bold text-gray-900">Interpretation and Definitions</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[18px] font-semibold text-gray-800 mb-3">Interpretation</h3>
                    <p className="text-gray-700 text-[14px] mb-4">
                    Terms with initial capitalization have meanings defined under the conditions below. These definitions apply whether the terms appear in singular or plural.
                    </p>
                  </div>
                
                  <div>
                    <h3 className="text-[18px] font-semibold text-gray-800 mb-3">Definitions</h3>
                    <p className="text-gray-700 mb-4 text-[14px]">In the context of this Privacy Policy, the following terms shall have the meanings set forth below:
                    </p>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <ul className="space-y-2 text-gray-700 text-[14px]">
  {[
    {
      term: 'Registered Account',
      definition: 'A personal login credential granting you access to our platform’s features and services.'
    },
    {
      term: 'Corporate Affiliates',
      definition: 'Entities that directly or indirectly control, are controlled by, or share common ownership with us, where "control" means holding at least 50% of voting shares or decision-making authority.'
    },
    {
      term: 'Business Entity',
      definition: 'Refers to Seabed2Crest Technologies Private Limited, registered at 1st Floor, R D Rajanna Complex, Rajanukunte, Yelahanka Taluk, Bengaluru, Karnataka, India (560064).'
    },
    {
      term: 'Browser Cookies',
      definition: 'Small text files stored on your device when you visit our website, used to enhance functionality and analyze user behavior.'
    },
    {
      term: 'Governing Region',
      definition: 'The state of Karnataka, India, whose laws apply to this Privacy Policy.'
    },
    {
      term: 'Electronic Device',
      definition: 'Any hardware equipment (e.g., computers, smartphones, tablets) capable of connecting to and interacting with our services.'
    },
    {
      term: 'Personal Information',
      definition: 'Any data that can be used—either alone or combined with other information—to identify a specific individual.'
    },
    {
      term: 'Digital Services',
      definition: 'Collectively refers to the Nandhubus online platform, accessible via nandhubus.in.'
    },
    {
      term: 'Authorized Vendors',
      definition: 'Trusted third-party service providers who assist us in delivering, maintaining, or analyzing our services under strict confidentiality agreements.'
    },
    {
      term: 'Automated Usage Data',
      definition: 'Information collected passively through your interactions with our services (e.g., session duration, pages visited).'
    },
    {
      term: 'End User',
      definition: 'Any individual or legal entity (e.g., a company) accessing or using our services on their own behalf or others’ behalf.'
    }
  ].map((item, index) => (
    <li key={index} className="pb-2 last:pb-0">
      <span className="font-medium text-blue-700">{item.term}:</span> {item.definition}
    </li>
  ))}
</ul>

                     </div>
                  </div>
                </div>
              </section>

              {/* Types of Data Collected */}
              <section id="data-collected" className="mb-12">
                <div className="flex items-center mb-4">
                  <Database size={20} className="mr-3 text-blue-600" />
                  <h2 className="text-[18px] font-bold text-gray-900">Collecting and Using Your Personal Data</h2>
                </div>
                <h3 className="text-[18px] font-semibold text-gray-800 mb-3">Types of Data Collected</h3>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                    <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                      <span className="bg-blue-100 text-blue-700 p-1.5 rounded-md mr-2 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.620Z" />
                        </svg>
                      </span>
                      Personal Data
                    </h4>
                    <p className="text-gray-700 mb-3 text-[14px]">
                      While using Our Service, We may ask You to provide Us with certain personally
                      identifiable information that can be used to contact or identify You. This may include:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-[14px] text-gray-700">
                      <li>Email address</li>
                      <li>First name and last name</li>
                      <li>Phone number</li>
                      <li>Address, State, Province, ZIP/Postal code, City</li>
                      <li>Usage Data</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                    <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                      <span className="bg-blue-100 text-blue-700 p-1.5 rounded-md mr-2 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                        </svg>
                      </span>
                      Usage Data
                    </h4>
                    <p className="text-gray-700 text-[14px] mb-3">
                      Usage Data is collected automatically when using the Service.
                    </p>
                    <p className="text-gray-700 text-[14px]">
                      This may include your Device's IP address, browser type, browser version, pages visited,
                      visit timestamps, time spent on pages, device identifiers and other diagnostic data.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-700 mb-3 text-[14px]">
                    When You access the Service by or through a mobile device, We may collect certain
                    additional information automatically, including, but not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4 text-[14px]">
                    <li>Mobile device type and unique ID</li>
                    <li>Mobile device IP address</li>
                    <li>Mobile operating system</li>
                    <li>Mobile browser type</li>
                    <li>Mobile device identifiers</li>
                    <li>Other diagnostic data</li>
                  </ul>
                  <p className="text-gray-700 text-[14px]">
                    We may also collect information that Your browser sends whenever You visit our
                    Service or when You access the Service by or through a mobile device.
                  </p>
                </div>
              </section>

              {/* Tracking Technologies and Cookies */}
              <section id="cookies" className="mb-12">
                <div className="flex items-center mb-4">
                  <Cookie size={20} className="mr-3 text-blue-600" />
                  <h2 className="text-[18px] font-bold text-gray-900">Tracking Technologies and Cookies</h2>
                </div>
                <p className="text-gray-700 mb-4 text-[14px]">
                  We use Cookies and similar tracking technologies to track the activity on Our Service
                  and store certain information. Tracking technologies used are beacons, tags, and scripts
                  to collect and track information and to improve and analyze Our Service.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="font-medium text-gray-800 mb-2">Cookies or Browser Cookies</h4>
                    <p className="text-gray-700 text-sm text-[14px]">
                      A small file placed on Your Device. You can instruct Your browser to refuse all
                      Cookies or to indicate when a Cookie is being sent. However, if You do not accept
                      Cookies, You may not be able to use some parts of our Service.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="font-medium text-gray-800 mb-2">Web Beacons</h4>
                    <p className="text-gray-700 text-sm">
                      Small electronic files (clear gifs, pixel tags, single-pixel gifs) that permit the
                      Company to count users who have visited pages, opened an email, and for other
                      related website statistics.
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-[14px] mb-4">
                  Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on Your
                  personal computer or mobile device when You go offline, while Session Cookies are
                  deleted as soon as You close Your web browser.
                </p>

                <div className="space-y-4 mb-4">
                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-5">
                      <h4 className="font-medium text-gray-800 mb-1">Necessary / Essential Cookies</h4>
                      <p className="text-gray-700 text-sm mb-1">Type: Session Cookies</p>
                      <p className="text-gray-700 text-sm mb-1">Administered by: Us</p>
                      <p className="text-gray-700 text-sm">
                        Purpose: These Cookies are essential to provide You with services available
                        through the Website and to enable You to use some of its features. They help to
                        authenticate users and prevent fraudulent use of user accounts.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-5">
                      <h4 className="font-medium text-gray-800 mb-1">Cookies Policy / Notice Acceptance Cookies</h4>
                      <p className="text-gray-700 text-sm mb-1">Type: Persistent Cookies</p>
                      <p className="text-gray-700 text-sm mb-1">Administered by: Us</p>
                      <p className="text-gray-700 text-sm">
                        Purpose: These Cookies identify if users have accepted the use of cookies on
                        the Website.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-5">
                      <h4 className="font-medium text-gray-800 mb-1">Functionality Cookies</h4>
                      <p className="text-gray-700 text-sm mb-1">Type: Persistent Cookies</p>
                      <p className="text-gray-700 text-sm mb-1">Administered by: Us</p>
                      <p className="text-gray-700 text-sm">
                        Purpose: These Cookies allow us to remember choices You make when You use
                        the Website, such as remembering your login details or language preference.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <p className="text-gray-700 text-[14px]">
                  For more information about the cookies we use and your choices regarding cookies,
                  please visit our Cookies Policy or the Cookies section of our Privacy Policy.
                </p>
              </section>

              {/* Use of Your Personal Data */}
              <section id="data-use" className="mb-12">
                <div className="flex items-center mb-4">
                  <RefreshCw size={20} className="mr-3 text-blue-600" />
                  <h2 className="text-[18px] font-bold text-gray-900">Use of Your Personal Data</h2>
                </div>
                <p className="text-gray-700 text-[14px] mb-4">
                  The Company may use Personal Data for the following purposes:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
  {[
    {
      title: "Service Provision & Maintenance",
      icon: <Activity className="w-5 h-5 text-blue-600 inline-block mr-2" />,
      desc1: "Ensuring continuous platform operation",
      desc2: "Monitoring system performance and usage patterns"
    },
    {
      title: "Account Administration",
      icon: <User className="w-5 h-5 text-blue-600 inline-block mr-2" />,
      desc1: "Facilitating user registration and authentication",
      desc2: "Enabling access to platform features and functionalities"
    },
    {
      title: "Contractual Obligations",
      icon: <FileText className="w-5 h-5 text-blue-600 inline-block mr-2" />,
      desc1: "Executing purchase agreements",
      desc2: "Fulfilling service commitments"
    },
    {
      title: "User Communications",
      icon: <MessageCircle className="w-5 h-5 text-blue-600 inline-block mr-2" />,
      desc1: "Delivering service-related notifications via multiple channels (email, SMS, push notifications)",
      desc2: "Providing important platform updates and announcements"
    },
    {
      title: "Marketing Communications",
      icon: <Megaphone className="w-5 h-5 text-blue-600 inline-block mr-2" />,
      desc1: "Sharing relevant promotional content about related offerings",
      desc2: "Delivering personalized service recommendations"
    },
    {
      title: "Customer Support",
      icon: <HelpCircle className="w-5 h-5 text-blue-600 inline-block mr-2" />,
      desc1: "Addressing user inquiries and service requests",
      desc2: "Resolving technical issues and account matters"
    },
    {
      title: "Corporate Transactions",
      icon: <Briefcase className="w-5 h-5 text-blue-600 inline-block mr-2" />,
      desc1: "Facilitating potential mergers, acquisitions, or asset transfers",
      desc2: "Supporting due diligence processes"
    },
    {
      title: "Service Optimization",
      icon: <LineChart className="w-5 h-5 text-blue-600 inline-block mr-2" />,
      desc1: "Conducting data analytics to identify usage trends",
      desc2: "Implementing platform improvements and feature enhancements"
    }
  ].map((item, i) => (
    <div key={i} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
      <h4 className="font-medium text-gray-800 mb-2 flex items-center">
        {item.icon}
        {item.title}
      </h4>
      <p className="text-gray-700 text-sm">{item.desc1}</p>
      <p className="text-gray-700 text-sm">{item.desc2}</p>
    </div>
  ))}
</div>


                <Separator className="my-6" />
                
                <p className="text-gray-700 mb-4">
                We may disclose your personal information under the following circumstances:
                </p>

                <ul className="space-y-2 text-gray-700 list-disc pl-6 text-[14px]">
  <li>
    <span className="font-medium">Third-Party Service Providers:</span> We engage trusted partners to perform essential business functions, including service analytics, performance monitoring, and customer communications, under strict confidentiality agreements.
  </li>
  <li>
    <span className="font-medium">Corporate Transactions:</span> Your information may be transferred as a business asset in the event of mergers, acquisitions, financing, or sale of company assets, with appropriate privacy protections maintained.
  </li>
  <li>
    <span className="font-medium">Corporate Affiliates:</span> We may share data with entities under common control, all of whom are bound by this Privacy Policy's terms and security standards.
  </li>
  <li>
    <span className="font-medium">Strategic Partners:</span> With select business collaborators to provide you with relevant products, services, or promotional offers that may be of interest.
  </li>
  <li>
    <span className="font-medium">Public Interactions:</span> Information you voluntarily share in public platform areas may be accessible to other users and potentially redistributed beyond our control.
  </li>
  <li>
    <span className="font-medium">Consent-Based Disclosures:</span> We will obtain explicit permission before sharing your data for any purpose not outlined in this policy.
  </li>
</ul>

              </section>

              {/* Retention of Your Personal Data */}
              <section id="data-retention" className="mb-12">
                <div className="flex items-center mb-4">
                  <Clock size={20} className="mr-3 text-blue-600" />
                  <h2 className="text-[18px] font-bold text-gray-900">Retention of Your Personal Data</h2>
                </div>
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <p className="text-gray-700 text-[14px]">
                    The Company retains your Personal Data only as long as necessary to fulfill the purposes described in this Privacy Policy
                    ,including to comply with legal obligations, resolve disputes, enforce agreements, and maintain business records.
                    </p>
                  </CardContent>
                </Card>
                <p className="text-gray-700 text-[14px]">
                Usage Data is generally kept for a shorter period unless required to enhance service security,
 improve functionality, or meet legal requirements. 
 All data retention practices adhere to applicable laws and our internal governance standards.
                </p>
              </section>

              {/* Transfer of Your Personal Data */}
              <section id="data-transfer" className="mb-12">
                <div className="flex items-center mb-4">
                  <Globe size={20} className="mr-3 text-blue-600" />
                  <h2 className="text-[18px] font-bold text-gray-900">Transfer of Your Personal Data</h2>
                </div>
                <p className="text-gray-700 text-[14px] mb-4">
                  Your information, including Personal Data, is processed at the Company's operating
                  offices and in any other places where the parties involved in the processing are located.
                  It means that this information may be transferred to — and maintained on — computers
                  located outside of Your state, province, country or other governmental jurisdiction where
                  the data protection laws may differ than those from Your jurisdiction.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800">
                    <span className="font-medium">Important:</span> Your consent to this Privacy Policy followed by Your submission of information
                    represents Your agreement to that transfer.
                  </p>
                </div>
                <p className="text-gray-700 text-[14px]">
                  The Company will take all steps reasonably necessary to ensure that Your data is
                  treated securely and in accordance with this Privacy Policy and no transfer of Your
                  Personal Data will take place to an organization or a country unless there are adequate
                  controls in place including the security of Your data and other personal information.
                </p>
              </section>

              {/* Delete Your Personal Data */}
              <section id="data-deletion" className="mb-12">
                <div className="flex items-center mb-4">
                  <Trash2 size={20} className="mr-3 text-blue-600" />
                  <h2 className="text-[18px] font-bold text-gray-900">Delete Your Personal Data</h2>
                </div>
                <p className="text-gray-700 text-[14px] mb-4">
                You may formally request the permanent removal of your Personal Data from our systems.

                </p>
                
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 mb-4">
                  <h4 className="font-medium text-gray-800 mb-3">How to delete your data</h4>
                  <ul className="space-y-2 text-[14px] text-gray-700">
                    <li className="flex items-start">
                      <span className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-gray-600 mr-3 mt-0.5 flex-shrink-0">1</span>
                      <span>Sign in to Your Account if you have one</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-gray-600 mr-3 mt-0.5 flex-shrink-0">2</span>
                      <span>Visit the account settings section</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-gray-600 mr-3 mt-0.5 flex-shrink-0">3</span>
                      <span>Select the option to manage your personal information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-gray-600 mr-3 mt-0.5 flex-shrink-0">4</span>
                      <span>Follow the instructions to delete your data</span>
                    </li>
                  </ul>
                </div>
                
                <p className="text-gray-700 text-[14px] mb-4">
                  Our Service may give You the ability to delete certain information about You from within
                  the Service.
                </p>
                <p className="text-gray-700 text-[14px] mb-4">
                  You may also contact Us to request access to, correct, or delete any personal information 
                  that You have provided to Us.
                </p>
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                  <p className="text-gray-700 text-[14px]">
                    <span className="font-semibold">Note:</span> We may need to retain certain information when we have a
                    legal obligation or lawful basis to do so.
                  </p>
                </div>
              </section>

              {/* Disclosure of Your Personal Data */}
              <section id="data-disclosure" className="mb-12">
                <div className="flex items-center mb-4">
                  <MessageCircle size={20} className="mr-3 text-blue-600" />
                  <h2 className="text-[18px] font-bold text-gray-900">Disclosure of Your Personal Data</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[18px] font-semibold text-gray-800 mb-3">Business Transactions</h3>
                    <p className="text-gray-700 text-[14px]">
                      If the Company is involved in a merger, acquisition or asset sale, Your Personal Data
                      may be transferred. We will provide notice before Your Personal Data is transferred and
                      becomes subject to a different Privacy Policy.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-[18px] font-semibold text-gray-800 mb-3">Law enforcement</h3>
                    <p className="text-gray-700 text-[14px]">
                      Under certain circumstances, the Company may be required to disclose Your Personal
                      Data if required to do so by law or in response to valid requests by public authorities
                      (e.g. a court or a government agency).
                    </p>
                  </div>
                  
                 <div>
  <h3 className="text-[18px] font-semibold text-gray-800 mb-3">Other legal requirements</h3>
  <p className="text-gray-700 text-[14px] mb-4">
    The Company may disclose Your Personal Data in the good faith belief that such action
    is necessary to:
  </p>
  <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
    <ul className="space-y-2 text-gray-700 text-[14px]">
      <li className="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-green-500 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Comply with a legal obligation
      </li>
      <li className="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-green-500 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Protect and defend the rights or property of the Company
      </li>
      <li className="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-green-500 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Prevent or investigate possible wrongdoing in connection with the Service
      </li>
      <li className="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-green-500 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Protect the personal safety of Users of the Service or the public
      </li>
      <li className="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-green-500 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Protect against legal liability
      </li>
    </ul>
  </div>
</div>
                </div>
              </section>

              {/* Security of Your Personal Data */}
              <section id="security" className="mb-12">
                <div className="flex items-center mb-4">
                  <Lock size={20} className="mr-3 text-blue-600" />
                  <h2 className="text-[18px] font-bold text-gray-900">Security of Your Personal Data</h2>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg p-6 border border-blue-100">
                  <div className="flex items-start">
                    <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-gray-700 text-[18px]">             
We implement industry-standard measures to safeguard your Personal Data; 
however, no electronic transmission or storage system can be guaranteed as completely secure. 
While we employ commercially reasonable protections, absolute security cannot be assured.
                    </p>
                  </div>
                </div>
              </section>

              {/* Payments Policy */}
              <section id="payments" className="mb-12">
                <div className="flex items-center mb-4">
                  <CreditCard size={20} className="mr-3 text-blue-600" />
                  <h2 className="text-[18px] font-bold text-gray-900">Payments Policy</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[18px] font-semibold text-gray-800 mb-3">Payment Processing</h3>
                    <p className="text-gray-700 text-[14px]">
                    All payment transactions are securely processed through certified third-party payment processors. 
We do not collect, store, or process your complete payment card or banking details on our systems. 
Your payment information is transmitted directly to our authorized payment partners in compliance
 with PCI-DSS standards, and its handling is governed by the respective processor's privacy and security policies.
                    </p>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
                      <h3 className="text-[18px] font-semibold text-gray-800 mb-3">Accepted Payment Methods</h3>
                   <ul className="space-y-2 text-[14px]">
  {['Credit and debit cards', 'UPI (Unified Payments Interface)', 'Net banking', 'Wallets or other digital payment methods'].map((method, i) => (
    <li key={i} className="flex items-start text-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-green-500 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      {method}
    </li>
  ))}
</ul>
                      <p className="mt-3 text-sm text-gray-600">The availability of these methods may vary depending on Your location and the Service being used.</p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Security</h3>
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center ">
                          <div className="bg-green-100 p-1.5 rounded-full mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <span className="text-gray-700  text-[14px]">Encrypted transactions (HTTPS, SSL/TLS)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-green-100 p-1.5 rounded-full mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <span className="text-gray-700  text-[14px]">PCI-DSS compliant processors</span>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-green-100 p-1.5 rounded-full mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <span className="text-gray-700  text-[14px]">Secure payment handling</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-[18px] font-semibold text-gray-800 mb-3">Refunds and Cancellations</h3>
                    <p className="text-gray-700 text-[14px] mb-4">
                      Refund and cancellation policies are specific to the Service or product
                      purchased. Please refer to the specific product or service page, or contact Our
                      support team for details regarding:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-center">
                        <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-700 text-[14px]">Eligibility for refunds</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-center">
                        <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-700 text-[14px]">Timeframe for processing refunds</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-center">
                        <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <p className="text-gray-700  text-[14px]">Conditions for refunds</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-[18px] font-semibold text-gray-800 mb-3">Billing and Charges</h3>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-5">
                      <p className="text-gray-700  text-[14px]">
                      By using our services, you agree to pay all applicable fees and charges,  taxes or additional costs imposed by payment processors. 
Payments must be completed promptly  with the billing terms provided.
In case of a failed payment or chargeback, we reserve the right to suspend or 
terminate your access to the services until the issue is resolved
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Children's Privacy */}
              <section id="children" className="mb-12">
                <div className="flex items-center mb-4">
                  <Baby size={20} className="mr-3 text-blue-600" />
                  <h2 className="text-[18px] font-bold text-gray-900">Children's Privacy</h2>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-5 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.720-3L13.720 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.720 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">Important Notice</h4>
                      <p className="text-gray-700  text-[14px]">
                        Our Service does not address anyone under the age of 13. We do not knowingly collect
                        personally identifiable information from anyone under the age of 13.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700  text-[14px]  mb-4">
                  If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data,
                  please contact Us. If We become aware that We have collected Personal Data from
                  anyone under the age of 13 without verification of parental consent, We take steps to
                  remove that information from Our servers.
                </p>
                <p className="text-gray-700  text-[14px]">
                  If We need to rely on consent as a legal basis for processing Your information and Your
                  country requires consent from a parent, We may require Your parent's consent before
                  We collect and use that information.
                </p>
              </section>

              {/* Links to Other Websites */}
              <section id="other-sites" className="mb-12">
                <div className="flex items-center mb-4">
                  <LinkIcon size={20} className="mr-3 text-blue-600" />
                  <h2 className="text-[18px] font-bold text-gray-900">Links to Other Websites</h2>
                </div>
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="bg-blue-50 p-2 rounded-full mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <p className="text-gray-700  text-[14px]">
                        Our Service may contain links to other websites that are not operated by Us. If You click
                        on a third party link, You will be directed to that third party's site. We strongly advise You
                        to review the Privacy Policy of every site You visit.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <p className="text-gray-700  text-[14px]">
                  We have no control over and assume no responsibility for the content, privacy policies
                  or practices of any third party sites or services.
                </p>
              </section>

              {/* Changes to this Privacy Policy */}
              <section id="changes" className="mb-12">
                <div className="flex items-center mb-4">
                  <Edit2 size={20} className="mr-3 text-blue-600" />
                  <h2 className="text-[18px] font-bold text-gray-900">Changes to this Privacy Policy</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700  text-[14px]">
                    We may update Our Privacy Policy from time to time. We will notify You of any changes
                    by posting the new Privacy Policy on this page.
                  </p>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <p className="text-gray-700  text-[14px]">
                      <span className="font-semibold text-blue-700">Notification:</span> We will let You know via email and/or a prominent notice on Our Service, prior to the
                      change becoming effective and update the "Last updated" date at the top of this Privacy
                      Policy.
                    </p>
                  </div>
                  <p className="text-gray-700  text-[14px]">
                    You are advised to review this Privacy Policy periodically for any changes. Changes to
                    this Privacy Policy are effective when they are posted on this page.
                  </p>
                </div>
              </section>

{/* Shipping Policy */}
<section id="shipping-policy" className="mb-12">
  <div className="flex items-center mb-4">
    <PackageX size={20} className="mr-3 text-blue-600" />
    <h2 className="text-[18px] font-bold text-gray-900">Shipping Policy</h2>
  </div>
  <div className="space-y-4">
    <p className="text-gray-700 text-[14px]">
      Currently, we do not provide any shipping services. Our platform is designed for bus bookings, 
      and we do not handle physical shipping of any kind.
    </p>
    
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
      <p className="text-gray-700 text-[14px]">
        All booking confirmations and related details are delivered digitally through email, SMS, 
        or directly accessible via your account on our website or app.
      </p>
    </div>
  </div>
</section>
              {/* Contact Us */}
              <section id="contact" className="mb-6">
                <div className="flex items-center mb-4">
                  <Phone size={20} className="mr-3 text-blue-600" />
                  <h2 className="text-[18px] font-bold text-gray-900">Contact Us</h2>
                </div>
                <p className="text-gray-700 mb-6  text-[14px]">
                  If you have any questions about this Privacy Policy, You can contact us through any of the following methods:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="hover:shadow-md transition-all duration-200">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="bg-blue-100 p-3 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">Terms</h3>
                      <Link href="/terms-and-conditions" className="text-blue-600 hover:text-blue-800 hover:underline">
                      click here 
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-all duration-200 ">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="bg-blue-100 p-3 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">Phone</h3>
                      <a href="tel:7090007776" className="text-blue-600  text-[14px] hover:text-blue-800 hover:underline">
                        +91 7090007776
                      </a>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-all duration-200">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="bg-blue-100 p-3 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">Email</h3>
                      <a href="mailto:contact@nandhubus.in" className="text-blue-600 hover:text-blue-800 hover:underline break-all">
                        contact@nandhubus.in
                      </a>
                    </CardContent>
                  </Card>
                  <Card 
      className="hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={handleDownload}
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="bg-blue-100 p-3 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 mb-2">Download Policy</h3>
        <p className="text-blue-600 hover:text-blue-800 hover:underline">Click to download PDF</p>
      </CardContent>
    </Card>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {showBackToTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 z-30  hover:scale-110"
          aria-label="Back to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
};

export default PrivacyPolicy;