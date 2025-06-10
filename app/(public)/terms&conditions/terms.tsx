"use client";
import React from "react";
import {
  ScrollText,
  ChevronRight,
  Home,
  Shield,
  CreditCard,
  ArrowLeftRight,
  UserCircle2,
  Lock,
  Scale,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/app/context/language-context";

function TermsAndConditions() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative py-16">
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {t('termsConditions')}
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-white sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              {t('termsSubtitle')}
            </p>
          </div>
          <nav className="flex justify-center items-center space-x-2 mt-6 text-sm text-blue-100">
            <Link
              href="/"
              className="flex items-center text-white transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              {t('home')}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{t('termsConditions')}</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-8">
            <ScrollText className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              {t('termsConditions')}
            </h2>
          </div>

          <div className="space-y-8">
            {/* Section 1 */}
            <div className="group">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    1. {t('termsAcceptanceTitle')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('termsAcceptanceContent')}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="group">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    2. {t('termsBookingTitle')}
                  </h3>
                  <ul className="text-gray-600 space-y-2 list-disc list-inside ">
                    <li>{t('termsBookingPoint1')}</li>
                    <li>{t('termsBookingPoint2')}</li>
                    <li>{t('termsBookingPoint3')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="group">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    3. {t('termsPaymentsTitle')}
                  </h3>
                  <ul className="text-gray-600 space-y-2 list-disc list-inside ">
                    <li>{t('termsPaymentsPoint1')}</li>
                    <li>{t('termsPaymentsPoint2')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="group">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <ArrowLeftRight className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    4. {t('termsCancellationsTitle')}
                  </h3>
                  <ul className="text-gray-600 space-y-2 list-disc list-inside ">
                    <li>{t('termsCancellationsPoint1')}</li>
                    <li>{t('termsCancellationsPoint2')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="group">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <UserCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    5. {t('termsAccountsTitle')}
                  </h3>
                  <ul className="text-gray-600 space-y-2 list-disc list-inside ">
                    <li>{t('termsAccountsPoint1')}</li>
                    <li>{t('termsAccountsPoint2')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="group">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    6. {t('termsPrivacyTitle')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('termsPrivacyContent')}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div className="group">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    7. {t('termsLiabilityTitle')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('termsLiabilityContent')}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 8 */}
            <div className="group">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <Scale className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    8. {t('termsLawTitle')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('termsLawContent')}
                  </p>
                </div>
              </div>
            </div>

            {/* Final Note */}
            <div className="mt-12 p-6 bg-blue-50 rounded-xl">
              <p className="text-blue-900 text-sm leading-relaxed">
                {t('termsFinalNote')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;