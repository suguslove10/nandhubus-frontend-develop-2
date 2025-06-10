import React from "react";
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

const trips = [
  {
    no: "T001",
    origin: "Bangalore",
    destination: "Mysore",
    startDate: "2025-04-01",
    endDate: "2025-04-03",
    vendorNumber: "V001",
    busNumber: "B001",
  },
  {
    no: "T002",
    origin: "Hubli",
    destination: "Belgaum",
    startDate: "2025-04-05",
    endDate: "2025-04-07",
    vendorNumber: "V002",
    busNumber: "B002",
  },
  {
    no: "T003",
    origin: "Shimoga",
    destination: "Mangalore",
    startDate: "2025-04-10",
    endDate: "2025-04-12",
    vendorNumber: "V003",
    busNumber: "B003",
  },
  {
    no: "T004",
    origin: "Bangalore",
    destination: "Mysore",
    startDate: "2025-04-15",
    endDate: "2025-04-17",
    vendorNumber: "V004",
    busNumber: "B004",
  },
  {
    no: "T005",
    origin: "Mysore",
    destination: "Shimoga",
    startDate: "2025-04-20",
    endDate: "2025-04-22",
    vendorNumber: "V005",
    busNumber: "B005",
  },
  {
    no: "T006",
    origin: "Belgaum",
    destination: "Hubli",
    startDate: "2025-04-25",
    endDate: "2025-04-27",
    vendorNumber: "V006",
    busNumber: "B006",
  },
  {
    no: "T007",
    origin: "Bangalore",
    destination: "Mysore",
    startDate: "2025-05-01",
    endDate: "2025-05-03",
    vendorNumber: "V007",
    busNumber: "B007",
  },
  {
    no: "T008",
    origin: "Mangalore",
    destination: "Shimoga",
    startDate: "2025-05-05",
    endDate: "2025-05-07",
    vendorNumber: "V008",
    busNumber: "B008",
  },
];

function BookingTable() {
  return (
    <div>
      <Table className="w-full bg-white p-4">
        <TableCaption>A list of your recent trips.</TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-white">
            <TableHead className="w-[100px] p-4">No</TableHead>
            <TableHead className="p-4">Origin</TableHead>
            <TableHead className="p-4">Destination</TableHead>
            <TableHead className="p-4">Start Date</TableHead>
            <TableHead className="p-4">End Date</TableHead>
            <TableHead className="p-4">Vendor</TableHead>
            <TableHead className="p-4">Bus Number</TableHead>
            <TableHead className="p-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trips.map((trip) => (
            <TableRow key={trip.no}>
              <TableCell className="font-medium p-4">{trip.no}</TableCell>
              <TableCell className="p-4">{trip.origin}</TableCell>
              <TableCell className="p-4">{trip.destination}</TableCell>
              <TableCell className="p-4">{trip.startDate}</TableCell>
              <TableCell className="p-4">{trip.endDate}</TableCell>
              <TableCell className="p-4">{trip.vendorNumber}</TableCell>
              <TableCell className="p-4">{trip.busNumber}</TableCell>
              <TableCell className="p-4">
                <button className="text-blue-500">View Details</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>Total Trips: {trips.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

export default BookingTable;
