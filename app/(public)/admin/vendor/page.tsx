"use client";
import VendorTable from "@/components/table/VendorTable";
import React from "react";
import VendorForm from "@/components/sheet/AddVendorSheet";
import { useQuery } from "@tanstack/react-query";
import { fetchAllVender } from "@/app/services/admin.service";

function Page() {
  const {
    data: vendors = [],
    isLoading: vendorLoading,
    isError: vendorError,
    refetch: venderDataRefetch,
  } = useQuery({
    queryKey: ["vendors"],
    queryFn: fetchAllVender,
  });
  return (
    <div className="w-full min-h-screen p-0 lg:p-8">
    <div className="w-full">
      <div className="flex items-center justify-end">
        <VendorForm venderDataRefetch={venderDataRefetch} />
      </div>
  
      <div className="overflow-x-scroll">
        <div className="w-full lg:w-[85%] mx-auto"> {/* Adjust width and center */}
          <VendorTable
            vendors={vendors}
            isLoading={vendorLoading}
            isError={vendorError}
            venderDataRefetch={venderDataRefetch}
          />
        </div>
      </div>
    </div>
  </div>
  
  );
}

export default Page;
