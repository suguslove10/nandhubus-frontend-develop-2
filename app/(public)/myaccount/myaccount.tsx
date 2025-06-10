"use client";
import { usePathname, useRouter } from "next/navigation";
import { Bus, Settings, User, Menu, X } from "lucide-react";
import { JSX, useState, useEffect } from "react";
import { selectAuth } from "@/app/Redux/authSlice";
import { useSelector } from "react-redux";
import { useProfile } from "@/app/hooks/profile/useProfile";

const SidebarItem = ({
  label,
  icon,
  path,
  closeSidebar,
}: {
  label: string;
  icon: JSX.Element;
  path: string;
  closeSidebar: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <button
      className={`flex items-center space-x-3 w-full p-3 rounded-lg text-sm md:text-base ${
        pathname === path ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
      }`}
      onClick={() => {
        router.push(path);
        closeSidebar();
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default function MyAccount({ children }: { children: React.ReactNode }) {
  const auth = useSelector(selectAuth);
  const { profileData } = useProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      {/* Mobile Header */}
      {isMobile && (
        <header className="bg-white shadow-sm p-4 flex items-center justify-between md:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center ">
              <User className="text-gray-500" size={20} />
            </div>
            <h2 className="font-semibold text-md">
              {profileData || auth
                ? `${auth.user?.user.firstName || profileData?.firstName || "Nandhubus"} ${
                    auth.user?.user.lastName || profileData?.lastName || "User"
                  }`
                : "Nandhubus User"}
            </h2>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Sidebar - Desktop and Mobile */}
      <aside
        className={`bg-white shadow-md ${
          isMobile
            ? `fixed top-0 left-0 w-64 h-full z-50 transform transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "w-64 p-5"
        }`}
      >
        {isMobile && (
          <div className="p-4 border-b flex justify-end">
            <button
              onClick={toggleMobileMenu}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
        )}

        <div className={`${isMobile ? "p-4" : "p-5"}`}>
          {/* User Info - Hidden on mobile since it's in the header */}
          {!isMobile && (
            <div className="flex items-center space-x-3 border-b pb-4">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="text-gray-500" />
              </div>
              <div>
                <h2 className="font-semibold text-md whitespace-nowrap">
                  {profileData || auth
                    ? `${auth.user?.user.firstName || profileData?.firstName || "Nandubus"} ${
                        auth.user?.user.lastName || profileData?.lastName || "User"
                      }`
                    : "Nandubus User"}
                </h2>
              </div>
            </div>
          )}

          {/* Sidebar Menu */}
          <nav className={`${isMobile ? "mt-2" : "mt-5"} space-y-2`}>
            <SidebarItem
              label="My Trips"
              icon={<Bus size={18} />}
              path="/myaccount/mytrips"
              closeSidebar={toggleMobileMenu}
            />
            <SidebarItem
              label="My Profile"
              icon={<Settings size={18} />}
              path="/myaccount/myprofile"
              closeSidebar={toggleMobileMenu}
            />
          </nav>
        </div>
      </aside>

      {/* Right Section (Changes Dynamically) */}
      <main className={`flex-1 p-4 md:p-6 ${isMobileMenuOpen ? "": ""}`}>
        {children}
      </main>
    </div>
  );
}
