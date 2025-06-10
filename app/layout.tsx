import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/menubar/Header";
import Footer from "@/components/footer/Footer";
import AppProvider from "./services/app";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "./context/language-context";
import { LoaderProvider } from "./context/LoaderContext";
import { DistanceProvider } from "./context/DistanceContext";
import { RevenueProvider } from "./context/dashboardContext";
import { BookingProvider } from "./hooks/mybookings/BookingContext";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "Bus Rental in Bangalore | AC & Non-AC Bus Hire – Nandhubus ",
    template: "%s | Nandhu Bus",
  },
  description:
    "Affordable bus rentals in Bangalore for weddings, tours, and events. Hire AC & Non-AC buses from 20 to 50 seater with Nandhubus – hassle-free group travel.",
  keywords: [
    "Nandhu Bus",
    "bus booking online",
    "cheap bus tickets",
    "intercity travel",
    "luxury bus service",
    "Nandhu Bus Private Limited",
    "book bus tickets",
  ],
  openGraph: {
    title: "Nandhu Bus",
    description: "Best bus booking experience with Nandhu Bus Private Limited.",
    url: "https://dev.nandhubus.com",
    siteName: "Nandhu Bus Booking",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta
          name="facebook-domain-verification"
          content="5goyfwvpkrg7gfvn68wmfy9a01azr9"
        />
  <meta name="custom-meta" content="custom value" />

        {/* Google Tag Manager Script */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w, d, s, l, i) {
              w[l] = w[l] || [];
              w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
              var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
              j.async = true;
              j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
              f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-N6GNFLML');
          `}
        </Script>

        {/* JSON-LD Structured Data for SEO */}
        <Script id="json-ld" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Nandhubus",
            description:
              "Nandhubus is a travel company based in Bangalore offering bus rental services for families and groups, wedding buses, one-day trips, and spiritual trips across India from Bangalore.",
            url: "https://nandhubus.com",
            telephone: "+917090007776",
            email: "support@nandhubus.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "1st floor, R D Rajanna Complex",
              addressLocality: "Suryodaya Layout, Rajanukunte",
              addressRegion: "Karnataka",
              postalCode: "560064",
              addressCountry: "IN",
            },
            openingHours: "Mo-Fr 10:00-18:30",
            image: "https://nandhubus.com/favicon.ico",
            sameAs: [
              "https://www.facebook.com/NandhuBusIndia",
              "https://www.instagram.com/nandhubusindia/",
              "https://www.linkedin.com/company/nandhubus/",
            ],
            priceRange: "₹₹",
            areaServed: {
              "@type": "Place",
              name: "India",
            },
            serviceType: [
              "Full Bus Rental Service in Bangalore",
              "One-day Trips",
              "Wedding Transport",
              "Corporate Bus Rental",
              "Spiritual Trips for Families and Groups",
            ],
          })}
        </Script>
      </head>

      <body className="min-h-screen flex flex-col mt-[80px]">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N6GNFLML"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <AppProvider>
          <LoaderProvider>
            <LanguageProvider>
              <DistanceProvider>
                <RevenueProvider>
                  <BookingProvider>
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        className: "custom-toast",
                        style: {
                          background: "#fff",
                          color: "#333",
                          fontSize: "10px",
                          padding: "8px",
                        },
                        success: {
                          iconTheme: {
                            primary: "#4CAF50",
                            secondary: "#fff",
                          },
                        },
                        error: {
                          iconTheme: {
                            primary: "#FF5722",
                            secondary: "#fff",
                          },
                        },
                      }}
                    />
                    <Header />
                    <main className="flex-grow pb-[58px] mt-[-17px] md:mt-0">
                      {children}
                    </main>
                    <div>
                      <Footer />
                    </div>
                  </BookingProvider>
                </RevenueProvider>
              </DistanceProvider>
            </LanguageProvider>
          </LoaderProvider>
        </AppProvider>
      </body>
    </html>
  );
}
