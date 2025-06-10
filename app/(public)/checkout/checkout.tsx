"use client";
import { useLogin } from "@/app/hooks/login/useLogin";
import { selectAuth } from "@/app/Redux/authSlice";
import { setBookingDetails } from "@/app/Redux/bookingSlice";
import { AppDispatch, RootState } from "@/app/Redux/store";
import { useAddBooking } from "@/app/services/data.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaAnglesRight } from "react-icons/fa6";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";

const BookingForm = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const addBooking = useAddBooking();

  const searchParams = useSearchParams();

  const totalAmount = searchParams.get("totalAmount");

  const vehicleNumber = searchParams.get("vehicleNumber");

  const { source, destination, fromDate, toDate } = useSelector(
    (state: RootState) => state.search
  );

  const authData = useSelector(selectAuth);

  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const [passengerInfo, setPassengerInfo] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPassengerInfo((prev) => ({ ...prev, [id]: value }));
  };

  const vehicleNumbersArray = vehicleNumber ? vehicleNumber.split(",") : [];

  const vehicleRequest = vehicleNumbersArray.map((vehicleNumber) => ({
    vehicleNumbers: vehicleNumber,
    totalAmount: totalAmount
      ? parseFloat(totalAmount) / vehicleNumbersArray.length
      : 0.0,
  }));

  const handleProceedToPay = () => {
    const mobileNumber = authData.isAuthenticated
      ? authData.user?.user.mobile
      : passengerInfo.mobile;
    const requestBody = {
      vehicleRequest,
      fromDate,
      toDate,
      source,
      destination,
      user: {
        firstName: passengerInfo.firstName,
        lastName: passengerInfo.lastName,
        mobile: mobileNumber,
        email: passengerInfo.email,
      },
      slotsPojo: null,
    };

    addBooking.mutate(requestBody, {
      onSuccess: (data) => {
        const response = data as {
          bookingId: string;
          message: string;
          statusCode: number;
        };
        const totalAmount = requestBody.vehicleRequest.reduce(
          (sum, vehicle) => sum + vehicle.totalAmount,
          0
        );

        // toast.success("Booking confirmed!");

        dispatch(
          setBookingDetails({
            bookingId: response.bookingId,
            mobile: passengerInfo.mobile || authData.user?.user.mobile || "",
            totalAmount: totalAmount,
          })
        );

        router.push("/payments");
      },
      onError: (error: unknown) => {
        toast.error("Booking failed. Please try again.");
      },
    });
  };

  return (
    <div className="max-w-[700px] mx-auto p-8 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Complete Your Booking
      </h1>
      <form>
        <div className="space-y-6">
          {/* First Name and Last Name in One Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                value={passengerInfo.firstName}
                onChange={handleInputChange}
                type="text"
                className="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0 outline-none"
                placeholder="Enter your First name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={passengerInfo.lastName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0 outline-none"
                placeholder="Enter your Last name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={passengerInfo.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0 outline-none"
              placeholder="Enter your Email Address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <div className="flex items-center gap-2">
              {authData.isAuthenticated && (
                <input
                  type="text"
                  value={authData.user?.user.mobile || ""}
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border-0 border-b-2 border-gray-300 text-gray-600 cursor-not-allowed"
                />
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Total Amount, Price, and Best Price Guaranteed in One Row */}
      <div className="mt-8 flex justify-between items-center">
        <p className="text-lg font-semibold">TOTAL AMOUNT</p>
        <div className="text-right">
          <p className="text-2xl font-bold">₹ {totalAmount}</p>
          <p className="text-sm text-gray-600">Best Price Guaranteed</p>
        </div>
      </div>
      <button
        onClick={handleProceedToPay}
        type="button"
        disabled={!authData.isAuthenticated}
        className={`w-full mt-6 py-3 text-white font-semibold rounded-lg flex justify-center items-center shadow-md transition-all duration-200
    ${
      authData.isAuthenticated
        ? "bg-[#0f7bab] hover:bg-[#0d6b96]"
        : "bg-gray-400 cursor-not-allowed opacity-50"
    }`}
      >
        Proceed to Pay
        <FaAnglesRight className="ml-2 text-lg" />
      </button>
    </div>
  );
};

export default BookingForm;
