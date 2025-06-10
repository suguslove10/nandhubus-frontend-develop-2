"use client";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { parse } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Bus, ArrowRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  useFetchBookingInfo,
  useRescheduleBooking,
} from "@/app/services/data.service";
import { FaAnglesRight } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectAuth } from "@/app/Redux/authSlice";
import { useLogin } from "@/app/hooks/login/useLogin";
import OtpInput from "react-otp-input";

function Reshedule() {
  const { mutate: fetchBookingInfo, data, isError } = useFetchBookingInfo();
  const [bookingId, setBookingId] = useState("");

  const handleBookingIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingId(e.target.value);
  };
  const handleFetchBooking = () => {
    if (bookingId.trim() !== "") {
      fetchBookingInfo(bookingId);
    }
  };
  const { handleSendOTP, handleVerifyOtp, handleResendOTP } = useLogin();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const [minDate, setMinDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);
  const { mutate: rescheduleBooking } = useRescheduleBooking();
  const [oldStartDate, setOldStartDate] = useState<Date | null>(null);
  const [oldEndDate, setOldEndDate] = useState<Date | null>(null);
  const authData = useSelector(selectAuth);
  const [mobileNumber, setMobileNumber] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otp, setOtp] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const [seconds, setSeconds] = useState(60);
  const router = useRouter();
  const handleClose = () => {
    setShowErrorDialog(false);
    router.push("/");
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    if (showOtpSection && seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (seconds === 0) {
      setIsResendDisabled(false);
    }
  }, [showOtpSection, seconds]);
  const handleGetOtpClick = () => {
    if (mobileNumber.length === 10) {
      handleSendOTP(mobileNumber);
      setShowOtpSection(true);
      setSeconds(60);
      setIsResendDisabled(true);
    }
  };

  const handleotpclose = () => {
    setShowOtpSection(false);
  };

  const handleReschedule = () => {
    if (!bookingId || !oldStartDate || !oldEndDate || !startDate || !endDate) {
      console.warn("Missing required fields for rescheduling.");
      return;
    }
    const requestBody = {
      bookingId,
      newStartDate: format(startDate, "yyyy-MM-dd"),
      newEndDate: format(endDate, "yyyy-MM-dd"),
    };
    rescheduleBooking(requestBody, {
      onSuccess: () => {
        alert("Booking rescheduled successfully!");
      },
      onError: (error:any) => {
        alert("Failed to reschedule. Please try again.");
      },
    });
  };
  const fetchBookingDetails = () => {
    if (!bookingId) {
      return;
    }
    fetchBookingInfo(bookingId, {
      onSuccess: (response) => {
        const bookingData = Array.isArray(response) ? response[0] : response;
        const slotsData = bookingData?.slots;
        if (!slotsData) {
          return;
        }
        const fromDate = parse(
          slotsData.fromDate || "",
          "dd-MM-yyyy",
          new Date()
        );
        const toDate = parse(slotsData.toDate || "", "dd-MM-yyyy", new Date());
     
        setOldStartDate(fromDate);
        setOldEndDate(toDate);
        setMinDate(fromDate);
        setMaxDate(toDate);
      },
    });
  };

  const defaultMonth = minDate ? new Date(minDate) : new Date();
  return (
    <div
      style={{ marginTop: "-11px" }}
      className=" bg-gradient-to-b from-[#0f7bab]/10 to-[#f8fafc]"
    >
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#01374e] mb-4">
              Reschedule Your Journey
            </h1>
            <p className="text-xl text-gray-600">
              Modify your travel dates with just a few clicks
            </p>
          </div>

          {!authData.isAuthenticated && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="tel"
                  className="mt-1 block w-[500px] px-3 py-2 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0 outline-none"
                  placeholder="Enter your Mobile Number To Reshedule"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  disabled={mobileNumber.length === 10 && seconds > 0}
                  required
                />
                {mobileNumber.length === 10 && (
                  <span
                    className="text-sm text-blue-600 cursor-pointer hover:text-blue-700 transition duration-300 whitespace-nowrap"
                    onClick={handleGetOtpClick}
                  >
                    Get OTP
                  </span>
                )}
              </div>
            </div>
          )}

          {showOtpSection && (
            <div className="mt-6 flex flex-col items-start justify-start">
              {/* OTP Input Boxes and Verify OTP in One Line */}
              <div className="flex items-center gap-4 justify-center">
                {/* OTP Input Boxes */}
                <div className="flex gap-2">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span>&nbsp;&nbsp;&nbsp;</span>}
                    renderInput={(inputProps, index) => (
                      <input
                        {...inputProps}
                        key={index}
                        style={{
                          width: "2rem",
                          height: "2rem",
                          textAlign: "center",

                          fontSize: "1rem",
                          borderBottom: "1px solid #ccc",
                        }}
                      />
                    )}
                  />
                </div>

                {/* Verify OTP Button */}
                <button
                  onClick={() =>
                    handleVerifyOtp(mobileNumber, otp, handleotpclose)
                  }
                  style={{ marginTop: "24px" }}
                  className="text-green-600  text-sm underline px-4 hover:text-green-700 transition duration-300 whitespace-nowrap"
                >
                  Verify OTP
                </button>
              </div>

              {/* Resend OTP */}
              <div className="text-sm text-gray-600 mt-4 text-center">
                {seconds > 0
                  ? `Resend OTP in ${seconds} seconds`
                  : "Did not receive OTP?"}
                {!isResendDisabled && (
                  <button
                    onClick={handleResendOTP}
                    className="ml-2 text-blue-600 hover:text-blue-700 transition duration-300"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}
          {/* Main Card */}
          {authData.isAuthenticated && (
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="space-y-10">
                {/* Booking ID Section */}
                <div>
                  <Label
                    htmlFor="bookingId"
                    className="text-[#01374e] text-base font-medium block mb-3"
                  >
                    Booking Id
                  </Label>
                  <Input
                    id="bookingId"
                    value={bookingId}
                    onChange={handleBookingIdChange}
                    className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-xl font-medium focus:border-[#0f7bab] focus:ring-0 transition-colors"
                    placeholder="Enter your booking ID"
                    onBlur={fetchBookingDetails}
                  />
                </div>
                {/* Date Selection Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* New Departure Date */}
                  <div>
                    <Label className="text-[#01374e] text-base font-medium block mb-3">
                      New Departure Date
                    </Label>
                    <Popover
                      open={isStartDateOpen}
                      onOpenChange={setIsStartDateOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 hover:bg-transparent hover:border-[#0f7bab] transition-colors ${
                            !startDate ? "text-gray-500" : ""
                          }`}
                        >
                          <CalendarIcon className="mr-3 h-5 w-5 text-[#0f7bab]" />
                          {startDate
                            ? format(startDate, "MMMM d, yyyy")
                            : "Select departure date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            setStartDate(date);
                            setIsStartDateOpen(false); // Close popover after selection
                          }}
                          initialFocus
                          defaultMonth={defaultMonth || undefined}
                          disabled={(date) => date <= minDate!}
                          modifiers={{
                            disabled: (date) => date <= minDate!,
                          }}
                          modifiersStyles={{
                            disabled: {
                              backgroundColor: "#f5f5f5",
                              cursor: "not-allowed",
                            },
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* New Return Date */}
                  <div>
                    <Label className="text-[#01374e] text-base font-medium block mb-3">
                      New Return Date
                    </Label>
                    <Popover
                      open={isEndDateOpen}
                      onOpenChange={setIsEndDateOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 hover:bg-transparent hover:border-[#0f7bab] transition-colors ${
                            !endDate ? "text-gray-500" : ""
                          }`}
                        >
                          <CalendarIcon className="mr-3 h-5 w-5 text-[#0f7bab]" />
                          {endDate
                            ? format(endDate, "MMMM d, yyyy")
                            : "Select return date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => {
                            setEndDate(date);
                            setIsEndDateOpen(false); // Close popover after selection
                          }}
                          initialFocus
                          defaultMonth={defaultMonth || undefined}
                          disabled={(date) => date <= maxDate!}
                          modifiers={{
                            disabled: (date) => date <= maxDate!,
                          }}
                          modifiersStyles={{
                            disabled: {
                              backgroundColor: "#f5f5f5",
                              cursor: "not-allowed",
                            },
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <Button
                    className="flex justify-center px-6  bg-[#0f7bab] hover:bg-[#01374e] text-white py-5 rounded-xl text-[16px] font-[16px] transition-colors"
                    onClick={handleReschedule}
                  >
                    Reshedule now
                    <FaAnglesRight className="ml-2 text-lg" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md rounded-2xl p-8">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <div className="w-8 h-8 border-2 border-green-500 rounded-full bg-green-500" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-center text-[#01374e]">
              Bus Available!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center text-gray-600 text-lg mb-6">
            Would you like to confirm your new travel dates?
          </div>
          <DialogFooter className="w-full flex gap-4">
            <Button
              type="submit"
              className="w-1/2 bg-[#0f7bab] hover:bg-[#0f7bab] text-lg py-4 rounded-xl transition-colors border border-transparent"
              onClick={() => setShowSuccessDialog(false)}
            >
              Confirm Reschedule
            </Button>
            <Button
              type="button"
              className="w-1/2 text-lg py-4 bg-[#0f7bab]  hover:bg-[#0f7bab] rounded-xl border border-gray-300"
              onClick={() => setShowSuccessDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="max-w-md rounded-2xl p-8">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <Bus className="h-8 w-8 text-red-500" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-center text-[#01374e]">
              Bus Not Available
            </DialogTitle>
          </DialogHeader>
          <div className="text-center text-gray-600 text-lg mb-6">
            <p>
              We&apos;re sorry, but there are no buses available for your
              selected dates. Please try different dates for your journey.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={handleClose}
              type="button"
              className="w-full bg-[#0f7bab] hover:bg-[#01374e] text-lg py-6 rounded-xl transition-colors"
            >
              Go Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default Reshedule;
