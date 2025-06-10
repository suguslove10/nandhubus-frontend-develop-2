// "use client";

// import { useState } from "react";
// import {
//   Bus,
//   Wrench,
//   XCircle,
//   Plus,
//   Pencil,
//   Trash2,
//   Upload,
//   User,
//   Hash,
//   Users,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";

// interface BusCard {
//   id: string;
//   image: string;
//   status: "Active" | "Maintenance" | "Out of Service";
//   driverName: string;
//   capacity: number;
//   model?: string;
//   registrationNumber?: string;
//   lastMaintenance?: string;
//   nextMaintenance?: string;
//   notes?: string;
// }

// const buses: BusCard[] = [
//   {
//     id: "B001",
//     image:
//       "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800",
//     status: "Active",
//     driverName: "John Smith",
//     capacity: 45,
//     model: "Volvo 9400",
//     registrationNumber: "KA01AB1234",
//     lastMaintenance: "2024-03-01",
//     nextMaintenance: "2024-04-01",
//     notes: "Regular maintenance completed",
//   },
//   {
//     id: "B002",
//     image:
//       "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
//     status: "Maintenance",
//     driverName: "Mike Johnson",
//     capacity: 50,
//     model: "Mercedes-Benz Tourismo",
//     registrationNumber: "KA02CD5678",
//     lastMaintenance: "2024-02-15",
//     nextMaintenance: "2024-03-15",
//     notes: "Under routine maintenance",
//   },
//   {
//     id: "B003",
//     image:
//       "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&q=80&w=800",
//     status: "Active",
//     driverName: "Sarah Wilson",
//     capacity: 40,
//     model: "Scania Touring",
//     registrationNumber: "KA03EF9012",
//     lastMaintenance: "2024-02-28",
//     nextMaintenance: "2024-03-28",
//     notes: "New tires installed",
//   },
//   {
//     id: "B004",
//     image:
//       "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&q=80&w=800",
//     status: "Out of Service",
//     driverName: "David Brown",
//     capacity: 45,
//     model: "Volvo 9400",
//     registrationNumber: "KA04GH3456",
//     lastMaintenance: "2024-01-30",
//     nextMaintenance: "2024-02-28",
//     notes: "Engine maintenance required",
//   },
// ];

// interface AddBusFormProps {
//   initialData?: BusCard;
//   onClose: () => void;
// }

// const AddBusForm = ({ initialData, onClose }: AddBusFormProps) => {
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   return (
//     <div className="w-full mx-auto grid gap-8 p-6 bg-white rounded-lg shadow-lg">
//       <div>
//         <h3 className="text-xl font-semibold mb-2">Bus Information</h3>
//         <p className="text-sm text-gray-500 mb-8">
//           Enter the basic information about the bus
//         </p>

//         {/* Bus Image Upload */}
//         {/* Bus Image Upload */}
//         <div className="mb-6">
//           <Label className="text-sm font-medium mb-2 block">Bus Image</Label>
//           <div
//             className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
//             onClick={() => document.getElementById("busImage")?.click()}
//           >
//             {imagePreview ? (
//               <div>
//                 <img
//                   src={imagePreview}
//                   alt="Bus Preview"
//                   className="h-32 w-32 object-cover mx-auto mb-2 rounded-lg"
//                 />
//                 <Button
//                   style={{
//                     color: "black",
//                     border: "1px solid black",
//                     backgroundColor: "white",
//                   }}
//                   className="text-xs underline cursor-pointer"
//                   onClick={() => setImagePreview(null)}
//                 >
//                   Remove
//                 </Button>
//               </div>
//             ) : (
//               <>
//                 <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
//                 <div className="text-sm text-gray-600">
//                   Click to upload a bus image
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">
//                   JPG, PNG, WEBP, GIF up to 2MB
//                 </div>
//               </>
//             )}
//           </div>
//           <input
//             type="file"
//             id="busImage"
//             accept="image/png, image/jpg, image/jpeg, image/webp, image/gif"
//             className="hidden"
//             onChange={(event) => {
//               const file = event.target.files?.[0];
//               if (file) {
//                 if (file.size > 2 * 1024 * 1024) {
//                   alert(
//                     "File size exceeds 2MB. Please upload a smaller image."
//                   );
//                   return;
//                 }
//                 const reader = new FileReader();
//                 reader.onloadend = () => {
//                   if (typeof reader.result === "string") {
//                     setImagePreview(reader.result);
//                   }
//                 };
//                 reader.readAsDataURL(file);
//               }
//             }}
//           />
//         </div>

//         {/* Bus Number & Registration Number */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <Label
//               htmlFor="busNumber"
//               className="text-sm font-medium mb-2 block"
//             >
//               Bus Number *
//             </Label>
//             <Input
//               id="busNumber"
//               placeholder="B001"
//               className="w-full p-2 border rounded-lg"
//               defaultValue={initialData?.id}
//             />
//           </div>
//           <div>
//             <Label
//               htmlFor="registration"
//               className="text-sm font-medium mb-2 block"
//             >
//               Registration Number *
//             </Label>
//             <Input
//               id="registration"
//               placeholder="KA01AB1234"
//               className="w-full p-2 border rounded-lg"
//               defaultValue={initialData?.registrationNumber}
//             />
//           </div>
//         </div>

//         {/* Model & Capacity */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <Label htmlFor="model" className="text-sm font-medium mb-2 block">
//               Model *
//             </Label>
//             <Input
//               id="model"
//               placeholder="Volvo 9400"
//               className="w-full p-2 border rounded-lg"
//               defaultValue={initialData?.model}
//             />
//           </div>
//           <div>
//             <Label
//               htmlFor="capacity"
//               className="text-sm font-medium mb-2 block"
//             >
//               Capacity *
//             </Label>
//             <Input
//               id="capacity"
//               type="number"
//               placeholder="45"
//               className="w-full p-2 border rounded-lg"
//               defaultValue={initialData?.capacity}
//             />
//           </div>
//         </div>

//         {/* Driver Name & Status */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <Label
//               htmlFor="driverName"
//               className="text-sm font-medium mb-2 block"
//             >
//               Driver Name
//             </Label>
//             <Input
//               id="driverName"
//               placeholder="John Doe"
//               className="w-full p-2 border rounded-lg"
//               defaultValue={initialData?.driverName}
//             />
//           </div>
//           <div>
//             <Label htmlFor="status" className="text-sm font-medium mb-2 block">
//               Status
//             </Label>
//             <div className="w-full border rounded-lg p-2">
//               <Select defaultValue={initialData?.status?.toLowerCase()}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="maintenance">Maintenance</SelectItem>
//                   <SelectItem value="outOfService">Out of Service</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>

//         {/* Maintenance Dates */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <Label
//               htmlFor="lastMaintenance"
//               className="text-sm font-medium mb-2 block"
//             >
//               Last Maintenance Date
//             </Label>
//             <Input
//               id="lastMaintenance"
//               type="date"
//               className="w-full p-2 border rounded-lg"
//               defaultValue={initialData?.lastMaintenance}
//             />
//           </div>
//           <div>
//             <Label
//               htmlFor="nextMaintenance"
//               className="text-sm font-medium mb-2 block"
//             >
//               Next Maintenance Date
//             </Label>
//             <Input
//               id="nextMaintenance"
//               type="date"
//               className="w-full p-2 border rounded-lg"
//               defaultValue={initialData?.nextMaintenance}
//             />
//           </div>
//         </div>

//         {/* Notes Section */}
//         <div className="mb-6">
//           <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
//             Notes
//           </Label>
//           <Textarea
//             id="notes"
//             placeholder="Add any additional notes about this bus..."
//             className="w-full p-2 border rounded-lg h-24"
//             defaultValue={initialData?.notes}
//           />
//         </div>

//         {/* a Buttons */}
//         <div className="flex justify-end gap-4 mt-8">
//           <Button
//             variant="outline"
//             onClick={onClose}
//             className="px-6 py-2 border rounded-lg"
//           >
//             Cancel
//           </Button>
//           <Button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
//             Save Bus
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function Vendor() {
//   const [totalBuses] = useState(6);
//   const [activeBuses] = useState(3);
//   const [maintenanceBuses] = useState(1);
//   const [outOfServiceBuses] = useState(2);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [selectedBus, setSelectedBus] = useState<BusCard | undefined>(
//     undefined
//   );

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Active":
//         return "bg-green-100 text-green-800";
//       case "Maintenance":
//         return "bg-yellow-100 text-yellow-800";
//       case "Out of Service":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "Active":
//         return <Bus className="h-5 w-5 text-green-600" />;
//       case "Maintenance":
//         return <Wrench className="h-5 w-5 text-yellow-600" />;
//       case "Out of Service":
//         return <XCircle className="h-5 w-5 text-red-600" />;
//       default:
//         return null;
//     }
//   };

//   const handleDelete = (id: string) => {
//     // Implement delete functionality
//     console.log("Delete bus:", id);
//   };

//   const handleEdit = (id: string) => {
//     const busToEdit = buses.find((bus) => bus.id === id);
//     setSelectedBus(busToEdit);
//     setIsDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setIsDialogOpen(false);
//     setSelectedBus(undefined);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       {/* <header className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Bus className="h-6 w-6 text-blue-600" />
//             <h1 className="text-xl font-semibold">BusVendorHub</h1>
//           </div>
//           <nav className="hidden md:flex items-center gap-8">
//             <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-4 -mb-4">Dashboard</a>
//             <a href="#" className="text-gray-600 hover:text-gray-900">Bus Management</a>
//             <a href="#" className="text-gray-600 hover:text-gray-900">Add Bus</a>
//           </nav>
//         </div>
//       </header> */}

//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
//             <p className="text-gray-600">
//               Welcome to your bus fleet management dashboard
//             </p>
//           </div>
//           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="flex items-center bg-[#0f7bab] hover:bg-[#0f7bab] gap-2 w-full md:w-auto">
//                 <Plus className="h-4 w-4" />
//                 Add New Bus
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="!max-w-[900px] w-full max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle>
//                   {selectedBus ? "Edit Bus" : "Add New Bus"}
//                 </DialogTitle>
//               </DialogHeader>
//               <AddBusForm
//                 initialData={selectedBus}
//                 onClose={handleCloseDialog}
//               />
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="bg-blue-100 p-3 rounded-full">
//                 <Bus className="h-6 w-6 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Total Buses</p>
//                 <h3 className="text-2xl font-bold">{totalBuses}</h3>
//               </div>
//             </div>
//           </Card>

//           <Card className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="bg-green-100 p-3 rounded-full">
//                 <Bus className="h-6 w-6 text-green-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Active Buses</p>
//                 <h3 className="text-2xl font-bold">{activeBuses}</h3>
//               </div>
//             </div>
//           </Card>

//           <Card className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="bg-yellow-100 p-3 rounded-full">
//                 <Wrench className="h-6 w-6 text-yellow-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">In Maintenance</p>
//                 <h3 className="text-2xl font-bold">{maintenanceBuses}</h3>
//               </div>
//             </div>
//           </Card>

//           <Card className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="bg-red-100 p-3 rounded-full">
//                 <XCircle className="h-6 w-6 text-red-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Out of Service</p>
//                 <h3 className="text-2xl font-bold">{outOfServiceBuses}</h3>
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* Recent Buses */}
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-semibold">Recent Buses</h3>
//           <Button variant="link" className="text-blue-600">
//             View All
//           </Button>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {buses.map((bus) => (
//             <Card key={bus.id} className="overflow-hidden">
//               <div className="relative h-48">
//                 <img
//                   src={bus.image}
//                   alt={`Bus ${bus.id}`}
//                   className="w-full h-full object-cover"
//                 />
//                 <Badge
//                   className={`absolute top-4 right-4 ${getStatusColor(
//                     bus.status
//                   )} flex items-center gap-1`}
//                 >
//                   {getStatusIcon(bus.status)}
//                   {bus.status}
//                 </Badge>
//               </div>
//               <div className="p-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <h4 className="text-lg font-semibold">{bus.id}</h4>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="text-blue-600"
//                       onClick={() => handleEdit(bus.id)}
//                     >
//                       <Pencil className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="text-red-600"
//                       onClick={() => handleDelete(bus.id)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//                 <div className="space-y-2 text-sm text-gray-600">
//                   <div className="flex items-center gap-2">
//                     <User className="h-4 w-4" />
//                     <span>{bus.driverName}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Hash className="h-4 w-4" />
//                     <span>{bus.id}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Users className="h-4 w-4" />
//                     <span>Capacity: {bus.capacity}</span>
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }
