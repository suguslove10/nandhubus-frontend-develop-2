"use client";

import { usePathname } from "next/navigation";
import { House, Rows2, Plus, BusFront, Edit, Menu, X, Activity } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkStyle = (href: string) =>
    `flex items-center gap-3 text-sm hover:bg-gray-100 p-2 rounded-lg transition ${
      pathname === href
        ? "text-[#0F7BAB] bg-gray-100 font-medium"
        : "text-gray-700"
    }`;

  return (
    <>
      {/* Mobile header - only shows on mobile */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-30 p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Admin Menu</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-screen w-64 fixed top-0 left-0 bg-white text-gray-800 shadow-md p-4 flex-col">
        {/* Added Dashboard Link */}
        <div className="mt-[90px] mb-6">
          <Link
            href="/admin/dashboard"
            className={linkStyle("/admin/dashboard")}
          >
            <House className="h-5 w-5" />
            <span className="font-medium">Admin Dashboard</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-6">
          {/* Vendor Section */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase px-2">
              Vendor
            </h2>
            <div className="flex flex-col gap-1">
              <Link
                href="/admin/vendor"
                className={linkStyle("/admin/vendor/view")}
              >
                <Rows2 className="h-5 w-5" />
                <span>Vendors List</span>
              </Link>
            </div>
          </div>

          {/* Vehicle Section */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase px-2">
              Vehicle
            </h2>
            <div className="flex flex-col gap-1">
              <Link
                href="/admin/vehicle/add"
                className={linkStyle("/admin/vehicle/add")}
              >
                <Plus className="h-5 w-5" />
                <span>Add Vehicle</span>
              </Link>
              <Link
                href="/admin/vehicle/view"
                className={linkStyle("/admin/vehicle/view")}
              >
                <BusFront className="h-5 w-5" />
                <span>Vehicle List</span>
              </Link>
              <Link
                href="/admin/vehicle/updateAvailability"
                className={linkStyle("/admin/vehicle/updateAvailability")}
              >
                <Edit className="h-5 w-5" />
                <span>Update Availability</span>
              </Link>
              <Link
                href="/admin/vehicle/updateStatus"
                className={linkStyle("/admin/vehicle/updateStatus")}
              >
                <Activity className="h-5 w-5" />
                <span>Update Vehicle Status</span>
              </Link>
            </div>
          </div>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-20 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="w-64 h-full bg-white shadow-lg pt-20 p-4 overflow-y-auto">
          {/* Added Dashboard Link */}
          <div className="mb-6">
            <Link
              href="/admin/dashboard"
              className={linkStyle("/admin/dashboard")}
              onClick={() => setMobileMenuOpen(false)}
            >
              <House className="h-5 w-5" />
              <span className="font-medium">Admin Dashboard</span>
            </Link>
          </div>

          <nav className="flex flex-col gap-6">
            {/* Vendor Section */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase px-2">
                Vendor
              </h2>
              <div className="flex flex-col gap-1">
                <Link
                  href="/admin/vendor"
                  className={linkStyle("/admin/vendor/view")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Rows2 className="h-5 w-5" />
                  <span>Vendors List</span>
                </Link>
              </div>
            </div>

            {/* Vehicle Section */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase px-2">
                Vehicle
              </h2>
              <div className="flex flex-col gap-1">
                <Link
                  href="/admin/vehicle/add"
                  className={linkStyle("/admin/vehicle/add")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Vehicle</span>
                </Link>
                <Link
                  href="/admin/vehicle/view"
                  className={linkStyle("/admin/vehicle/view")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BusFront className="h-5 w-5" />
                  <span>Vehicle List</span>
                </Link>
                <Link
                  href="/admin/vehicle/updateAvailability"
                  className={linkStyle("/admin/vehicle/updateAvailability")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Edit className="h-5 w-5" />
                  <span>Update Availability</span>
                </Link>
                <Link
                  href="/admin/vehicle/updateStatus"
                  className={linkStyle("/admin/vehicle/updateStatus")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Activity className="h-5 w-5" />
                  <span>Update Vehicle Status</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay - only shows when mobile menu is open */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}