import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "@/components/vendor-sidebar/VendorSideBar";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Sidebar: full width on mobile, fixed width on md and up */}
      <div className="w-auto md:w-64">
        <Sidebar />
      </div>

      <main className="flex-1 bg-[#F6F7F9]">{children}</main>
    </div>
  );
}
