"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { VscAccount } from "react-icons/vsc";
import { TbLocationCancel } from "react-icons/tb";
import { RiCustomerServiceLine } from "react-icons/ri";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegCalendarAlt } from "react-icons/fa";
import LoginModal from "../login-modal/loginmodal";
import { GrHomeRounded } from "react-icons/gr";
import { LuLanguages } from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "@/app/Redux/authSlice";
import { MdOutlineDirectionsBusFilled } from "react-icons/md";
import { logoutUser } from "@/app/services/data.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/app/context/language-context";
import logo_img from "../../app/assests/images/nandu tours and travels logo png.png";
import ErrorPopup from "../login-modal/errorLogin";
import { useLogin } from "@/app/hooks/login/useLogin";

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const useAuth = useSelector(selectAuth);
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const {errorMessage}=useLogin();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const [userType, setUserType] = useState<string | null>(null);

  const handleMouseEnter = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId.current = setTimeout(() => setIsOpen(false), 300);
  };

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (useAuth.isAuthenticated) {
      setUserType(useAuth.user?.user.userType || null);
    }
  }, [useAuth.isAuthenticated, useAuth.user]);

  useEffect(() => {
    if (useAuth.isAuthenticated && shouldRedirect) {
      if (userType === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/myaccount/mytrips");
      }
      setShouldRedirect(false);
    }
  }, [useAuth.isAuthenticated, shouldRedirect, router, userType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }

  if (isOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isOpen]);

  const closeErrorPopup = () => {
    handleLogout();
  };
  const isActive = (path: string) =>
    mounted && pathname === path ? "text-[#0f7bab] font-semibold" : "";

  const handleLogout = async () => {
    try {
      await logoutUser(dispatch);
      sessionStorage.clear();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavClick = (path: string, requiresAuth: boolean = false) => {
    if (requiresAuth && !useAuth.isAuthenticated) {
      setIsLoginModalOpen(true);
      setShouldRedirect(true);
    } else {
      if (userType === "admin" && !path.startsWith("/admin")) {
        router.push("/admin/dashboard");
      } else {
        router.push(path);
      }
    }
  };

  const toggleLanguageDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isMyTripsPage = pathname?.startsWith("/myaccount/mytrips") ?? false;
  const changeLanguage = (lang: "en" | "kn") => {
    setLanguage(lang);
    setIsDropdownOpen(false);
  };
  const isAdmin = pathname.includes("/admin");

  return (
    <>
<header className="fixed top-0 left-0 w-full bg-white shadow-sm z-20 h-fit md:h-[85px]">
<div className=" mx-auto flex items-center justify-between p-2 md:p-4">
          {/* Logo - Modified for better responsive behavior */}
          <div className="flex items-center cursor-pointer min-w-[100px] lg:min-w-[120px] ml-[9px]">
            <Link href="/">
              {mounted ? (
                <Image
                  src={logo_img}
                  alt="Logo"
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                  priority
                />
              ) : (
                <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full" />
              )}
            </Link>
          </div>

          {!isAdmin && (
            <nav className="hidden md:flex flex-1 justify-center mx-0 lg:mx-4">
              <ul className="flex space-x-9 lg:space-x-8 xl:space-x-12">
                {mounted ? (
                  <>
                    <li
                      className={`flex items-center space-x-2 cursor-pointer ${isActive(
                        "/"
                      )}`}
                    >
                      <GrHomeRounded />
                      <Link
                        href="/"
                        className="text-xs md:text-xs text-nowrap font-medium"
                      >
                        {t("home")}
                      </Link>
                    </li>
                
                    {userType !== "admin" && (
                      <>
                       {useAuth.isAuthenticated && userType !== "admin" && (
                      <li
                        className={`flex items-center space-x-2 cursor-pointer ${isActive(
                          "/myaccount/mytrips"
                        )}`}
                      >
                        <MdOutlineDirectionsBusFilled />
                        <Link
                          href="/myaccount/mytrips"
                          className="text-xs md:text-xs text-nowrap font-medium"
                        >
                          {t("myTrips")}
                        </Link>
                      </li>
                    )}
                       
                        <li
                          className={`flex items-center space-x-2 cursor-pointer ${isMyTripsPage ? "hidden" : ""}`}
                          onClick={() =>
                            !isMyTripsPage &&
                            handleNavClick("/myaccount/mytrips", true)
                          }
                        >
                          <FaRegCalendarAlt />
                          <span className="text-xs md:text-xs text-nowrap font-medium">
                            {t("reschedule")}
                          </span>
                        </li>
                        <li
                          className={`flex items-center space-x-2 cursor-pointer ${isMyTripsPage ? "hidden" : ""}`}
                          onClick={() =>
                            !isMyTripsPage &&
                            handleNavClick("/myaccount/mytrips", true)
                          }
                        >
                          <TbLocationCancel />
                          <span className="text-xs md:text-xs text-nowrap font-medium">
                            {t("cancel")}
                          </span>
                        </li>
                      </>
                    )}
                   
                        <li
                      className={`flex items-center space-x-2 cursor-pointer ${isActive(
                        "/contact"
                      )}`}
                    >
                      <RiCustomerServiceLine />
                      <Link
                        href="/contact"
                        className="text-xs md:text-xs text-nowrap font-medium"
                      >
                        {t("contactUs")}
                      </Link>
                    </li>
                  </>
                ) : (
                  [...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="w-16 h-6 rounded-md" />
                  ))
                )}
              </ul>
            </nav>
          )}

          {/* Login & Language Switcher - Adjusted spacing */}
          <div className="flex items-center  sm:gap-4 md:gap-0 lg:gap-8 cursor-pointer">
            {userType === "admin" && mounted && (
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="flex items-center space-x-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-[#0f7bab]"
              >
                <span>Dashboard</span>
              </button>
            )}
<div className="relative group mr-[-16px] md:mr-0">
{mounted ? (
    <button 
      className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all cursor-pointer"
      onClick={() => {
        // Directly open modal if not authenticated (only one option)
        if (!useAuth.isAuthenticated) {
          setIsLoginModalOpen(true);
        } else {
          // For authenticated users, keep dropdown behavior
          setIsOpen(!isOpen);
        }
      }}
    >
      {useAuth.isAuthenticated ? (
        <div className="flex items-center space-x-2">
          {useAuth.user?.user.firstName ? (
            <>
              <div className="relative">
                <VscAccount className="w-5 h-5 text-green-500" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <span
  className="hidden md:inline text-xs font-medium"
  title={useAuth.user.user.firstName}
>
  {t("hi")},{" "}
  {(() => {
    const name = useAuth.user.user.firstName || "";
    const firstWord = name.split(" ")[0];
    return firstWord.length > 8 ? firstWord.slice(0, 8) + "..." : firstWord;
  })()}
</span>


            </>
          ) : (
            <>
              <div className="relative">
                <VscAccount className="w-5 h-5 text-blue-500" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></span>
              </div>
              <span className="hidden lg:inline text-xs font-medium">
                {t("welcome")}
              </span>
            </>
          )}
        </div>
      ) : (
        <>
          <VscAccount className="w-5 h-5 text-gray-500" />
          <span className="hidden md:inline text-xs font-medium">
            {t("login")}
          </span>
        </>
      )}
    </button>
  ) : (
    <Skeleton className="w-10 h-10 rounded-full" />
  )}

  {/* Sticky Underline - Only show for authenticated users */}
  {useAuth.isAuthenticated && (
    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0f7bab] transform scale-x-0 group-hover:scale-x-100 transition-all duration-300 ease-out"></div>
  )}

  {/* Dropdown - Only show for authenticated users */}
  {useAuth.isAuthenticated && (
    <AnimatePresence>
      {isOpen && (
        <motion.div
         ref={dropdownRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`absolute mt-6 w-40 bg-white shadow-lg border right-0 border-gray-200 overflow-hidden`}
        >
          <ul className="py-1">
            {/* Keep existing authenticated user dropdown content */}
            {userType === "admin" ? (
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 text-sm hover:text-red-900 cursor-pointer"
                >
                  {t("logout")}
                </button>
              </li>
            ) : (
              <>
                <li className="">
                  <Link
                    href="/myaccount/myprofile"
                    className="block px-4 py-2 text-sm hover:text-[#0f7bab]"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("myProfile")}
                  </Link>
                </li>
                
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 text-sm hover:text-red-900 cursor-pointer"
                  >
                    {t("logout")}
                  </button>
                </li>
              </>
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  )}
</div>

            {/* Language Switcher */}
            <div
              style={{ display: isAdmin ? "none" : "block" }}
              className="relative"
              ref={langDropdownRef}
            >
              {mounted ? (
                <button
                  onClick={toggleLanguageDropdown}
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg transition-all cursor-pointer"
                >
                <LuLanguages className="w-5 h-5" />
                  <span className="hidden md:inline text-xs">
                    {language === "en" ? t("english") : t("kannada")}
                  </span>
                </button>
              ) : (
                <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
              )}

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-32 bg-white shadow-lg border border-gray-200 rounded-md overflow-hidden z-20"
                  >
                    <ul>
                      <li>
                        <button
                          onClick={() => changeLanguage("en")}
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            language === "en" ? "text-[#0f7bab] font-medium" : ""
                          }`}
                        >
                          English
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => changeLanguage("kn")}
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            language === "kn" ? "text-[#0f7bab] font-medium" : ""
                          }`}
                        >
                          ಕನ್ನಡ (Kannada)
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Footer Navigation - Hidden on desktop */}
      {userType !== "admin" && (
        <footer className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-200 z-10 md:hidden">
          <nav className="container mx-auto">
            <ul className="flex justify-around items-center py-2">
              <li
                className={`flex flex-col items-center p-2 ${isActive("/")}`}
                onClick={() => handleNavClick("/")}
              >
                <GrHomeRounded className="text-lg" />
                <span className="text-xs mt-1">{t("home")}</span>
              </li>
              
              {useAuth.isAuthenticated && (
                <li
                  className={`flex flex-col items-center p-2 ${isActive(
                    "/myaccount/mytrips"
                  )}`}
                  onClick={() => handleNavClick("/myaccount/mytrips")}
                >
                  <MdOutlineDirectionsBusFilled className="text-lg" />
                  <span className="text-xs mt-1"> {t("mt")}</span>
                </li>
              )}
             
              <li
               className={`flex flex-col items-center p-2 ${isMyTripsPage ? "hidden" : ""}`}
                onClick={() =>!isMyTripsPage &&
                            handleNavClick("/myaccount/mytrips", true)
                          }
              >
                <FaRegCalendarAlt className="text-lg" />
                <span className="text-xs mt-1"> {t("reschedule")}</span>
              </li>
              <li
                className={`flex flex-col items-center p-2 ${isMyTripsPage ? "hidden" : ""}`}
                onClick={() => !isMyTripsPage &&
                            handleNavClick("/myaccount/mytrips", true)
                          }
              >
                <TbLocationCancel className="text-lg" />
                <span className="text-xs mt-1"> {t("cancel")}</span>
              </li>
             
                 <li
                className={`flex flex-col items-center  p-2 ${isActive(
                  "/contact"
                )}`}
                onClick={() => handleNavClick("/contact")}
              >
                <RiCustomerServiceLine className="text-lg z-[999999]" />
                <span className="text-xs mt-1"> {t("cu")}</span>
              </li>
            </ul>
          </nav>
        </footer>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
      
    </>
  );
};

export default Header;
