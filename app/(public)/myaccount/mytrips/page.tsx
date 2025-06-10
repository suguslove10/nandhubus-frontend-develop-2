import Mytrips from "./mytrips";
import ProtectedRoute from "@/components/protectedroute/protectedRoute";

export const metadata = {
  title: "My Trips - View Your Bus Bookings | Nandhu Bus",
  description:
    "Access your bus travel history, upcoming trips, and ticket details on the My Trips page of Nandhu Bus. Manage your bookings easily in one place.",
  keywords: [
    "my trips Nandhu Bus",
    "bus booking history",
    "view bus tickets",
    "upcoming bus trips",
    "Nandhu Bus tickets",
    "manage bookings",
    "trip summary",
    "bus travel history",
    "Nandhu Bus reservations",
    "bus travel dashboard"
  ],
  openGraph: {
    title: "My Trips - View Your Bus Bookings | Nandhu Bus",
    description:
      "Easily access and manage all your Nandhu Bus bookings including past and upcoming trips.",
    url: "https://nandhubus.com/mytrips",
    siteName: "Nandhu Bus Booking",
    locale: "en_US",
    type: "website",
  }
};

export default function Page() {
  return (
    <ProtectedRoute>
      <Mytrips />
    </ProtectedRoute>
  );
}
