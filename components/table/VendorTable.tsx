import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChevronLeft, ChevronRight, Pencil, Search, Trash, X } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import {
  deleteVendor,
  updateVenderDeatils,
} from "@/app/services/admin.service";

const vendorSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  vendorCompanyName: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
  totalVehicles: z.number(),
  policyRequests: z.array(
    z.object({
      
      policyDescription: z.string().min(1, "Policy Description is required"),
      policyMessages: z.array(z.string().min(1, "Policy message is required"))
        .min(1, "At least one policy message is required"),
    })
  ).min(1, "At least one policy request is required"),

});

interface Vendor {
  vendorId: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  vendorCompanyName: string;
  address: string;
  totalVehicles: number;
  availableVehicles?: number;
  gstNumber?: string;
  policyDtoList:{
    policyId:string;
    policyDescription:string;
    policyData:{
      id:string;
      policyMessage:string;
    }[]
  }[]
}


interface VendorTableProps {
  vendors: Vendor[];
  isLoading: boolean;
  isError: boolean;
  venderDataRefetch: () => void;
}
interface VendorFormData {
  vendorId:string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  vendorCompanyName: string;
  address: string;
  totalVehicles: number;
  availableVehicles:number;
  gstNumber:string; 
  policyRequests: {
    policyId:string;
    policyDescription: string;
    policyMessages: string[];
  }[];
}

const VendorTable = ({
  isError,
  isLoading,
  vendors,
  venderDataRefetch,
}: VendorTableProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); 
  const [initialVendorValues, setInitialVendorValues] = useState<any>({});

  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(vendorSchema),
  });

  
  const reversedVendors = useMemo(() => vendors.slice().reverse(), [vendors]);

  
  const columns = useMemo<ColumnDef<(typeof reversedVendors)[0]>[]>(
    () => [
      {
        accessorKey: "vendorId",
        header: "Vendor ID",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "vendorCompanyName",
        header: "Company Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "contactNumber",
        header: "Contact",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "vendorVehicles",
        header: "Vendor Vehicles",
        cell: ({ row }) => (
          <Link
            href={`/admin/vendor/${row.original.vendorId}`}
            className="text-blue-500 hover:text-blue-700 transition-all"
          >
            View Vehicles
          </Link>
        ),
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
          <div className="flex gap-4 justify-center items-center">
            <Pencil
              className="w-5 h-5 cursor-pointer text-blue-500 hover:text-blue-700 transition-all"
              onClick={() => {
                setEditingVendor(row.original);
                setIsOpen(true);
              }}
            />
            <Trash
              onClick={() => handleDeleteClick(row.original.vendorId)}
              className="w-5 h-5 cursor-pointer text-red-500 hover:text-red-700 transition-all"
            />
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: reversedVendors,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });
  interface VendorFormData {
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    vendorCompanyName: string;
    address: string;
    totalVehicles: number;
    policyRequests: PolicyRequest[];
  }
  
  interface PolicyRequest {
   
    policyDescription: string;
    policyMessages: string[];
  }
  
  
  
  const onSubmit: SubmitHandler<Omit<VendorFormData, "vendorId">> = async (data) => {
    if (!editingVendor) return;
    try {
      const updatedVendor = {
        ...data,
        vendorId: editingVendor?.vendorId,
        totalVehicles: Number(data.totalVehicles),
        availableVehicles: editingVendor?.availableVehicles ?? 0,
        gstNumber: editingVendor?.gstNumber ?? "",
        policyRequests: editingVendor?.policyDtoList?.map((policy) => ({
          policyId: policy.policyId, 
          policyDescription: policy.policyDescription, 
          policyMessages: policy.policyData.map((policyMessage) => policyMessage.policyMessage), 
        })) ?? [], 
      };
      const res = await updateVenderDeatils(updatedVendor);
      if (res) {
        toast.success("Updated successfully!");
        venderDataRefetch();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  
    setIsOpen(false);
  };
  

  
  const handleDeleteVendor = async () => {
    if (!vendorToDelete) return;
    try {
      const res = await deleteVendor(vendorToDelete);
      if (res) {
        toast.success("Vendor deleted successfully!");
        venderDataRefetch();
        setShowDeleteDialog(false); 
      }
    } catch (error) {
      toast.error("Failed to delete vendor");
      setShowDeleteDialog(false); 
    }
  };

  
  const handleDeleteClick = (vendorId: string) => {
    setVendorToDelete(vendorId);
    setShowDeleteDialog(true); 
  };
  const [currentCard, setCurrentCard] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const scrollToCard = (index: number) => {
    if (!containerRef.current) return;
    
    const cardWidth = containerRef.current.children[0]?.children[index]?.clientWidth;
    if (cardWidth) {
      containerRef.current.scrollTo({
        left: index * (cardWidth + 16), 
        behavior: 'smooth'
      });
      setCurrentCard(index);
    }
  };

  const handleNext = () => {
    const nextCard = currentCard + 1;
    if (nextCard < table.getRowModel().rows.length) {
      scrollToCard(nextCard);
    }
  };
  
  const handlePrev = () => {
    const prevCard = currentCard - 1;
    if (prevCard >= 0) {
      scrollToCard(prevCard);
    }
  };

  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  
    const handleScroll = () => {
      const scrollPosition = container.scrollLeft;
      const cardWidth = container.children[0]?.children[0]?.clientWidth;
      
      if (cardWidth) {
        const newIndex = Math.round(scrollPosition / (cardWidth + 16)); 
        setCurrentCard(newIndex);
      }
    };
  
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (editingVendor) {
      setInitialVendorValues(editingVendor);
      reset({
        firstName: editingVendor.firstName,
        lastName: editingVendor.lastName,
        email: editingVendor.email,
        contactNumber: editingVendor.contactNumber,
        vendorCompanyName: editingVendor.vendorCompanyName,
        address: editingVendor.address,
        totalVehicles: editingVendor.totalVehicles,
         
      });
    }
  }, [editingVendor, reset]);

  const isUpdateDisabled = !isDirty;

  if (isLoading) return <p className="text-center">Loading vendors...</p>;
  if (isError)
    return <p className="text-center text-red-500">Failed to fetch vendors</p>;

  return (
<div className="mt-6 py-6 px-4 sm:px-6 md:px-8 bg-white shadow-md rounded-lg border border-gray-200">
      {}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Vendor List</h2>
        <div className="relative w-full md:w-80 lg:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search vendors..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        {}
        <div className="hidden sm:block overflow-x-auto">
          <Table className="min-w-full bg-white">
            <TableCaption className="sr-only sm:not-sr-only text-gray-500 py-2">
              A list of your vendor details.
            </TableCaption>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-50 border-b border-gray-200">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, i) => (
                  <TableRow 
                    key={row.id} 
                    className={`border-b hover:bg-gray-50 transition-colors duration-150 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 px-4 text-sm text-gray-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p>No vendors found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {}
        <div className="sm:hidden relative bg-gray-50 p-1">
          {}
          {table.getRowModel().rows.length > 1 && (
            <div className="flex justify-between items-center px-2 py-2">
              <button 
                onClick={handlePrev}
                disabled={currentCard === 0}
                className={`p-2 rounded-full ${currentCard === 0 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-sm text-gray-600">
                {currentCard + 1} / {table.getRowModel().rows.length}
              </span>
              
              <button 
                onClick={handleNext}
                disabled={currentCard === table.getRowModel().rows.length - 1}
                className={`p-2 rounded-full ${currentCard === table.getRowModel().rows.length - 1 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {}
          <div 
            ref={containerRef}
            className="overflow-x-auto hide-scrollbar snap-x snap-mandatory"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            <div className="flex space-x-4 px-4 pb-6 w-[80vw]">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <div 
                    key={row.id}
                    className="flex-shrink-0 snap-start bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md w-[89vw]"
                  >
                    <div className="p-4 space-y-3">
                      {row.getVisibleCells().map((cell) => (
                        <div key={cell.id} className="grid grid-cols-3 gap-2">
                          <span className="col-span-1 text-xs font-medium text-gray-500 truncate">
                            {cell.column.columnDef.header?.toString()}:
                          </span>
                          <span className="col-span-2 text-sm text-gray-800 text-right truncate">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-[calc(100vw-2rem)] p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
                  No vendors found.
                </div>
              )}
            </div>
          </div>

          {}
          {table.getRowModel().rows.length > 1 && (
            <div className="flex justify-center space-x-2 pb-2">
              {table.getRowModel().rows.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToCard(index)}
                  className={`h-2 rounded-full transition-all ${currentCard === index ? 'bg-blue-600 w-4' : 'bg-gray-300 w-2'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          
          <div className="px-3 py-1.5 text-gray-700 text-sm whitespace-nowrap rounded-md border border-gray-200 bg-gray-50">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          Showing {table.getRowModel().rows.length} of {reversedVendors.length} vendors
        </div>
      </div>

  {}
  <AnimatePresence>
    {showDeleteDialog && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "linear" }}
        className="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4"
        >
          <h3 className="text-lg font-semibold text-gray-700">
            Are you sure you want to delete this vendor?
          </h3>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              onClick={() => setShowDeleteDialog(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteVendor}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Yes, Delete
            </Button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

  <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <Button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 text-sm sm:text-base flex-1 sm:flex-none"
      >
        Previous
      </Button>
      
      <span className="text-gray-700 text-sm sm:text-base whitespace-nowrap">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </span>
      
      <Button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 text-sm sm:text-base flex-1 sm:flex-none"
      >
        Next
      </Button>
    </div>
  </div>

  {}
 {}
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.2, ease: "linear" }}
      className="fixed inset-0 bg-[#FAFAFA] p-4 sm:p-6 rounded-t-lg shadow-xl z-50"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "linear" }}
        className="w-full h-full relative overflow-y-auto"
      >
        <div className="h-[60px] sm:h-[70px] bg-white border-b-[1px] border-b-gray-200 fixed top-0 left-0 w-full">
          <div className="h-[60px] sm:h-[70px] max-w-[1200px] w-full mx-auto flex items-center justify-between px-4">
            <h1 className="text-base sm:text-lg font-bold text-gray-500">
              Update Vendor Details
            </h1>
            <button
              className="cursor-pointer bg-transparent flex items-center text-gray-500"
              onClick={() => setIsOpen(false)}
            >
              <span className="hidden sm:inline mr-1">close</span>
              <X height={18} width={18} />
            </button>
          </div>
        </div>

        {editingVendor && (
         <div className="w-full pt-[60px] sm:pt-[70px]">
         <div className="max-w-[600px] mx-auto px-4 sm:px-6">
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
  {}
  <div className="space-y-2">
    <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
      Personal Information
    </h3>
    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
      <div className="space-y-1">
        <label className="block text-xs sm:text-sm font-medium text-gray-700">
          First Name
        </label>
        <Input
          {...register("firstName")}
          defaultValue={editingVendor.firstName}
          className="border-0 border-b border-gray-300 p-1 rounded-none focus:ring-0 focus:border-blue-500 w-full text-sm sm:text-base"
          onKeyDown={(e) => {
            if (!/^[a-zA-Z\s]*$/.test(e.key) && e.key !== "Backspace") {
              e.preventDefault();
            }
          }}
        />
        {errors.firstName && (
          <p className="text-red-500 text-xs mt-1">
            {errors.firstName?.message}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <label className="block text-xs sm:text-sm font-medium text-gray-700">
          Last Name
        </label>
        <Input
          {...register("lastName")}
          defaultValue={editingVendor.lastName}
          className="border-0 border-b border-gray-300 p-1 rounded-none focus:ring-0 focus:border-blue-500 w-full text-sm sm:text-base"
          onKeyDown={(e) => {
            if (!/^[a-zA-Z\s]*$/.test(e.key) && e.key !== "Backspace") {
              e.preventDefault();
            }
          }}
        />
        {errors.lastName && (
          <p className="text-red-500 text-xs mt-1">
            {errors.lastName?.message}
          </p>
        )}
      </div>
    </div>
  </div>

  {}
  <div className="space-y-2">
    <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
      Contact Information
    </h3>
    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
      <div className="space-y-1">
        <label className="block text-xs sm:text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          {...register("email")}
          defaultValue={editingVendor.email}
          className="border-0 border-b border-gray-300 p-1 rounded-none focus:ring-0 focus:border-blue-500 w-full text-sm sm:text-base"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">
            {errors.email?.message}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <label className="block text-xs sm:text-sm font-medium text-gray-700">
          Contact Number
        </label>
        <Input
          minLength={10}
          maxLength={10}
          onInput={(e) => {
            e.currentTarget.value =
              e.currentTarget.value.replace(/[^0-9]/g, "");
          }}
          type="text"
          {...register("contactNumber")}
          defaultValue={editingVendor.contactNumber}
          className="border-0 border-b border-gray-300 p-1 rounded-none focus:ring-0 focus:border-blue-500 w-full text-sm sm:text-base"
          onKeyDown={(e) => {
            if (!/^[0-9]*$/.test(e.key) && e.key !== "Backspace") {
              e.preventDefault();
            }
          }}
        />
        {errors.contactNumber && (
          <p className="text-red-500 text-xs mt-1">
            {errors.contactNumber?.message}
          </p>
        )}
      </div>
    </div>
  </div>

  {}
  <div className="space-y-2">
    <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
      Company Information
    </h3>
    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
      <div className="space-y-1">
        <label className="block text-xs sm:text-sm font-medium text-gray-700">
          Company Name
        </label>
        <Input
          {...register("vendorCompanyName")}
          defaultValue={editingVendor.vendorCompanyName}
          className="border-0 border-b border-gray-300 p-1 rounded-none focus:ring-0 focus:border-blue-500 w-full text-sm sm:text-base"
        />
        {errors.vendorCompanyName && (
          <p className="text-red-500 text-xs mt-1">
            {errors.vendorCompanyName?.message}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <label className="block text-xs sm:text-sm font-medium text-gray-700">
          Total Vehicles
        </label>
        <Input
          type="number"
          {...register("totalVehicles", {
            valueAsNumber: true,
          })}
          defaultValue={editingVendor.totalVehicles}
          className="border-0 border-b border-gray-300 p-1 rounded-none focus:ring-0 focus:border-blue-500 w-full text-sm sm:text-base"
          onKeyDown={(e) => {
            if (!/^[0-9]*$/.test(e.key) && e.key !== "Backspace") {
              e.preventDefault();
            }
          }}
        />
        {errors.totalVehicles && (
          <p className="text-red-500 text-xs mt-1">
            {errors.totalVehicles?.message}
          </p>
        )}
      </div>
    </div>
    <div className="space-y-1 mt-4 sm:mt-0">
      <label className="block text-xs sm:text-sm font-medium text-gray-700">
        Address
      </label>
      <Input
        {...register("address")}
        defaultValue={editingVendor.address}
        className="border-0 border-b border-gray-300 p-1 rounded-none focus:ring-0 focus:border-blue-500 w-full text-sm sm:text-base"
      />
      {errors.address && (
        <p className="text-red-500 text-xs mt-1">
          {errors.address?.message}
        </p>
      )}
    </div>
  </div>

  {}
  <div className="space-y-3 sm:space-y-4">
    <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
      Policy Details
    </h3>
    {editingVendor.policyDtoList?.map((policy, index) => (
      <div key={index} className="space-y-3 bg-gray-50 p-3 sm:p-4 rounded-lg">
        <div className="space-y-1">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">
            Policy Description
          </label>
          <Input
            {...register(`policyRequests.${index}.policyDescription`)}
            defaultValue={policy.policyDescription}
            className="border-0 border-b border-gray-300 p-1 rounded-none focus:ring-0 focus:border-blue-500 w-full text-sm sm:text-base"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">
            Policy Messages
          </label>
          {policy.policyData.map((message, messageIndex) => (
            <div key={messageIndex} className="flex space-x-2 items-center">
              <Input
                {...register(`policyRequests.${index}.policyMessages.${messageIndex}`)}
                defaultValue={message.policyMessage}
                className="border-0 border-b border-gray-300 p-1 rounded-none focus:ring-0 focus:border-blue-500 w-full text-sm sm:text-base"
              />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>

  <div className="flex justify-end pt-4">
    <Button
      type="submit"
      disabled={isUpdateDisabled}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-md shadow-sm disabled:bg-gray-300 transition-colors duration-200 text-sm sm:text-base"
    >
      Update Vendor
    </Button>
  </div>
</form>
         </div>
       </div>
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
</div>
  );
};

export default VendorTable;
