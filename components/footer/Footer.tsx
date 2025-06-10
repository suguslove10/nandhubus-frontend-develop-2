"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import LoginModal from "../login-modal/loginmodal";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/app/context/language-context";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectAuth } from "@/app/Redux/authSlice";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();
  const authData = useSelector(selectAuth);
  const router = useRouter();
 
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 1000);
  }, []);

  const handleContactClick = (e:any) => {
    e.preventDefault(); 
    router.push('/contact');
  };

  const footerLinks = [
    {
      title: t("quickLinks"),
      links: [
        { name: t("travelNow"), href: "/" },
        { name: t("termsPrivacyTitle"), href: "/privacy" },
        { name: t("cancelandRefund"), href: "/cancel&refund_policy" },
        ...(!authData?.isAuthenticated
          ? [{ name: t("login"), action: () => setIsLoginModalOpen(true) }]
          : []),
      ],
    },
    {
      title: t("informationCenter"),
      links: [
        { name: t("contactUs"), href: "/contact", action: handleContactClick },
        { name: t("aboutUs"), href: "/about" },
                { name: t("termsConditions"), href: "/terms-and-conditions" },

      
        { name: t("faqs"), href: "/Faqs" },
        { name: t("blogs"), href: "/blog", action: () => router.push("/blog") },
      ],
    },
    
    {
      title: t("stayConnected"),
      icons: [
        { href: process.env.NEXT_PUBLIC_FACEBOOK_URL, icon: faFacebook },
        { href: process.env.NEXT_PUBLIC_INSTAGRAM_URL, icon: faInstagram },
        { href: process.env.NEXT_PUBLIC_TWITTER_URL, icon: faTwitter },
        { href: process.env.NEXT_PUBLIC_LINKEDIN_URL, icon: faLinkedin },
      ],
    },
    {
      title: t("reachUs"),
      contacts: [
        {
          type: "email",
          text: process.env.NEXT_PUBLIC_EMAIL,
          href: `mailto:${process.env.NEXT_PUBLIC_EMAIL}`,
        },
        {
          type: "phone",
          text: process.env.NEXT_PUBLIC_PHONE_1,
          href: `tel:${process.env.NEXT_PUBLIC_PHONE_1}`,
        },
      
      ],
    },
  ];

  const pathname = usePathname();
  const isAdmin = pathname.includes("/admin");

  return (
    !isAdmin && (
      <>
        {!mounted ? (
          <Skeleton className="w-full h-[300px] bg-[#b3b3b3] rounded-none" />
        ) : (
          <footer className="bg-[#01374e] text-white py-12 pb-20">
          <div className="container mx-auto max-w-6xl px-6">
            {/* Main Footer Content */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {/* First two columns (Quick Links and Information Center) */}
              {footerLinks.slice(0, 2).map((section, index) => (
                <div key={index} className="footer-section">
                  <h4 className="text-base font-bold mb-6 uppercase tracking-wider relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-8 after:bg-[#0f7bab]">
                    {section.title}
                  </h4>
                  {section.links && (
                    <ul className="space-y-3">
                      {section.links.map((link, idx) => (
                        <li key={idx} className="transition-all duration-300 hover:translate-x-1">
                          {link.action ? (
                            <button
                              onClick={link.action}
                              className="text-sm hover:text-[#0f7bab] transition-colors duration-300 bg-transparent border-none text-white cursor-pointer flex items-center"
                            >
                              <span className="text-[#0f7bab] mr-2">›</span> {link.name}
                            </button>
                          ) : (
                            <Link 
                              href={link.href} 
                              className="text-sm hover:text-[#0f7bab] transition-colors duration-300 flex items-center"
                            >
                              <span className="text-[#0f7bab] mr-2">›</span> {link.name}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              
              {/* Last two columns (Stay Connected and Reach Out) - will stack on mobile */}
              <div className="col-span-2 md:col-span-1">
                {footerLinks[2] && (
                  <div className="footer-section">
                    <h4 className="text-base font-bold mb-6 uppercase tracking-wider relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-8 after:bg-[#0f7bab]">
                      {footerLinks[2].title}
                    </h4>
                    {footerLinks[2].icons && (
                      <div className="flex gap-5 mt-2">
                        {footerLinks[2].icons.map((social, idx) => (
                          <a
                            key={idx}
                            href={social.href}
                            target="_blank"
                            className="bg-[#0f7bab] hover:bg-white hover:text-[#01374e] text-white p-2 rounded-full w-9 h-9 flex items-center justify-center transition-all duration-300"
                            aria-label={`Visit our ${social.icon.iconName} page`}
                          >
                            <FontAwesomeIcon icon={social.icon} className="text-base" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="col-span-2 md:col-span-1">
                {footerLinks[3] && (
                  <div className="footer-section">
                    <h4 className="text-base font-bold mb-6 uppercase tracking-wider relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-8 after:bg-[#0f7bab]">
                      {footerLinks[3].title}
                    </h4>
                    {footerLinks[3].contacts && (
                      <ul className="space-y-4 mt-2">
                        {footerLinks[3].contacts.map((contact, idx) => (
                          <li key={idx} className="group">
                            <a
                              href={contact.href}
                              className="text-sm flex items-center group-hover:text-[#0f7bab] transition-colors duration-300"
                            >
                              <span className="inline-block mr-3 text-[#0f7bab]">
                              {contact.type === "email" ? <Mail size={16} color="white" /> : <Phone size={16} color="white" />}
                              </span>
                              {contact.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
        
            {/* Footer Bottom */}
            <div className="mt-10 pt-6 border-t border-[#164657] text-sm flex flex-col md:flex-row justify-between items-center text-center md:text-left">
              <p className="mb-3 md:mb-0 w-full md:w-auto">{t("copyright")}</p>
              <p className="text-[#ffff] w-full md:w-auto">{t("poweredBy")}</p>
            </div>
          </div>
        
          {isLoginModalOpen && (
            <LoginModal onClose={() => setIsLoginModalOpen(false)} />
          )}
        </footer>
        )}
      </>
    )
  );
};

export default Footer;