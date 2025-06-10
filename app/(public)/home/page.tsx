"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaBuilding,
  FaBus,
  FaFlag,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import { MdDateRange, MdOutlineAirlineSeatReclineNormal } from "react-icons/md";
import background from "../../../public/assests/NandhuBus.jpg";
import single from "../../../public/assests/single_bus.png";
import multi from "../../../public/assests/multi_bus_icon.png";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import "swiper/css";
import "swiper/css/pagination";
import { TiTick, TiTimes } from "react-icons/ti";
import { useDistance } from "@/app/context/DistanceContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface BackgroundSectionProps {
  loading: boolean;
  backgroundSrc: string;
}

const BackgroundSection: React.FC<BackgroundSectionProps> = ({
  loading,
  backgroundSrc,
}) => {
  const commonClasses =
    "relative w-full pt-[40%] md:flex hidden items-center justify-center text-white text-4xl font-bold";

  return loading ? (
    <Skeleton className={commonClasses} />
  ) : (
    <section
      className="relative w-full pt-[40%] md:flex hidden items-center justify-center"
    >
      <div className="absolute inset-0 overflow-hidden">
        <OptimizedImage
          src={backgroundSrc}
          alt="Nandhu Bus Banner"
          fill
          className="object-cover"
          sizes="100vw"
          priority={true}
          quality={85}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Content goes here */}
      </div>
    </section>
  );
};
const Home = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { daysFromAPI, callDistanceAPI } = useDistance();
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const [loading, setLoading] = useState(() => {
    return sessionStorage.getItem("hasLoaded") ? false : true;
  });

  useEffect(() => {
    if (!sessionStorage.getItem("hasLoaded")) {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("hasLoaded", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const [packages, setPackages] = useState<TravelPackage[]>([]);

  const handleGetAllPackages = async () => {
    try {
      const res = await getAllPackages();
      setPackages(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetAllPackages();
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const checkForScrollPosition = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const tolerance = 10;

    // Check if we're near the beginning (first package)
    // Only hide left button when very close to the start
    setCanScrollLeft(scrollLeft > tolerance);

    // Check if we're at the end (no more scrolling to the right)
    setCanScrollRight(scrollLeft + clientWidth + tolerance < scrollWidth);
  };

  // Update the scroll event listener to use this function
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    };

    container.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [packages]); // Add packages as dependency to re-run when packages change

  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (!packages || packages.length <= 1) return;

    const startAutoScroll = () => {
      autoScrollInterval.current = setInterval(() => {
        scrollToNext();
      }, 5000); // Change slide every 5 seconds
    };

    const stopAutoScroll = () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };

    startAutoScroll();

    // Pause auto-scroll when user interacts
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseenter", stopAutoScroll);
      container.addEventListener("touchstart", stopAutoScroll);
      container.addEventListener("mouseleave", startAutoScroll);
    }

    return () => {
      stopAutoScroll();
      if (container) {
        container.removeEventListener("mouseenter", stopAutoScroll);
        container.removeEventListener("touchstart", stopAutoScroll);
        container.removeEventListener("mouseleave", startAutoScroll);
      }
    };
  }, [packages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      checkForScrollPosition();
      updateCurrentIndex();
    };

    container.addEventListener("scroll", handleScroll);

    checkForScrollPosition(); // initial check
    updateCurrentIndex(); // initial index check

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [containerRef, packages]);

  const scrollToPrev = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8; // Adjust as needed
    container.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToNext = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8; // Adjust as needed
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const child = container.children[0]?.children[index] as HTMLElement; // Get the nth card
    if (child) {
      container.scrollTo({
        left: child.offsetLeft,
        behavior: "smooth",
      });
    }
    setCurrentIndex(index); // Optional: Update active dot manually if needed
  };
  const updateCurrentIndex = () => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.children[0]?.children;
    if (!children) return;

    let closestIdx = 0;
    let minDistance = Infinity;

    Array.from(children).forEach((child, idx) => {
      const distance = Math.abs(
        (child as HTMLElement).offsetLeft - container.scrollLeft
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    setCurrentIndex(closestIdx);
  };
const ServiceCards = () => {
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});

    const toggleReadMore = (id: number, e: React.MouseEvent) => {
      e.stopPropagation(); // Stop event from bubbling up to the card
      setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const getShortDescription = (text: string, wordCount = 10) => {
      const words = text.split(" ");
      if (words.length <= wordCount) return text;
      return words.slice(0, wordCount).join(" ") + "...";
    };

    const services = [
      {
        id: 1,
        title: "Marriage & Wedding Bus",
        description:
          "Use Nandhubus to make wedding transportation easy. Our AC and non-AC buses offer your guests well-organized transportation, with numerous pickup locations and punctual arrivals, ensuring comfort on your special day.",
        image: "/assests/a2.jpeg",
        route: "/services/marriage",
      },
      {
        id: 2,
        title: "Corporate & Office Outing",
        description:
          "Looking for corporate bus rentals in Bangalore? NandhuBus offers AC buses with 20–50 seats, perfect for office outings, corporate events, and business travel needs.",
        image: "/assests/n2.webp",
        route: "/services/corporate",
      },
      {
        id: 3,
        title: "School & College Bus",
        description:
          "Ensure a safe and reliable journey for students with NandhuBus, the trusted name in school bus rentals in Bangalore. We offer 20 to 50-seater buses for schools, colleges, and institutions, with experienced, verified drivers.",
        image: "/assests/n4.webp",
        route: "/services/schools",
      },
      {
        id: 4,
        title: "Bangalore Tour Packages",
        description:
          "Enjoy our affordable, all-inclusive tour packages from Bangalore to Mysore, Dharmasthala, Tirupati, and Mantralayam. Packages cover driver, fuel, and tolls with fixed pricing and no hidden fees.",
        image: "/assests/n5.webp",
        route: "/services/packages",
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => {
              if (service.route) {
                router.push(service.route);
              }
            }}
          >
            {/* Image */}
            <div className="h-48 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {expanded[service.id]
                  ? service.description
                  : getShortDescription(service.description)}
                {service.description.split(" ").length > 10 && (
                  <button
                    className="text-blue-500 ml-1 hover:underline"
                    onClick={(e) => toggleReadMore(service.id, e)}
                  >
                    {expanded[service.id] ? "Read less" : "Read more"}
                  </button>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  const router = useRouter();
  // Handle scroll events to update currentIndex
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", () => {
      checkForScrollPosition();
      updateCurrentIndex();
    });

    checkForScrollPosition(); // initial check

    return () => {
      container.removeEventListener("scroll", checkForScrollPosition);
    };
  }, []);

  const { t } = useLanguage();
  return (
    <div className="flex flex-col min-h-screen pb-20 sm:pb-32">
      {/* Chatbot Component - Adjusted for tablet */}
      <div className="p-2.5 h-15 w-15 flex items-center justify-center fixed right-0 bottom-7 md:bottom-10 z-[9] cursor-pointer">
        <ChatbotComponent userType="customer" />
      </div>
      <div className="relative">
        <BackgroundSection loading={loading} backgroundSrc={background.src} />

        {/* Bus Booking Form - Enhanced tablet responsiveness */}
        <div className="">
          <BusBookingForm
            togglePopup={togglePopup}
            setStart={setStartDate}
            setEnd={setEndDate}
          />
        </div>
      </div>

      {/* Packages Section - Optimized for tablet and mobile */}
      <div className="flex flex-col items-center justify-center w-full mt-[380px] xs:mt-[400px] sm:mt-[450px] md:mt-0">
        <div className="text-center mb-0 mt-14 md:mb-8 md:mt-3 w-full max-w-6xl px-4 xs:mt-[70px] sm:mt-[90px]">
          <div className="sm:block md:pt-[2rem]">
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-800 mb-2">
              {t("soda")}
            </h2>
            <p className="text-sm sm:text-sm text-gray-600">{t("hmm")}</p>
          </div>
        </div>

        <section className="flex flex-col pt-0 pb-2 px-2 md:px-4 w-full max-w-6xl mx-auto relative">
          {packages && packages.length > 0 && (
            <div className="relative w-full">
              {/* Left Arrow - adjusted for tablet */}
              {canScrollLeft && (
                <button
                  onClick={scrollToPrev}
                  className="absolute hidden sm:block -left-3 sm:-left-4 md:-left-8 top-1/2 -translate-y-1/2 cursor-pointer bg-[#0f7bab] hover:bg-[#01374e] p-2 rounded-full shadow-lg border border-gray-200 transition-colors duration-200 z-10"
                  aria-label="Previous packages"
                >
                  <ChevronLeft className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Scrollable content with tablet-optimized spacing */}
              <section
                ref={containerRef}
                className="flex overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory px-1 sm:px-2"
              >
                <div className="flex flex-nowrap gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10">
                  {packages.map((pkg, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-[85vw] sm:w-[42%] md:w-[45%] lg:w-[35%] snap-start group"
                    >
                      <DestinationCard
                        image={pkg.imageUrl}
                        title={pkg.packageName}
                        days={pkg.days}
                        highlights={pkg.includedPlaces.join(" | ")}
                        includes={[
                          "Pickup & Drop Included",
                          "No Accommodation provided",
                        ]}
                        disclaimer="This Price may vary by vehicle you select"
                        price={pkg.startingPrice.toFixed(2)}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Right Arrow - adjusted for tablet */}
              {canScrollRight && (
                <button
                  onClick={scrollToNext}
                  className="absolute hidden sm:block -right-3 sm:-right-4 md:-right-6 top-1/2 -translate-y-1/2 cursor-pointer bg-[#0f7bab] hover:bg-[#01374e] p-2 rounded-full shadow-lg border border-gray-200 transition-colors duration-200 z-10"
                  aria-label="Next packages"
                >
                  <ChevronRight className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Navigation dots - tablet-optimized */}
              <div className="sm:hidden flex justify-center gap-2 mt-4">
                {packages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToIndex(idx)}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                      currentIndex === idx
                        ? "bg-[#0f7bab] w-5 sm:w-6"
                        : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Video banner section */}
        {/* Video banner section */}
        <div className="w-full max-w-6xl mt-10 px-4">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full  md:h-auto h-[300px] object-cover"
              poster="/assests/optimized/nandubus_banner.webp"
            >
              <source src="/assests/banner video 3.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* ADD THE VEHICLE SERVICES SECTION HERE */}
        {/* Vehicle Services Section */}
        <div className="w-full max-w-6xl mx-auto px-4 py-12">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Explore Our Bus Rental Services
            </h2>
          </div>

          {/* Services Grid */}
          <div>
            <ServiceCards />
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Discover Your Perfect Journey
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              Explore comprehensive travel guides for your next adventure from
              Bengaluru
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Tirupati Guide Card */}
            <div className="group rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: "url('/assests/pp.jpg')" }}
                ></div>{" "}
                <div className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg mb-1">
                    Tirupati Pilgrimage
                  </h3>
                  <div className="flex items-center text-white/90">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="text-xs font-medium">
                      Sacred Journey Guide
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <p className="text-gray-700 font-semibold text-base mb-4 leading-relaxed">
                  Complete pilgrimage planning guide from Bengaluru to the
                  sacred hills of Tirupati
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start group/item">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 rounded-lg mr-3 group-hover/item:scale-110 transition-transform duration-300">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        Sacred Temples
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Complete temple information and darshan procedures
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start group/item">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-2 rounded-lg mr-3 group-hover/item:scale-110 transition-transform duration-300">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        Perfect Timing
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Best seasons and festival calendars for your visit
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start group/item">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-2 rounded-lg mr-3 group-hover/item:scale-110 transition-transform duration-300">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        Darshan Tips
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Insider tips for queue management and rituals
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    className="w-full group/btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => router.push("/blog/thirupathi")}
                  >
                    <span className="flex items-center justify-center text-sm">
                      Explore Tirupati Guide
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mysuru Guide Card */}
            <div className="group rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10"></div>
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: "url('/assests/m2.jpg')" }}
                ></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg mb-1">
                    Mysuru Heritage
                  </h3>
                  <div className="flex items-center text-white/90">
                    <Mountain className="h-3 w-3 mr-1" />
                    <span className="text-xs font-medium">
                      Royal City Experience
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <p className="text-gray-700 font-semibold text-base mb-4 leading-relaxed">
                  Discover the royal heritage and cultural treasures of
                  Karnataka's cultural capital
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start group/item">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 rounded-lg mr-3 group-hover/item:scale-110 transition-transform duration-300">
                      <Mountain className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        Royal Palaces
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Mysore Palace and other architectural marvels
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start group/item">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-2 rounded-lg mr-3 group-hover/item:scale-110 transition-transform duration-300">
                      <Camera className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        Cultural Sites
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Museums, gardens, and historic landmarks
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start group/item">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-2 rounded-lg mr-3 group-hover/item:scale-110 transition-transform duration-300">
                      <Utensils className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        Local Cuisine
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Traditional Mysore delicious and dining spots
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    className="w-full group/btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => router.push("/blog/mysuru")}
                  >
                    <span className="flex items-center justify-center text-sm">
                      Explore Mysuru Guide
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mantralayam Guide Card */}
            <div className="group rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10"></div>
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: "url('/assests/m1.jpeg')" }}
                ></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg mb-1">
                    Mantralayam Spiritual
                  </h3>
                  <div className="flex items-center text-white/90">
                    <Star className="h-3 w-3 mr-1" />
                    <span className="text-xs font-medium">
                      Divine Blessings Journey
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <p className="text-gray-700 font-semibold text-base mb-4 leading-relaxed">
                  Experience the divine presence at Sri Raghavendra Swamy's
                  sacred abode in Mantralayam
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start group/item">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-2 rounded-lg mr-3 group-hover/item:scale-110 transition-transform duration-300">
                      <Star className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        Sacred Brindavana
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Visit the holy samadhi of Sri Raghavendra Swamy
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start group/item">
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-2 rounded-lg mr-3 group-hover/item:scale-110 transition-transform duration-300">
                      <Heart className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        Devotional Practices
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Prayers, rituals and spiritual experiences guide
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start group/item">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-2 rounded-lg mr-3 group-hover/item:scale-110 transition-transform duration-300">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        Festival Calendar
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Special occasions and celebration timings
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    className="w-full group/btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => router.push("/blog/mantralayam")}
                  >
                    <span className="flex items-center justify-center text-sm">
                      Explore Mantralayam Guide
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dharmasthala Guide Card */}
            <div className="group rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10"></div>
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: "url('/assests/d4.jpg')" }}
                ></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg mb-1">
                    Dharmasthala Sacred
                  </h3>
                  <div className="flex items-center text-white/90">
                    <Users className="h-3 w-3 mr-1" />
                    <span className="text-xs font-medium">
                      Temple Town Experience
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <p className="text-gray-700 font-semibold text-base mb-4 leading-relaxed">
                  Discover the unique spiritual harmony and cultural heritage of
                  Karnataka's sacred temple town
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start group/item">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-2 rounded-lg mr-3 group-hover/item:scale-110 transition-transform duration-300">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        Sacred Temples
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Manjunatha Temple and spiritual significance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start group/item">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 rounded-lg mr-3 group-hover/item:scale-110 transition-transform duration-300">
                      <Heart className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        Free Meals
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Annadana tradition and community service
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start group/item">
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-2 rounded-lg mr-3 group-hover/item:scale-110 transition-transform duration-300">
                      <Mountain className="h-4 w-4 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        Cultural Sites
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Museums, statue parks and heritage attractions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    className="w-full group/btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => router.push("/blog/dharmasthala")}
                  >
                    <span className="flex items-center justify-center text-sm">
                      Explore Dharmasthala Guide
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup - Tablet adjustments */}
      {isPopupOpen && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-[999999] bg-black/70">
          <div className="w-full md:w-[80%] lg:w-[60%] max-w-2xl bg-white rounded-lg overflow-hidden">
            <Popup
              togglePopup={togglePopup}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
      )}
    </div>
  );
};
const ErrorPopup = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-medium text-red-600 mb-4">Login Error</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { fetchListVehiclesData } from "@/app/Redux/list";
import { AppDispatch } from "@/app/Redux/store";
import { setSearchDetails } from "@/app/Redux/searchSlice";
import ChatbotComponent from "@/components/chatbot/middleware/ChatBotComponent";
import {
  addDays,
  addHours,
  addMonths,
  differenceInCalendarDays,
  differenceInDays,
  format,
  isSameDay,
  isToday,
  set,
  setHours,
  setMinutes,
  subDays,
} from "date-fns";
import {
  distanceCalculation,
  findLowestPrice,
  getAllPackages,
} from "@/app/services/data.service";
import { TravelPackage } from "@/app/types/package.response";
import { distanceResponse } from "@/app/types/distancecalculationresponse";
import { useLoader } from "@/app/context/LoaderContext";
import ClockTimePicker from "./ClockTimePicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowRight,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  MapPin,
  Mountain,
  Star,
  Users,
  Utensils,
} from "lucide-react";

interface BusBookingFormProps {
  togglePopup: () => void;
  setStart: React.Dispatch<React.SetStateAction<Date | null>>;
  setEnd: React.Dispatch<React.SetStateAction<Date | null>>;
}

interface SkeletonWrapperProps {
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}

const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
  loading,
  skeleton,
  children,
}) => {
  return <>{loading ? skeleton : children}</>;
};
interface distanceCalculationPayload {
  source: string;
  sourceLatitude: number;
  sourceLongitude: number;
  destination: string;
  destinationLatitude: number;
  destinationLongitude: number;
}
export const BusBookingForm: React.FC<BusBookingFormProps> = ({
  togglePopup,
  setStart,
  setEnd,
}) => {
  const libraries: "places"[] = ["places"];

  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [showClockPicker, setShowClockPicker] = useState(false);
  const [clockPickerDate, setClockPickerDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>();

  const [endDate, setEndDate] = useState<Date | null>();

  const originRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const { showLoader, hideLoader } = useLoader();

  const handlePlaceChanged = (
    ref: React.MutableRefObject<google.maps.places.Autocomplete | null>,
    setLocation: React.Dispatch<React.SetStateAction<string>>,
    storageKey: string
  ) => {
    if (ref.current) {
      const place = ref.current.getPlace();
      if (place && place.formatted_address) {
        setLocation(place.formatted_address);
        sessionStorage.setItem(storageKey, place.formatted_address);
      }
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  const formatDateTime = (date: Date): string => {
    const iso = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
    return iso.split(".")[0]; // Removes milliseconds and 'Z'
  };
  const handleSubmit = async () => {
    if (!origin || !destination || !startDate || !endDate) {
      toast.error("Please fill in all fields before proceeding");
      return;
    }

    const localStartDate = formatDateTime(startDate); // "YYYY-MM-DDTHH:mm:ss"
    const localEndDate = formatDateTime(endDate); // "YYYY-MM-DDTHH:mm:ss"

    try {
      showLoader();

      dispatch(
        setSearchDetails({
          source: origin,
          destination: destination,
          fromDate: localStartDate,
          toDate: localEndDate,
        })
      );

      // await dispatch(
      //   fetchListVehiclesData({
      //     source: origin,
      //     destination: destination,
      //     fromDate: localStartDate,
      //     toDate: localEndDate,
      //     distanceInKm: daysFromAPI?.kiloMeter ?? 0,
      //     sourceLatitude: sourceCoords.latitude,
      //     sourceLongitude: sourceCoords.longitude,

      //     destinationLatitude: destinationCoords.latitude,
      //     destinationLongitude: destinationCoords.longitude,
      //     tripExtraDays: extraDaysCount,
      //   })
      // );

      const booking_form__data = {
        source: origin,
        destination: destination,
        fromDate: localStartDate,
        toDate: localEndDate,
        distanceInKm: daysFromAPI?.kiloMeter ?? 0,
        sourceLatitude: sourceCoords.latitude,
        sourceLongitude: sourceCoords.longitude,
        destinationLatitude: destinationCoords.latitude,
        destinationLongitude: destinationCoords.longitude,
        tripExtraDays: extraDaysCount,
      };
      sessionStorage.setItem(
        "booking_form__data",
        JSON.stringify(booking_form__data)
      );

      setStart(startDate);
      setEnd(endDate);

      togglePopup();
    } catch (error) {
      toast.error("Failed to fetch vehicle data. Please try again.");
    } finally {
      hideLoader();
    }
  };

  const handleDateChange = (date: Date | null, picker: "start" | "end") => {
    if (!date) return;
    if (picker === "start") {
      setStartDate(date);
      setEndDate(null); // Reset end date when start changes
      setExtraDaysCount(0); // Reset extra days count
    } else {
      // Handle same-day selection
      if (startDate && isSameDay(startDate, date)) {
        // If user selects same day, set time to 10:00 PM
        const adjustedEndDate = new Date(startDate);
        adjustedEndDate.setHours(22, 0, 0, 0); // 10:00 PM

        setEndDate(adjustedEndDate);
        setExtraDaysCount(0);
      } else {
        setEndDate(date);

        // If dates differ, calculate extra days if needed
        if (startDate && daysFromAPI?.numberOfDays) {
          // Create the exact recommended end time (same time of day as start, numberOfDays later)
          const recommendedEnd = new Date(startDate.getTime());
          recommendedEnd.setDate(
            startDate.getDate() + daysFromAPI.numberOfDays
          );

          // Calculate time difference in milliseconds
          const timeDifference = date.getTime() - recommendedEnd.getTime();

          // If selected end is after recommended end, calculate extra days
          if (timeDifference > 0) {
            // Convert milliseconds to days (1 day = 86400000 milliseconds)
            // Use Math.ceil to round up partial days
            const extraDays = Math.ceil(timeDifference / 86400000);
            setExtraDaysCount(extraDays);
          } else {
            setExtraDaysCount(0);
          }
        }
      }
    }

    setClockPickerDate(date);
    setIsOpen(false);
    setShowClockPicker(true);
  };
  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);

    if (start && daysFromAPI?.numberOfDays) {
      const newEndDate = new Date(start);
      newEndDate.setDate(newEndDate.getDate() + daysFromAPI.numberOfDays);
      setEndDate(newEndDate);
    } else {
      setEndDate(end);
    }

    if (end || (start && daysFromAPI?.numberOfDays)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (origin === destination && origin && destination) {
      setSameLocationError("Origin and destination cannot be the same.");
    }
  }, [origin, destination]);
  // useEffect(() => {
  //   if (startDate) {
  //     sessionStorage.setItem("startDate", startDate.toISOString());
  //   }
  //   if (endDate) {
  //     sessionStorage.setItem("toDate", endDate.toISOString());
  //   }
  // }, [startDate, endDate]);

  const [loading, setLoading] = useState(() => {
    return sessionStorage.getItem("hasLoaded") ? false : true;
  });

  useEffect(() => {
    if (origin === destination && origin && destination) {
      setSameLocationError("Origin and destination cannot be the same.");
      // Clear dates when locations are the same
      setStartDate(null);
      setEndDate(null);
    } else {
      setSameLocationError("");
    }

    // Clear dates when either location changes
    if (origin || destination) {
      setStartDate(null);
      setEndDate(null);
    }
  }, [origin, destination]);
  const [isMobile, setIsMobile] = useState(false);
  const [sameLocationError, setSameLocationError] = useState("");
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [showSeaterDropdown, setShowSeaterDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSeaterDropdown(false);
      }
    };

    const handleDateChange = (
      date: Date | null,
      pickerType: "start" | "end"
    ) => {
      if (!date) return;

      // Apply your existing date logic...
      if (pickerType === "start") {
        const now = new Date();
        const tomorrow = addDays(new Date(), 1);

        // Force today's date to tomorrow
        if (isToday(date)) {
          date.setFullYear(tomorrow.getFullYear());
          date.setMonth(tomorrow.getMonth());
          date.setDate(tomorrow.getDate());
        }

        setStartDate(date);
        setEndDate(null);
      } else {
        let updatedDate = date;
        const firstOfLastTwoDays = dateLimits?.min ?? new Date();

        const onlyTimeSelected = endDate && isSameDay(date, endDate);

        if (onlyTimeSelected && firstOfLastTwoDays) {
          updatedDate = new Date(endDate);
          updatedDate.setHours(date.getHours());
          updatedDate.setMinutes(date.getMinutes());
        }

        if (startDate && isSameDay(startDate, updatedDate)) {
          updatedDate = set(updatedDate, { hours: 22, minutes: 0 });
        }

        setEndDate(updatedDate);
      }

      // After date selection, show clock picker
      setClockPickerDate(date);
      setIsOpen(false);
      setShowClockPicker(true);
    };
    const handleClockTimeSelected = (date: Date) => {
      if (activePicker === "start") {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      setShowClockPicker(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Custom input for date picker to enable clock selection after date selection
  const CustomInput = React.forwardRef(
    ({ onClick, pickerType }: any, ref: any) => {
      const date = pickerType === "start" ? startDate : endDate;
      const isDisabled =
        !locationsSet || !!sameLocationError || isError || isDistanceLoading;

      return (
        <div
          className={`flex items-center space-x-2 w-full ${
            isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={isDisabled ? undefined : onClick}
          ref={ref}
        >
          <span className="text-gray-900 text-nowrap text-xs">
            {date
              ? format(date, "MMMM dd, yyyy h:mm aa")
              : pickerType === "start"
              ? "Start date"
              : "End date"}
          </span>
        </div>
      );
    }
  );
  // Set the display name
  CustomInput.displayName = "CustomInput";

  const [sourceCoords, setSourceCoords] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });

  const [destinationCoords, setDestinationCoords] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });
  const {
    daysFromAPI,
    callDistanceAPI,
    extraDaysCount,
    setExtraDaysCount,
    isError,
    setIsError,
    isDistanceLoading,
  } = useDistance();
  useEffect(() => {
    if (
      sourceCoords?.latitude &&
      sourceCoords?.longitude &&
      destinationCoords?.latitude &&
      destinationCoords?.longitude &&
      origin &&
      destination
    ) {
      callDistanceAPI(origin, destination, sourceCoords, destinationCoords);
    } else {
      setIsError("");
    }
  }, [sourceCoords, destinationCoords]);
  // or from props/state
  const tomorrow = addDays(new Date(), 1);

  const getLastTwoDaysRange = (start: Date, duration: number) => {
    const end = addDays(start, duration); // full trip end date
    const from = subDays(end, 1); // second last day
    return {
      min: set(from, { hours: 0, minutes: 0 }),
      max: set(end, { hours: 23, minutes: 59 }),
    };
  };

  // Modify your dateLimits calculation
  const getDateRange = (start: Date, duration: number) => {
    const recommendedEnd = addDays(start, duration);
    const min = addDays(start, Math.max(duration - 1, 0)); // For 1-day trips, use same day

    // Calculate one extra day beyond recommended duration
    const max = addDays(recommendedEnd, 1); // Just one extra day

    return {
      recommendedEnd,
      min,
      max, // Now set to one day beyond recommended
    };
  };

  const dateLimits = startDate
    ? getDateRange(startDate, daysFromAPI?.numberOfDays ?? 0)
    : null;
  // Handle clock picker confirmation
  const handleClockTimeSelected = (date: Date) => {
    if (activePicker === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setShowClockPicker(false);
  };

  const fetchCoordinates = async (
    address: string,
    type: "source" | "destination"
  ) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=AIzaSyBB6-8inLCozBj_SKuhrK0bhuO2Jxw35IU`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const coords = { latitude: location.lat, longitude: location.lng };

        if (type === "source") {
          setSourceCoords(coords);
          setErrorOrigin(""); // Clear error if successful
        } else {
          setDestinationCoords(coords);
          setErrorDestination(""); // Clear error if successful
        }
      } else {
        toast.error("Unable to fetch coordinates for the location.");
        if (type === "source") {
          setErrorOrigin("Unable to fetch coordinates for origin.");
        } else {
          setErrorDestination("Unable to fetch coordinates for destination.");
        }
        setStartDate(null);
        setEndDate(null);
      }
    } catch (error) {
      toast.error("Error fetching coordinates.");
      if (type === "source") {
        setErrorOrigin("Error fetching coordinates for origin.");
      } else {
        setErrorDestination("Error fetching coordinates for destination.");
      }
      setStartDate(null);
      setEndDate(null);
    }
  };

  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // initialize on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isTopZero = windowWidth && windowWidth >= 1024 && windowWidth <= 1280;
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };
  const [isTabWidth, setIsTabWidth] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        const width = window.innerWidth;
        setIsTabWidth(width >= 768 && width <= 1024);
      };
      handleResize(); // set on load
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  const [activePicker, setActivePicker] = useState<"start" | "end" | null>(
    null
  );

  const [locationsSet, setLocationsSet] = useState(false);
  useEffect(() => {
    setLocationsSet(
      !!origin && !!destination && !errorOrigin && !errorDestination
    );
  }, [origin, destination]);
  useEffect(() => {
    if (!sessionStorage.getItem("hasLoaded")) {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("hasLoaded", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);
  const [positionStyle, setPositionStyle] = useState({
    top: "20vh",
    right: "4vw",
  });
  useEffect(() => {
    const updateStyle = () => {
      const width = window.innerWidth;
      if (width > 1280) {
        setPositionStyle({ top: "20vh", right: "4vw" });
      } else if (width >= 1024 && width <= 1280) {
        // Large screen
        setPositionStyle({ top: "8vh", right: "4vw" });
      } else if (width == 768) {
        setPositionStyle({ top: "3vh", right: "4vw" });
      } else if (width > 768 && width < 1024) {
        // Medium screen (tablet)
        setPositionStyle({ top: "5vh", right: "4vw" });
      } else {
        // Mobile screen
        setPositionStyle({ top: "10vh", right: "0vw" });
      }
    };

    // Initial check
    updateStyle();

    // Add event listener
    window.addEventListener("resize", updateStyle);

    // Cleanup
    return () => window.removeEventListener("resize", updateStyle);
  }, []);

  useEffect(() => {
    if (origin) {
      fetchCoordinates(origin, "source");
    }

    if (destination) {
      fetchCoordinates(destination, "destination");
    }
  }, []);
  const [errorOrigin, setErrorOrigin] = useState("");
  const [errorDestination, setErrorDestination] = useState("");

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBB6-8inLCozBj_SKuhrK0bhuO2Jxw35IU"
      libraries={libraries}
      region="IN"
      loadingElement={<Skeleton className="h-8 w-full" />}
    >
      <SkeletonWrapper
        loading={loading}
        skeleton={
          <div className="flex flex-wrap sm:shadow-md md:bg-white w-full mx-auto"></div>
        }
      >
        {/* New Form Container */}

        <div
          className={`
    lg:w-1/4 md:w-1/4 sm:w-1/2 w-full max-w-md items-center mx-auto rounded-lg p-6 sm:p-3 lg:p-4
    bg-[#fff] md:bg-[#ffffff]
    absolute lg:right-[3vw] md:right-[6vw]
    ${
      isTabWidth
        ? "top-[10vh] p-1"
        : isTopZero
        ? "top-[15vh]"
        : "lg:top-[30vh] md:top-[14vh] sm:top-4 top-[10vh]"
    }
    sm:left-auto sm:right-auto left-1/2
    sm:translate-x-0 -translate-x-1/2
    shadow-none md:shadow-[rgba(0,0,0,0.25)_0px_54px_55px,rgba(0,0,0,0.12)_0px_-12px_30px,rgba(0,0,0,0.12)_0px_4px_6px,rgba(0,0,0,0.17)_0px_12px_13px,rgba(0,0,0,0.09)_0px_-3px_5px]
    abcd
    ${sameLocationError ? "-mt-[4rem]" : "-mt-[4.6rem]"} sm:mt-0
  `}
        >
          <>
            {/* Enhanced Mobile view heading */}
            <h2 className="block sm:hidden text-gray-900 text-lg font-bold text-center mb-6 py-3 px-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50  transform transition-transform hover:scale-[1.01]">
              Let's Plan Your Trip
            </h2>

            {/* Desktop view heading (unchanged) */}
            <h2
              className={`
    ${isTabWidth ? "hidden" : "hidden lg:block"}
    text-gray-800 font-medium text-lg mb-2 lg:mb-4 text-center
  `}
            >
              Plan Your Journey
            </h2>
          </>

          <div className="mb-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaBus className="text-gray-700" /> {/* Source icon */}
            </div>
            <input
              type="text"
              placeholder="pickup location"
              className={`w-full ${
                isTabWidth ? "p-2 pl-9" : "p-3 pl-10"
              } rounded-md border border-black bg-none text-gray-900 text-sm focus:outline-none`}
              defaultValue={origin}
              ref={(input) => {
                if (input && !originRef.current) {
                  const autocomplete = new google.maps.places.Autocomplete(
                    input,
                    { componentRestrictions: { country: "IN" } }
                  );
                  originRef.current = autocomplete;
                  autocomplete.addListener("place_changed", () => {
                    handlePlaceChanged(originRef, setOrigin, "origin");
                    const place = originRef.current?.getPlace();
                    if (place?.formatted_address) {
                      fetchCoordinates(place.formatted_address, "source");
                      setSameLocationError(
                        place.formatted_address &&
                          destination &&
                          place.formatted_address === destination
                          ? "Pickup and drop location cannot be the same"
                          : ""
                      );
                    }
                  });
                }
              }}
              onChange={(e) => {
                setOrigin(e.target.value);
                const isSameLocation =
                  e.target.value &&
                  destination &&
                  e.target.value === destination;
                setSameLocationError(
                  isSameLocation
                    ? "Pickup and drop location cannot be the same"
                    : ""
                );
                if (isSameLocation) {
                  setStartDate(null);
                  setEndDate(null);
                }
              }}
            />
          </div>

          <div className="mb-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLocationDot className="text-gray-700" />{" "}
              {/* Destination icon */}
            </div>
            <input
              type="text"
              placeholder="drop location"
              className={`w-full ${
                isTabWidth ? "p-2 pl-9" : "p-3 pl-10"
              } rounded-md border border-black bg-none text-gray-900 text-sm focus:outline-none`}
              defaultValue={destination}
              ref={(input) => {
                if (input && !destinationRef.current) {
                  const autocomplete = new google.maps.places.Autocomplete(
                    input,
                    { componentRestrictions: { country: "IN" } }
                  );
                  destinationRef.current = autocomplete;
                  autocomplete.addListener("place_changed", () => {
                    handlePlaceChanged(
                      destinationRef,
                      setDestination,
                      "destination"
                    );
                    const place = destinationRef.current?.getPlace();
                    if (place?.formatted_address) {
                      fetchCoordinates(place.formatted_address, "destination");
                      setSameLocationError(
                        place.formatted_address &&
                          origin &&
                          place.formatted_address === origin
                          ? "Pickup and drop location cannot be the same"
                          : ""
                      );
                    }
                  });
                }
              }}
              onChange={(e) => {
                setDestination(e.target.value);
                const isSameLocation =
                  e.target.value && origin && e.target.value === origin;
                setSameLocationError(
                  isSameLocation
                    ? "Pickup and drop location cannot be the same"
                    : ""
                );
                if (isSameLocation) {
                  setStartDate(null);
                  setEndDate(null);
                }
              }}
            />
          </div>

          {/* Error message display */}
          {sameLocationError ? (
            <p className="text-[#e92525] text-xs mb-1">{sameLocationError}</p>
          ) : origin && destination && isError ? (
            <p className="text-[#e92525] text-xs mb-1">{isError}</p>
          ) : null}

          {/* Start Date Input */}

          {/* Start Date */}
          <div>
            <div
              className={`w-full cursor-pointer mb-3 ${
                isTabWidth ? "p-2" : "p-3"
              }  rounded-md flex border border-black bg-none text-gray-900 text-sm focus:outline-none ${
                !locationsSet ||
                sameLocationError ||
                isError ||
                isDistanceLoading
                  ? "opacity-50 react-datepicker__disabled"
                  : ""
              }`}
              onClick={() => {
                if (!locationsSet) return;
                setActivePicker("start");
                setIsOpen(true);
                setShowClockPicker(false);
              }}
            >
              <SkeletonWrapper
                loading={loading}
                skeleton={<Skeleton className="h-8 w-8 rounded-full" />}
              >
                <MdDateRange className="text-gray-700 text-lg mr-1" />
              </SkeletonWrapper>
              <SkeletonWrapper
                loading={loading}
                skeleton={<Skeleton className="h-8 w-full" />}
              >
                <CustomInput pickerType="start" />
              </SkeletonWrapper>
            </div>
            <div className="border-l border-gray-300 w-full"></div>{" "}
            {/* Divider */}
            {/* End Date */}
            <div
              className={`flex w-full ${
                isTabWidth ? "p-2 mb-0" : "p-3"
              }  mb-0  cursor-pointer rounded-md border border-black bg-none text-black text-sm focus:outline-none ${
                !locationsSet ||
                sameLocationError ||
                isError ||
                isDistanceLoading
                  ? "opacity-50 react-datepicker__disabled"
                  : ""
              }`}
              onClick={() => {
                if (!locationsSet) return;
                setActivePicker("end");
                setIsOpen(true);
                setShowClockPicker(false);
              }}
            >
              <SkeletonWrapper
                loading={loading}
                skeleton={<Skeleton className="h-8 w-8 rounded-full" />}
              >
                <MdDateRange className="text-gray-700 text-lg mr-1" />
              </SkeletonWrapper>
              <SkeletonWrapper
                loading={loading}
                skeleton={<Skeleton className="h-8 w-full" />}
              >
                <CustomInput pickerType="end" />
              </SkeletonWrapper>
            </div>
            {/* Date Picker */}
            {/* Start Date Picker */}
            {/* Date Picker */}
            <div className="datepicker-wrapper-one">
              <div className="datepicker-wrapper-one">
                <DatePicker
                  selected={activePicker === "start" ? startDate : endDate}
                  onChange={(date: Date | null) => {
                    if (activePicker && !sameLocationError) {
                      handleDateChange(date, activePicker);
                    }
                  }}
                  dateFormat="MMMM dd, yyyy h:mm aa"
                  minDate={
                    activePicker === "start"
                      ? addDays(new Date(), 1)
                      : dateLimits?.min
                  }
                  maxDate={activePicker === "end" ? dateLimits?.max : undefined}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  className={`
    absolute top-12 left-0 z-50 bg-white shadow-lg p-2 rounded-lg border border-gray-300
    ${
      !locationsSet || sameLocationError || isError || isDistanceLoading
        ? "opacity-50 react-datepicker__disabled"
        : ""
    }  
  `}
                  wrapperClassName={
                    !locationsSet || sameLocationError
                      ? "cursor-not-allowed"
                      : ""
                  }
                  calendarClassName={
                    !locationsSet || sameLocationError
                      ? "pointer-events-none"
                      : ""
                  }
                  onClickOutside={() => setIsOpen(false)}
                  open={isOpen && locationsSet && !sameLocationError}
                  disabled={!locationsSet || !!sameLocationError}
                  openToDate={
                    activePicker === "end" && dateLimits?.min
                      ? dateLimits.min
                      : activePicker === "start"
                      ? addDays(new Date(), 1)
                      : new Date()
                  }
                />
              </div>
              {showClockPicker && clockPickerDate && (
                <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
                  <ClockTimePicker
                    selectedTime={
                      activePicker === "start" ? startDate! : endDate!
                    }
                    onChange={handleClockTimeSelected}
                    onClose={() => setShowClockPicker(false)}
                    startDate={startDate}
                    numberOfDays={daysFromAPI?.numberOfDays ?? 0}
                    isEndDatePicker={activePicker === "end"}
                    isPackage={false}
                    style={{
                      backgroundColor: "#fdeeca",
                      ...(typeof window !== "undefined" &&
                      window.innerWidth < 620
                        ? {
                            position: "absolute",
                            top: "50%",
                            left: "4vw",
                          }
                        : {}),
                    }}
                  />
                </div>
              )}
            </div>
            {/* Explore Button */}
            <button
              className={`w-full bg-[#01374e]  text-white font-medium ${
                isTabWidth ? "py-2" : "py-3"
              }  rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={handleSubmit}
              disabled={
                loading || !origin || !destination || !startDate || !endDate
              }
            >
              Explore
            </button>
            {/* Date Picker */}
            {/* Clock Picker */}
          </div>

          {/* CSS for DatePicker - keep your existing styles */}
          <style jsx global>{`
  .react-datepicker {
    border-radius: 0.5rem;
    background-color:#fdeeca;
    border-color: #e5e7eb;
    font-size: 14px;
    display:flex;
  }
     .datepicker-wrapper-one .react-datepicker-popper{
    position: absolute;
    left: 0px;
    top: 0px;
    transform: translate(10px, 94px)!important;
    }
  .react-datepicker__header {
    background-color:#fdeeca!important;
    border-bottom: 1px solid #e5e7eb;
  }
  .react-datepicker__month-container {
    padding: 0.5rem;
  }
    .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--disabled{
      color:#ccc!important;
      cursor:not-allowed!important;
    }
  .react-datepicker__month-container + .react-datepicker__month-container {
    margin-left: 1rem;
  }
.react-datepicker__day--selected:not(.react-datepicker__day--outside-month){
 background-color: #0f7bab !important;
    color: white !important;
   
    margin:0;
   border-radius:50%

  }
}
  /* Selected Start & End Date - Circular */
  .react-datepicker__day--selected,
  .react-datepicker__day--range-start,
  .react-datepicker__day--range-end {
    color: white !important;
    margin:0;
  }

  /* Highlight for In-Range Dates */
  .react-datepicker__day--in-range {
    background-color: rgba(59, 130, 246, 0.2) !important;
    color: black !important;
    border-radius: 0 !important;
    margin:0;
   
  }
    .react-datepicker-time__header{
    color:#636363
    }
    .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item {
    color:#636363
            }
    .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected{
    color:#fff;
    }
    .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name{
    width:2rem!important;
    line-height:2rem!important;
    margin:0!important;
    }
    .react-datepicker__day--selected:not([aria-disabled=true]):hover, .react-datepicker__day--in-selecting-range:not([aria-disabled=true]):hover, .react-datepicker__day--in-range:not([aria-disabled=true]):hover, .react-datepicker__month-text--selected:not([aria-disabled=true]):hover, .react-datepicker__month-text--in-selecting-range:not([aria-disabled=true]):hover, .react-datepicker__month-text--in-range:not([aria-disabled=true]):hover, .react-datepicker__quarter-text--selected:not([aria-disabled=true]):hover, .react-datepicker__quarter-text--in-selecting-range:not([aria-disabled=true]):hover, .react-datepicker__quarter-text--in-range:not([aria-disabled=true]):hover, .react-datepicker__year-text--selected:not([aria-disabled=true]):hover, .react-datepicker__year-text--in-selecting-range:not([aria-disabled=true]):hover, .react-datepicker__year-text--in-range:not([aria-disabled=true]):hover{
    border-radius:0!important;
    color:#fff!important;
    background-color:#0f7bab!important;
    }
   

.react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--in-range), .react-datepicker__month-text--in-selecting-range:not(.react-datepicker__day--in-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--in-range), .react-datepicker__quarter-text--in-selecting-range:not(.react-datepicker__day--in-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--in-range), .react-datepicker__year-text--in-selecting-range:not(.react-datepicker__day--in-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--in-range) {
    background-color: rgba(59, 130, 246, 0.2);
}
.react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range, .react-datepicker__month-text--selected, .react-datepicker__month-text--in-selecting-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--selected, .react-datepicker__quarter-text--in-selecting-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--selected, .react-datepicker__year-text--in-selecting-range, .react-datepicker__year-text--in-range {
    border-radius: 50%;
    background-color:rgba(59, 130, 246, 0.2);
    color: #000;
}




    .react-datepicker__day--range-end.react-datepicker__day--in-range {
  background-color: #0f7bab !important; /* Force end date color */
  color: white !important;
 
  margin:0;
 
   border-radius:50%
}
.react-datepicker__navigation--next {
color:black!important;
}
 
  .react-datepicker__current-month {
    font-weight: 500;
    color: #111827;
  }
  .react-datepicker__day-name {
    color: #6b7280;
    font-weight: 500;
  }
  .react-datepicker__input-container input {
    font-size: 12px;
    display:none!important;
  }
  .react-datepicker__input-container input::placeholder {
    font-size: 12px;
    display:none!important;
  }
    @media only screen and (max-width:580px){
   .datepicker-wrapper-one .react-datepicker-popper{
 
    transform: translate(20px, 250px)!important;
    }
    }
    @media only screen and (max-width: 650px) {
  .react-datepicker {
  width:100%;
    background-color: white !important; /* Set background to white */
    color: black !important; /* Set text color to black */
  }

  .react-datepicker__header {
    background-color: white !important; /* White header */
    border-bottom: 1px solid #e5e7eb;
  }

    @media only screen and (min-width: 768px) and (max-width: 900px) {
  .react-datepicker {
    font-size: 13px; /* Slightly smaller font size */
    width: 94% !important; /* Adjust width for mid-sized screens */
    height: auto !important; /* Adjust height accordingly */
    margin-left: -57px !important;
     }

  .react-datepicker__month-container {
    padding: 0.5rem; /* Slightly reduced padding for a compact view */
  }

  .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
    width: 1.8rem !important; /* Adjust width for day and time names */
    line-height: 1.8rem !important;
  }

  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item {
    font-size: 13px; /* Adjust font size for time list items */
  }
 
  .react-datepicker__day--selected:not(.react-datepicker__day--outside-month) {
    font-size: 13px; /* Adjust font size for selected days */
  }
        }
   @media only screen and (min-width: 768px) and (max-width: 900px) {
     .react-datepicker {
 margin-left: -57px !important;
     }
        }



`}</style>
        </div>
      </SkeletonWrapper>
    </LoadScript>
  );
};

import { X } from "lucide-react"; // Using lucide-react for better icons
import { useLanguage } from "@/app/context/language-context";
import { FaLocationDot } from "react-icons/fa6";
import { Card, CardContent } from "@/components/ui/card";

const Popup = ({
  togglePopup,
  startDate,
  endDate,
}: {
  togglePopup: () => void;
  startDate: Date | null;
  endDate: Date | null;
}) => {
  const [selectedOption, setSelectedOption] = useState("Single Booking");
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  const handleExploreBus = () => {
    try {
      showLoader();

      const isMultipleBooking = selectedOption === "Multiple Booking";
      router.push(
        `/list?isMultipleBooking=${isMultipleBooking}&fromDate=${startDate}&toDate=${endDate}`
      );
    } catch (error) {
    } finally {
      hideLoader();
    }
  };
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white p-4 md:p-8 w-full max-w-xs md:max-w-xl mx-2 text-center rounded-xl shadow-2xl relative border border-gray-100">
        {/* Close Button - smaller on mobile */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1 rounded-full transition-all duration-200 cursor-pointer"
          onClick={togglePopup}
          aria-label="Close popup"
        >
          <X size={18} />
        </button>

        {/* Adjusted heading size for mobile */}
        <h2 className="text-sm md:text-base font-medium text-gray-800 mb-3 md:mb-4">
          Please Select Number of Buses
        </h2>

        {/* Responsive image container */}
        <div className="flex justify-center mb-4 md:mb-6 overflow-hidden rounded-lg">
          <Image
            src={selectedOption === "Single Booking" ? single : multi}
            alt={`${selectedOption} illustration`}
            width={200}
            height={200}
            className="w-[180px] md:w-[280px] object-contain transition-all duration-300"
          />
        </div>

        {/* More compact toggle switch for mobile */}
        <div className="flex bg-[#0f7bab] rounded-full p-0.5 md:p-1 mb-6 md:mb-8 shadow-md">
          <button
            className={`flex-1 text-center py-2 md:py-3 rounded-full transition-all duration-300 text-xs md:text-sm font-medium cursor-pointer ${
              selectedOption === "Single Booking"
                ? "bg-white text-[#0f7bab] shadow-sm"
                : "text-white hover:bg-[#0d6b96]"
            }`}
            onClick={() => setSelectedOption("Single Booking")}
          >
            Single Booking
          </button>
          <button
            className={`flex-1 text-center py-2 md:py-3 rounded-full transition-all duration-300 text-xs md:text-sm font-medium cursor-pointer ${
              selectedOption === "Multiple Booking"
                ? "bg-white text-[#0f7bab] shadow-sm"
                : "text-white hover:bg-[#0d6b96]"
            }`}
            onClick={() => setSelectedOption("Multiple Booking")}
          >
            Multiple Booking
          </button>
        </div>

        {/* Full-width button on mobile */}
        <div className="flex items-center justify-center">
          <button
            className="w-full text-[#0f7bab] border-2 border-[#0f7bab] hover:bg-[#0f7bab] hover:text-white rounded-full py-2 md:py-3 px-4 md:px-6 text-xs md:text-sm font-medium cursor-pointer transition-all duration-300 shadow-sm"
            onClick={handleExploreBus}
          >
            Explore Bus
          </button>
        </div>
      </div>
    </div>
  );
};

interface DestinationCardProps {
  image: string;
  title: string;
  days: number;
  highlights: string;
  includes: string[];
  disclaimer: string;
  price: string | number;
}
const DestinationCard: React.FC<DestinationCardProps> = ({
  image,
  title,
  days,
  highlights,
  includes,
  disclaimer,
  price,
}) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartClockPicker, setShowStartClockPicker] = useState(false);
  const [showEndClockPicker, setShowEndClockPicker] = useState(false);
  const [clockPickerDate, setClockPickerDate] = useState<Date | null>(null);
  const { showLoader, hideLoader } = useLoader();

  // Carousel state and refs
  const [currentIncludeIndex, setCurrentIncludeIndex] = useState(0);
  const includesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToIncludeIndex = (idx: number) => {
    if (!includesContainerRef.current) return;

    const container = includesContainerRef.current;
    const item = container.children[0] as HTMLElement;
    const itemWidth = item?.offsetWidth || 300;
    const gap = 16;

    container.scrollTo({
      left: idx * (itemWidth + gap),
      behavior: "smooth",
    });

    setCurrentIncludeIndex(idx);
  };

  useEffect(() => {
    const container = includesContainerRef.current;
    if (!container || includes.length <= 3) return;

    const handleScroll = () => {
      const item = container.children[0] as HTMLElement;
      const itemWidth = item?.offsetWidth || 300;
      const gap = 16;
      const scrollPosition = container.scrollLeft;
      const newIndex = Math.round(scrollPosition / (itemWidth + gap));
      setCurrentIncludeIndex(
        Math.max(0, Math.min(newIndex, includes.length - 1))
      );
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [includes?.length]);

  const validEndDateRange = useMemo(() => {
    if (!startDate) return { minDate: null, maxDate: null };

    let minDate;
    if (days === 1) {
      minDate = new Date(startDate);
    } else {
      minDate = new Date(startDate);
      minDate.setDate(startDate.getDate() + 1);
    }

    const maxDate = new Date(startDate);
    maxDate.setDate(startDate.getDate() + days);

    return { minDate, maxDate };
  }, [startDate, days]);

  const formatISODate = (date: Date): string => {
    // Create a new date object to avoid modifying the original
    const localDate = new Date(date);

    // Format as ISO string without timezone conversion
    const pad = (num: number) => num.toString().padStart(2, "0");

    return (
      `${localDate.getFullYear()}-${pad(localDate.getMonth() + 1)}-${pad(
        localDate.getDate()
      )}` +
      `T${pad(localDate.getHours())}:${pad(localDate.getMinutes())}:${pad(
        localDate.getSeconds()
      )}`
    );
  };

  const handleStartDateChange = (date: Date | null) => {
    if (!date) {
      setStartDate(null);
      setEndDate(null);
      return;
    }

    setStartDate(date);
    setClockPickerDate(date);
    setShowStartDatePicker(false);
    setShowStartClockPicker(true);
    setEndDate(null);
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!date) {
      setEndDate(null);
      return;
    }

    if (startDate) {
      const newEndDate = new Date(date);
      newEndDate.setHours(startDate.getHours());
      newEndDate.setMinutes(startDate.getMinutes());
      setEndDate(newEndDate);
      setClockPickerDate(newEndDate);
    } else {
      setEndDate(date);
      setClockPickerDate(date);
    }

    setShowEndDatePicker(false);
    setShowEndClockPicker(true);
  };

  const handleStartTimeSelected = (date: Date) => {
    // Calculate the maximum allowed end date (same time X days later)
    const maxEndDate = new Date(date);
    maxEndDate.setDate(date.getDate() + days);

    setStartDate(date);
    setEndDate(maxEndDate); // Set initial end date to maximum allowed
    setEndDate(maxEndDate); // Set initial end date to maximum allowed
    setShowStartClockPicker(false);
  };

  const isEndTimeValid = (time: Date): boolean => {
    const maxEndDate = getMaxEndTime();
    if (!maxEndDate) return false;

    // Time must be ≤ maxEndDate (same time, X days later)
    return time <= maxEndDate;
  };

  const handleEndTimeSelected = (date: Date) => {
    if (!startDate) return;

    // Calculate the maximum allowed end time (same time X days later)
    const maxEndDate = new Date(startDate);
    maxEndDate.setDate(startDate.getDate() + days);

    // If selected time exceeds the maximum allowed
    if (date > maxEndDate) {
      // Auto-co
      setEndDate(maxEndDate);
      alert(
        `For this ${days}-day package, return time cannot be after ${format(
          maxEndDate,
          "MMMM do, h:mm a"
        )}`
      );
    } else {
      setEndDate(date);
    }

    setShowEndClockPicker(false);
  };

  // Add this helper function to get the maximum allowed end time
  const getMaxEndTime = (): Date | null => {
    if (!startDate) return null;

    const maxEndDate = new Date(startDate);
    maxEndDate.setDate(startDate.getDate() + days);
    return maxEndDate;
  };
  const isEndDateSelectable = (date: Date) => {
    if (!startDate) return false;

    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);

    const startDateCopy = new Date(startDate);
    startDateCopy.setHours(0, 0, 0, 0);

    const maxDate = new Date(startDateCopy);
    maxDate.setDate(startDateCopy.getDate() + days);

    if (days === 1) {
      return dateToCheck >= startDateCopy && dateToCheck <= maxDate;
    }

    return dateToCheck > startDateCopy && dateToCheck <= maxDate;
  };

  useEffect(() => {
    if (startDate && endDate && showEndClockPicker) {
      if (format(startDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd")) {
        const startHour = startDate.getHours();
        const startMinute = startDate.getMinutes();
        const endHour = endDate.getHours();
        const endMinute = endDate.getMinutes();

        if (
          endHour < startHour ||
          (endHour === startHour && endMinute <= startMinute)
        ) {
          const newEndDate = new Date(endDate);
          newEndDate.setHours(startHour + 1);
          newEndDate.setMinutes(startMinute);
          setEndDate(newEndDate);
        }
      }
    }
  }, [startDate, endDate, showEndClockPicker]);

  const handleDateSelect = async () => {
    if (!startDate || !endDate || !origin) return;

    // Clone dates to avoid modification
    const start = new Date(startDate);
    const end = new Date(endDate);

    const fromDateParam = formatISODate(start);
    const toDateParam = formatISODate(end);

    // Store data in sessionStorage before navigation
    const packageFormData = {
      fromDate: fromDateParam,
      toDate: toDateParam,
      packageTitle: title,
      source: origin,
      sourceLatitude: sourceCoords.latitude,
      sourceLongitude: sourceCoords.longitude,
      days: days,
      endDateManuallySet: true, // Add this flag if needed
    };

    sessionStorage.setItem(
      "package_form__data",
      JSON.stringify(packageFormData)
    );

    const url = `/packages?packageName=${encodeURIComponent(
      title
    )}&days=${days}&source=${encodeURIComponent(
      origin
    )}&fromDate=${fromDateParam}&toDate=${toDateParam}&sourceLatitude=${
      sourceCoords.latitude
    }&sourceLongitude=${sourceCoords.longitude}`;

    try {
      showLoader();
      await new Promise((resolve) => setTimeout(resolve, 500));
      await router.push(url);
      setShowModal(false);
    } catch (error) {
    } finally {
      hideLoader();
    }
  };
  const packageName = title;
  const [pricingData, setPricingData] = useState<Record<string, string>>({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const fetchPrices = async (month: number, year: number) => {
    setIsLoadingPrices(true);
    try {
      const today = new Date();
      const isCurrentMonth =
        month === today.getMonth() && year === today.getFullYear();

      const startDate = isCurrentMonth
        ? addDays(today, 1).toISOString().split("T")[0]
        : new Date(year, month, 1).toISOString().split("T")[0];

      const response = await findLowestPrice(startDate, packageName);

      if (response && Array.isArray(response)) {
        const newPrices = response.reduce((acc, item) => {
          if (item.lowestPrice > 0) {
            const date = new Date(item.availableDate);
            const utcDate = new Date(
              Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
            );
            const dateKey = item.availableDate.split("T")[0];
            acc[dateKey] = `₹${item.lowestPrice.toLocaleString("en-IN")}`;
          }
          return acc;
        }, {} as Record<string, string>);

        setPricingData((prev) => ({ ...prev, ...newPrices }));
      }
    } catch (error) {
    } finally {
      setIsLoadingPrices(false);
    }
  };

  const [monthsShown, setMonthsShown] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setMonthsShown(window.innerWidth <= 650 ? 1 : 2);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [origin, setOrigin] = useState<string>("");
  const [errorOrigin, setErrorOrigin] = useState<string>("");
  const originRef = useRef<google.maps.places.Autocomplete | null>(null);
  const handlePlaceChanged = (
    ref: React.MutableRefObject<google.maps.places.Autocomplete | null>,
    setter: (value: string) => void,
    fieldName: string
  ) => {
    if (ref.current) {
      const place = ref.current.getPlace();
      if (place?.formatted_address) {
        setter(place.formatted_address);
        setErrorOrigin("");
      } else {
        setErrorOrigin(`Please select a valid ${fieldName} from the dropdown`);
      }
    }
  };
  const getPriceForDate = (date: Date): string => {
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dateString = utcDate.toISOString().split("T")[0];
    return pricingData[dateString] ?? "";
  };

  const [sourceCoords, setSourceCoords] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const nextMonth = addMonths(tomorrow, 1);
  const fetchCoordinates = async (
    address: string,
    type: "source" | "destination"
  ) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=AIzaSyBB6-8inLCozBj_SKuhrK0bhuO2Jxw35IU`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const coords = { latitude: location.lat, longitude: location.lng };

        if (type === "source") {
          setSourceCoords(coords);
          setErrorOrigin(""); // Clear error if successful
        }

        console.log(
          `${type} => `,
          location.lat.toString(),
          location.lng.toString()
        );
      } else {
        toast.error("Unable to fetch coordinates for the location.");
        if (type === "source") {
          setErrorOrigin("Unable to fetch coordinates for origin.");
        }
        setStartDate(null);
        setEndDate(null);
      }
    } catch (error) {
      toast.error("Error fetching coordinates.");
      if (type === "source") {
        setErrorOrigin("Error fetching coordinates for origin.");
      }
      setStartDate(null);
      setEndDate(null);
    }
  };
  const CustomDateInput = React.forwardRef(
    ({ value, onClick, label, disabled }: any, ref: any) => (
      <div
        className={`flex items-center w-full max-w-xl p-2 border rounded-md ${
          disabled
            ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
            : "cursor-pointer hover:border-blue-500"
        }`}
        onClick={disabled ? undefined : onClick}
        ref={ref}
      >
        <MdDateRange className="text-gray-700 mr-2" />
        <span>{value || `Select ${label || "date"}`}</span>
      </div>
    )
  );

  CustomDateInput.displayName = "CustomDateInput";

  return (
    <div
      onClick={(e) => {
        setShowModal(true);
        fetchPrices(nextMonth.getMonth(), nextMonth.getFullYear());
        fetchPrices(tomorrow.getMonth(), tomorrow.getFullYear());
      }}
      className="w-full bg-white shadow overflow-hidden text-[11px]  cursor-pointer sm:text-[12px] mt-12 sm:mt-0"
    >
      <div className="relative w-full h-[190px] sm:h-[180px]">
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            setShowModal(true);
            fetchPrices(nextMonth.getMonth(), nextMonth.getFullYear());
            fetchPrices(tomorrow.getMonth(), tomorrow.getFullYear());
          }}
        />
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
          <h2 className="text-sm sm:text-base font-semibold line-clamp-1">
            {title}
          </h2>
          <p className="text-[10px] sm:text-[11px] bg-[#E8F8FF] text-[#0f7bab] px-2 sm:px-3 text-nowrap font-medium py-0.5 rounded-sm mt-1 sm:mt-0">
            {days} {days > 1 ? "Days" : "Day"}
          </p>
        </div>
        <p className="text-gray-500 text-[10px] font-medium mb-3 sm:mb-4 leading-snug line-clamp-2">
          {highlights}
        </p>

        {/* Updated Includes Section with Carousel */}
        <div className="flex flex-col gap-1.5 sm:gap-2 text-[10px] mb-3 sm:mb-4">
          {includes.length > 3 ? (
            <div className="relative w-full">
              <section
                className="flex overflow-x-auto scrollbar-hide pb-4"
                ref={includesContainerRef}
              >
                <div
                  className="flex flex-nowrap gap-4 sm:gap-6 md:gap-6 lg:gap-10 xl:gap-12 px-2 sm:px-4"
                  style={{ width: `${includes.length * 100}%` }}
                >
                  {includes.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-[85%] sm:w-[45%] md:w-[48%] lg:w-[30%]"
                    >
                      <span
                        className={`flex items-start sm:items-center text-[10px] ${
                          item === "No Accommodation provided"
                            ? "text-[#C86932]"
                            : "text-green-600"
                        }`}
                      >
                        {item === "No Accommodation provided" ? (
                          <TiTimes className="text-base flex-shrink-0 mt-0.5 sm:mt-0" />
                        ) : (
                          <TiTick className="text-base flex-shrink-0 mt-0.5 sm:mt-0" />
                        )}
                        <span className="ml-1 line-clamp-1">{item}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex justify-center gap-2 mt-4">
                {includes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToIncludeIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full ${
                      currentIncludeIndex === idx
                        ? "bg-[#0f7bab]"
                        : "bg-gray-300"
                    }`}
                    aria-label={`Go to item ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 sm:gap-2 text-[10px] mb-3 sm:mb-4">
              {includes.map((item, idx) => (
                <span
                  key={idx}
                  className={`flex items-start sm:items-center ${
                    item === "No Accommodation provided"
                      ? "text-[#C86932]"
                      : "text-green-600"
                  }`}
                >
                  {item === "No Accommodation provided" ? (
                    <TiTimes className="text-base flex-shrink-0 mt-0.5 sm:mt-0" />
                  ) : (
                    <TiTick className="text-base flex-shrink-0 mt-0.5 sm:mt-0" />
                  )}
                  <span className="ml-1 line-clamp-1">{item}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className="bg-gray-100 p-2 sm:p-2.5 flex rounded gap-2 items-center justify-between cursor-pointer hover:bg-blue-300 transition-colors duration-200 active:scale-95 group"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            setShowModal(true);
            fetchPrices(nextMonth.getMonth(), nextMonth.getFullYear());
            fetchPrices(tomorrow.getMonth(), tomorrow.getFullYear());
          }}
        >
          <span className="text-[9px] sm:text-[10px] leading-tight line-clamp-1 ">
            {disclaimer}
          </span>
          <span className="text-xs sm:text-sm font-semibold whitespace-nowrap ml-2 ">
            ₹ {price}
          </span>
        </div>
      </div>

      {/* Date Selection Modal */}
      {showModal && (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Select Travel Dates</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="PickUp Location in Karnataka"
                  className={`w-full p-3 rounded-md border border-black bg-none text-gray-900 text-sm focus:outline-none`}
                  value={origin}
                  ref={(input) => {
                    if (input && !originRef.current) {
                      const options = {
                        // Include establishment type to get businesses, hotels, etc.
                        types: ["geocode", "establishment"],
                        // Add component restrictions for India
                        componentRestrictions: { country: "IN" },
                        fields: [
                          "formatted_address",
                          "geometry",
                          "address_components",
                          "name",
                        ],
                      };

                      originRef.current = new google.maps.places.Autocomplete(
                        input,
                        options
                      );

                      // Set bounds to Karnataka region
                      const karnatakaBounds = new google.maps.LatLngBounds(
                        new google.maps.LatLng(11.5, 74.0), // SW corner
                        new google.maps.LatLng(18.5, 78.5) // NE corner
                      );
                      originRef.current.setBounds(karnatakaBounds);

                      // Strict bounds will only return results within the specified bounds
                      originRef.current.setOptions({ strictBounds: true });

                      originRef.current.addListener("place_changed", () => {
                        const place = originRef.current?.getPlace();
                        if (!place || !place.address_components) return;

                        const stateComponent = place.address_components.find(
                          (component) =>
                            component.types.includes(
                              "administrative_area_level_1"
                            )
                        );

                        // Get the full formatted address or name if it's an establishment
                        const address = place.formatted_address || place.name;

                        // Check if the place is in Karnataka
                        if (
                          stateComponent?.long_name === "Karnataka" &&
                          address
                        ) {
                          setOrigin(address);
                          fetchCoordinates(address, "source");
                        } else {
                          setOrigin(""); // Clear field
                          setErrorOrigin(
                            "Please select a location within Karnataka"
                          );
                        }
                      });
                    }
                  }}
                  onChange={(e) => {
                    setOrigin(e.target.value);
                    setStartDate(null);
                    setEndDate(null);
                    setErrorOrigin("");
                  }}
                />
                {errorOrigin && (
                  <p className="text-[#C86932] text-xs mt-1">{errorOrigin}</p>
                )}
              </div>
            </div>
            {/* Start Date Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1 ">
                Start Date & Time
              </label>

              {/* Start Date Picker */}
              <div className="datepicker-wrapper-two">
                <DatePicker
                  selected={startDate}
                  disabled={!origin}
                  popperClassName="custom-datepicker-popper-v2"
                  onChange={handleStartDateChange}
                  minDate={addDays(new Date(), 1)}
                  customInput={
                    <CustomDateInput label="start date" disabled={!origin} />
                  }
                  dateFormat="MMMM dd, yyyy h:mm aa"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  open={showStartDatePicker}
                  onClickOutside={() => setShowStartDatePicker(false)}
                  onInputClick={() => origin && setShowStartDatePicker(true)}
                  monthsShown={monthsShown}
                  renderDayContents={(day, date) => {
                    const isSelected =
                      startDate &&
                      format(date, "yyyy-MM-dd") ===
                        format(startDate, "yyyy-MM-dd");
                    const price = getPriceForDate(date);

                    return (
                      <div
                        className={`flex flex-col items-center justify-center w-10 h-14 p-1 ${
                          isSelected
                            ? "bg-[#01374e] text-white"
                            : !origin
                            ? "text-gray-400 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <span className="text-sm">{day}</span>
                        {price && (
                          <span
                            className={`text-[8px] mt-[2px] ${
                              isSelected ? "text-white" : "text-green-300"
                            }`}
                          >
                            {price}
                          </span>
                        )}
                      </div>
                    );
                  }}
                  onMonthChange={(date: Date) => {
                    const month = date.getMonth();
                    const year = date.getFullYear();

                    if (!isLoadingPrices) {
                      fetchPrices(month, year);
                      if (monthsShown > 1) fetchPrices(month + 1, year);
                    }
                  }}
                />
              </div>

              {/* Show selected start date and time */}
            </div>

            {/* End Date Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date & Time
              </label>
              <div className="datepicker-wrapper-two">
                <DatePicker
                  selected={endDate}
                  disabled={!startDate}
                  onChange={handleEndDateChange}
                  minDate={validEndDateRange?.minDate ?? undefined}
                  maxDate={validEndDateRange?.maxDate ?? undefined}
                  customInput={
                    <CustomDateInput label="end date" disabled={!startDate} />
                  }
                  popperClassName="custom-datepicker-popper-v2"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  open={showEndDatePicker}
                  onClickOutside={() => setShowEndDatePicker(false)}
                  onInputClick={() => startDate && setShowEndDatePicker(true)}
                  monthsShown={monthsShown}
                  renderDayContents={(day, date) => {
                    const isSelected =
                      endDate &&
                      format(date, "yyyy-MM-dd") ===
                        format(endDate, "yyyy-MM-dd");
                    const isSelectable = isEndDateSelectable(date);

                    return (
                      <div
                        className={`flex flex-col items-center justify-center w-10 h-14 p-1 ${
                          isSelected
                            ? "bg-[#01374e] text-white"
                            : !isSelectable
                            ? "text-gray-400 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <span className="text-sm">{day}</span>
                      </div>
                    );
                  }}
                  filterDate={isEndDateSelectable}
                  dateFormat="MMMM dd, yyyy h:mm aa"
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {days === 1
                  ? "1-day tour must end between 1 hour after start and next day same time"
                  : `${days}-day tour must end between 1 hour after start and ${days} days later`}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setStartDate(null);
                  setEndDate(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium cursor-pointer text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDateSelect}
                disabled={!startDate || !endDate}
                className={`px-4 py-2 text-white rounded-md text-sm font-medium ${
                  !startDate || !endDate
                    ? "bg-gray-400 cursor-not-allowed ignore"
                    : "bg-[#0f7bab] hover:bg-[#01374e] cursor-pointer"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>

          {/* Start Date Time Picker Modal */}
          {showStartClockPicker && clockPickerDate && (
            <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center">
              <ClockTimePicker
                selectedTime={clockPickerDate}
                onChange={handleStartTimeSelected}
                onClose={() => setShowStartClockPicker(false)}
                startDate={clockPickerDate}
                numberOfDays={days}
                isEndDatePicker={false}
                isPackage={true}
                style={
                  typeof window !== "undefined" && window.innerWidth < 620
                    ? {
                        position: "absolute",
                        top: "50%",
                        left: "8vw",
                      }
                    : { position: "absolute", left: "40vw", top: "45vh" }
                }
              />
            </div>
          )}

          {/* End Date Time Picker Modal */}
          {showEndClockPicker && clockPickerDate && (
            <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center">
              <ClockTimePicker
                selectedTime={clockPickerDate}
                onChange={handleEndTimeSelected}
                onClose={() => setShowEndClockPicker(false)}
                startDate={startDate!}
                numberOfDays={days}
                isPackage={true}
                isEndDatePicker={true}
                style={
                  typeof window !== "undefined" && window.innerWidth < 620
                    ? {
                        position: "absolute",
                        top: "50%",
                        left: "8vw",
                      }
                    : { position: "absolute", left: "40vw", top: "45vh" }
                }
              />
            </div>
          )}
        </div>
      )}

      <style jsx global>
        {`

                    .datepicker-wrapper-two .react-datepicker-popper{
      position: absolute;
      left: 15% !important;
      top: 20% !important;
      transform: translate(0, 0)!important;
      }
        .custom-datepicker-popper-v2 {
        background-color:#ffff !important
        }
        .custom-datepicker-popper-v2 .react-datepicker__header{
        background-color:#ffff !important;
        }
        .custom-datepicker-popper-v2 .react-datepicker{
          background-color:#ffff !important;
        }
          .custom-datepicker-popper-v2 .react-datepicker__day-name,
          .custom-datepicker-popper-v2 .react-datepicker__day,
          .custom-datepicker-popper-v2 .react-datepicker__time-name{
          margin:0.25rem!important;
        }
          .custom-datepicker-popper-v2 .react-datepicker__day--selected:not([aria-disabled=true]):hover,
          .custom-datepicker-popper-v2 .react-datepicker__day--in-selecting-range:not([aria-disabled=true]):hover,
          .custom-datepicker-popper-v2 .react-datepicker__day--in-range:not([aria-disabled=true]):hover,
          .custom-datepicker-popper-v2 .react-datepicker__month-text--selected:not([aria-disabled=true]):hover,
          .custom-datepicker-popper-v2 .react-datepicker__month-text--in-selecting-range:not([aria-disabled=true]):hover,
          .custom-datepicker-popper-v2 .react-datepicker__month-text--in-range:not([aria-disabled=true]):hover,
          .custom-datepicker-popper-v2 .react-datepicker__quarter-text--selected:not([aria-disabled=true]):hover,
          .custom-datepicker-popper-v2 .react-datepicker__quarter-text--in-selecting-range:not([aria-disabled=true]):hover,
          .custom-datepicker-popper-v2 .react-datepicker__quarter-text--in-range:not([aria-disabled=true]):hover,
          .custom-datepicker-popper-v2 .react-datepicker__year-text--selected:not([aria-disabled=true]):hover,
          .custom-datepicker-popper-v2 .react-datepicker__year-text--in-selecting-range:not([aria-disabled=true]):hover,
          .custom-datepicker-popper-v2 .react-datepicker__year-text--in-range:not([aria-disabled=true]):hover{
            border-radius:0%!important;
            background-color:#fff!important;
        }
            .custom-datepicker-popper-v2 .react-datepicker__day--selected,
            .custom-datepicker-popper-v2 .react-datepicker__day--in-selecting-range,
            .custom-datepicker-popper-v2 .react-datepicker__day--in-range,
            .custom-datepicker-popper-v2 .react-datepicker__month-text--selected,
            .custom-datepicker-popper-v2 .react-datepicker__month-text--in-selecting-range,
            .custom-datepicker-popper-v2 .react-datepicker__month-text--in-range,
            .custom-datepicker-popper-v2 .react-datepicker__quarter-text--selected,
            .custom-datepicker-popper-v2 .react-datepicker__quarter-text--in-selecting-range,
            .custom-datepicker-popper-v2 .react-datepicker__quarter-text--in-range,
            .custom-datepicker-popper-v2 .react-datepicker__year-text--selected,
            .custom-datepicker-popper-v2 .react-datepicker__year-text--in-selecting-range,
            .custom-datepicker-popper-v2 .react-datepicker__year-text--in-range {
            border-radius:0%!important;
        }
          .custom-datepicker-popper-v2 .react-datepicker__day--keyboard-selected,
          .custom-datepicker-popper-v2 .react-datepicker__month-text--keyboard-selected,
          .custom-datepicker-popper-v2 .react-datepicker__quarter-text--keyboard-selected,
          .custom-datepicker-popper-v2 .react-datepicker__year-text--keyboard-selected {
            background-color: transparent !important;
          }
        .custom-datepicker-popper-v2 .react-datepicker-popper{
        left:20% !important;
        top:20% !important;
        transform:translate(0, 0)!important;
        }  
           
    @media only screen and (max-width: 650px) {
    .custom-datepicker-popper-v2 .react-datepicker {
    margin-left: -43px;
    width:348px;
    }
    .datepicker-wrapper-two .react-datepicker-popper {
    width:303px;
    }
    .custom-datepicker-popper-v2 {
    width:100%;
      background-color: white !important;
      color: black !important;
    }

    .custom-datepicker-popper-v2 .react-datepicker__header {
      background-color: white !important;
      border-bottom: 1px solid #e5e7eb;
    }
          .custom-datepicker-popper-v2 .react-datepicker__day--range-end.react-datepicker__day--in-range {
            border-radius:0%!important;
        }
           
          .custom-datepicker-popper-v2 .react-datepicker__day--selected:not(.react-datepicker__day--outside-month){
              background-color:#01374e!important;
          border-radius:0%!important;
          }

      .custom-datepicker-popper-v2 .react-datepicker__day:hover,
      .custom-datepicker-popper-v2 .react-datepicker__day--keyboard-selected,
      .custom-datepicker-popper-v2 .react-datepicker__day--selected,
      .custom-datepicker-popper-v2 .react-datepicker__day--in-range,
      .custom-datepicker-popper-v2 .react-datepicker__day--in-selecting-range,
      .custom-datepicker-popper-v2 .react-datepicker__day--range-end {
        border-radius: 0% !important;
      }
            `}
      </style>
    </div>
  );
};

export default Home;
