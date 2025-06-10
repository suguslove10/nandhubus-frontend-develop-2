"use client";
import { selectAuth, updateUserProfile } from "@/app/Redux/authSlice";
import { setBookingDetails } from "@/app/Redux/bookingSlice";
import { AppDispatch } from "@/app/Redux/store";
import {
  confirmReschedule,
  createPayment,
  getCoupons,
  revertBooking,
  useAddBooking,
  useRescheduleBooking,
  verifyPaymentSignature,
} from "@/app/services/data.service";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PaymentData } from "../payments/PaymentPage";
import { useRouter, useSearchParams } from "next/navigation";
import ErrorModal from "@/components/payment-modal/ErrorModal";
import Swal from "sweetalert2";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const Summary = () => {
  const authData = useSelector(selectAuth);
  const [passengerInfo, setPassengerInfo] = useState(() => {
    const storedInfo = JSON.parse(localStorage.getItem("passengerInfo") || "{}");
  
    return storedInfo.firstName ? storedInfo : {
      firstName: authData.user?.user.firstName || "",
      lastName: authData.user?.user.lastName || "",
      email: authData.user?.user.email || "",
      mobile: authData.user?.user.mobile || ""
    };
  });
  

  // Sync with authData when user logs in
  useEffect(() => {
    if (authData.isAuthenticated && authData.user?.user) {
      const newInfo = {
        firstName: authData.user.user.firstName || "",
        lastName: authData.user.user.lastName || "",
        email: authData.user.user.email || "",
        mobile: authData.user.user.mobile || ""
      };
  
      setPassengerInfo(newInfo);
      localStorage.setItem("passengerInfo", JSON.stringify(newInfo));
    }
  }, [authData.isAuthenticated, authData.user?.user]);
  

  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

const validateForm = (name: string, value: string) => {
  let errorMessage = "";

  if (name === "firstName") {
    if (!/^[A-Za-z\s]{2,50}$/.test(value)) {
      errorMessage = "Only alphabets allowed (2-50 characters)";
    }
  }

  if (name === "lastName") {
    // Making lastName optional (0-50 characters)
    if (value && !/^[A-Za-z\s]{0,50}$/.test(value)) {
      errorMessage = "Only alphabets allowed (0-50 characters)";
    }
  }

  if (name === "email") {
    // Make email optional, only validate if value is not empty
    if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      errorMessage = "Enter a valid email address";
    }
  }

  setErrors((prev) => ({ ...prev, [name]: errorMessage }));
};

  const dispatch = useDispatch<AppDispatch>();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPassengerInfo((prev: any) => ({ ...prev, [id]: value }));
    
    // // Update Redux auth state if user is authenticated
    // if (authData.isAuthenticated && authData.user?.user && (id === 'firstName' || id === 'lastName' || id === 'email')) {
    //   dispatch(updateUserProfile({
    //     firstName: id === 'firstName' ? value : authData.user.user.firstName || '',
    //     lastName: id === 'lastName' ? value : authData.user.user.lastName || '',
    //     email: id === 'email' ? value : authData.user.user.email || '',
    //     mobile: authData.user.user.mobile || '',
    //     gender: authData.user.user.gender || ''
    //   }));
    // }
    if (typingTimeout) clearTimeout(typingTimeout);
  
    const newTimeout = setTimeout(() => {
      validateForm(id, value);
    }, 500);
  
    setTypingTimeout(newTimeout);
  }

 

  const addBooking = useAddBooking();

 

  const searchParams = useSearchParams();

  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  const source = searchParams.get("source");
  const destination = searchParams.get("destination");

  const vehicleName = searchParams.get("vehicleName");

  const acType = searchParams.get("acType");

  const sleeper = searchParams.get("sleeper");
  const places = searchParams.get('places')
  ? decodeURIComponent(searchParams.get('places') as string)
  : '';


  const totalAmountParam = searchParams.get("totalAmount");
  const totalAmount = totalAmountParam ? parseFloat(totalAmountParam) : 0;
  const advanceAmountNeedToPay=searchParams.get("advanceAmountNeedToPay");

  const resheduleBookingID=searchParams.get("bookingId");
  const paymentTypess = searchParams.get("paymentType");
  const vehicleNumber = searchParams.get("vehicleNumber");

  const [paymentOption, setPaymentOption] = useState<"half" | "full">("full");

  const [bookingId, setBookingId] = useState("");
const [coupons, setCoupons] = useState<Coupon[]>([]);
const [couponCode, setCouponCode] = useState("");
const [couponId, setCouponId] = useState("");
const [discountAmount, setDiscountAmount] = useState(0);
const [couponApplied, setCouponApplied] = useState(false);
const [couponError, setCouponError] = useState("");
const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

const [showCouponDropdown, setShowCouponDropdown] = useState(false);
const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

// Add this useEffect to fetch coupons when component mounts
useEffect(() => {
  if(!isReschedule){
  const fetchCoupons = async () => {
    try {
      const availableCoupons = await getCoupons();
      setCoupons(availableCoupons);
      
      // If there are coupons, select the first one by default
      if (availableCoupons.length > 0) {
        setSelectedCoupon(availableCoupons[0]);
        setCouponCode(availableCoupons[0].couponCode);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  
  fetchCoupons();
}
}, []);

// Add this function to handle coupon application
const applyCoupon = async () => {
  if (!couponCode.trim()) {
    setCouponError("Please enter a coupon code");
    return;
  }

  setIsApplyingCoupon(true);
  setCouponError("");
  setCouponApplied(false);

  try {
    const couponToApply = coupons.find(
      (c) => c.couponCode === couponCode.trim()
    );

    if (!couponToApply) {
      setCouponError("Invalid coupon code");
      return;
    }

    // Choose the correct total amount source
    const currentTotalAmount = totalAmount

    let discount = 0;
    if (couponToApply.discountPercentage > 0) {
      discount = (currentTotalAmount * couponToApply.discountPercentage) / 100;
    } else {
      discount = couponToApply.discountPercentage ?? 0;
    }
setCouponId(couponToApply.couponId);
    setDiscountAmount(discount);
    setCouponApplied(true);
    setSelectedCoupon(couponToApply);
  } catch (error) {
    setCouponError("Failed to apply coupon. Please try again.");
  } finally {
    setIsApplyingCoupon(false);
  }
};


// Add this function to remove coupon
const removeCoupon = () => {
  setCouponApplied(false);
  setDiscountAmount(0);
  setCouponCode(selectedCoupon?.couponCode || "");
  setCouponError("");
};
  const handlePaymentOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = e.target.value as "half" | "full";
    setPaymentOption(selected);
  };

  const handleProceedToPay = (
    event: React.MouseEvent<HTMLButtonElement>,
    paymentType: string
  ) => {
    event.preventDefault();

    const mobile = authData.user?.user.mobile ?? "";
    if (advanceAmountNeedToPay) {
      dispatch(
        setBookingDetails({
          bookingId:resheduleBookingID!,
          mobile: mobile,
          totalAmount: Number(advanceAmountNeedToPay) || 0,
        })
      );

      displayRazorpay(
        resheduleBookingID!,
        Number(totalAmount) || 0,
        mobile,
        paymentTypess || ""
      );
      return;
    }

    const vehicleRequest = [
      {
        vehicleNumbers: vehicleNumber ?? "",
        totalAmount:  totalAmount ?? 0,
        discountedAmount: discountAmount,
        priceBreakDown: {
          gst: 0.0,
          basicFare: totalAmount ?? 0,
          tollCharges: 0,
          tollDetails: {},
          totalAmount: totalAmount ?? 0,
          platFormFees: totalAmount * 0.1,
          taxResponses: null,
          driverCharges: 0,
          gstOnPlatformFees: totalAmount * 0.1 * 0.18,
          vendorAmount: (totalAmount ?? 0) - ((totalAmount * 0.1) + (totalAmount * 0.1 * 0.18)),
        },
        
      },
    ];
    
    const formattedPlaces = places.split(' | ').join(',');
    
    const requestBody = {
      vehicleRequest,
      fromDate,
      toDate,
      source,
      destination,
      user: {
        firstName: passengerInfo.firstName,
        lastName: passengerInfo.lastName,
        mobile: mobile,
        email: passengerInfo.email,
      },
      slotsPojo: null,
      couponId: couponId,
      packagePlaces: formattedPlaces,
    };
    

    addBooking.mutate(requestBody, {
      onSuccess: (data) => {
        const response = data as {
          bookingId: string;
          message: string;
          statusCode: number;
        };

        dispatch(
          setBookingDetails({
            bookingId: response.bookingId,
            mobile: mobile,
            totalAmount: totalAmount,
          })
        );

        setBookingId(response.bookingId);

        displayRazorpay(response.bookingId,totalAmount - discountAmount, mobile, paymentType);
      },
      onError: (error: unknown) => {
        console.error("Booking failed:", error);
      },
    });
  };

  const loadScript = (src: any) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  const rescheduleBookingMutation = useRescheduleBooking();
  useEffect(() => {
    loadScript(process.env.NEXT_PUBLIC_RAZORPAY_SCRIPT);
  });
const isReschedule=searchParams.get("isReschedule")
async function displayRazorpay(
  bookingId: string,
  amount: number,
  mobile: string,
  paymentType: string
) {
  try {
if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
        alert("Developer Tools detected! Payment blocked.");
        if(isReschedule !== "true"){
        await revertBooking(bookingId);
        } else {
          await confirmReschedule(bookingId);

        }
        return;
      }
    // Check if this is a reschedule flow

    
    // For reschedule, process reschedule first
    if (isReschedule === "true") {
      const rescheduleData = sessionStorage.getItem("rescheduleData");
      
      if (!rescheduleData) {
        Swal.fire({
          title: "Error!",
          text: "Reschedule data not found.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            popup: "w-80 p-4",
            confirmButton: "px-3 py-1 text-sm",
          },
        });
        return;
      }
      
      try {
        const rescheduleRequest = JSON.parse(rescheduleData);
        
        // Make the reschedule API call first
        await rescheduleBookingMutation.mutateAsync(rescheduleRequest);
        
        // If reschedule is successful, proceed with payment
      } catch (err) {
        console.error("Error during reschedule:", err);
        
        Swal.fire({
          title: "Reschedule Failed",
          text: "There was an issue with rescheduling your booking. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            popup: "w-80 p-4",
            confirmButton: "px-3 py-1 text-sm",
          },
        });
        
        // Clean up session storage
        sessionStorage.removeItem("rescheduleData");
        sessionStorage.removeItem("isreschedule");
        
        // Don't proceed with payment if reschedule failed
        return;
      }
    }

 
    const requestBody = {
      bookingId,
      mobile,
    amount,
      paymentType,
    };

    // Add try-catch specifically for createPayment
    let paymentData;
    try {
      const paymentResponse = await createPayment(requestBody);
      if (!paymentResponse) {
        throw new Error(`Failed to create payment, status: ${paymentResponse}`);
      }
      paymentData = paymentResponse as PaymentData;
    } catch (error) {
      console.error("Error during createPayment:", error);
      
      // Show error popup specifically for createPayment failure
      Swal.fire({
        title: "Payment Creation Failed",
        text: "There was an error creating your payment. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: "w-80 p-4",
          confirmButton: "px-3 py-1 text-sm",
        },
      });
      
      // No need to revert booking here as we handle it in the outer catch
      return;
    }

    const options: any = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      currency: paymentData.currency,
      amount: paymentData.totalAmount * 100,
      name: "Pay Now",
      description: "Wallet Transaction",
      image: process.env.NEXT_PUBLIC_LOGO_URL,
      order_id: paymentData.razorPayOrderId,

      handler: async function (response: any) {
        const postData = {
          bookingId,
          razorPayPaymentId: response.razorpay_payment_id,
          razorPayOrderId: response.razorpay_order_id,
          razorPaySignature: response.razorpay_signature,
        };
      
        try {
          const verifyResponse = await verifyPaymentSignature(postData);
      
          if (verifyResponse) {
            // ✅ Payment successful
            if (isReschedule === "true") {
              try {
                // ✅ Confirm reschedule after payment is successful
                await confirmReschedule(bookingId);
      
                Swal.fire({
                  title: "Success!",
                  text: "Your booking has been successfully rescheduled.",
                  icon: "success",
                  confirmButtonText: "OK",
                  customClass: {
                    popup: "w-80 p-4",
                    confirmButton: "px-3 py-1 text-sm",
                  },
                }).then(() => {
                  // Clear session and redirect
                  sessionStorage.removeItem("rescheduleData");
                  sessionStorage.removeItem("isreschedule");
                  sessionStorage.removeItem("origin");
                  sessionStorage.removeItem("destination");
                  sessionStorage.removeItem("startDate");
                  sessionStorage.removeItem("endDate");
      
                  router.push("/myaccount/mytrips");
                });
              } catch (error) {
                console.error("Error during confirmReschedule:", error);
      
                Swal.fire({
                  title: "Reschedule Confirmation Failed",
                  text: "Payment was successful, but we couldn't confirm the reschedule. Please contact support.",
                  icon: "warning",
                  confirmButtonText: "OK",
                  customClass: {
                    popup: "w-80 p-4",
                    confirmButton: "px-3 py-1 text-sm",
                  },
                });
              }
            } else {
              // Normal booking success flow
                router.push(`/success?bookingId=${bookingId}`);              sessionStorage.removeItem("origin");
              sessionStorage.removeItem("destination");
              sessionStorage.removeItem("startDate");
              sessionStorage.removeItem("endDate");
            }
          } else {
            // ❌ Payment verification failed
            if (isReschedule !== "true") {
              await revertBooking(bookingId);
            }
      
            if (isReschedule === "true") {
              await confirmReschedule(bookingId);

              Swal.fire({
                title: "Payment Failed",
                text: "Your payment could not be verified. Please contact support about your rescheduled booking.",
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                  popup: "w-80 p-4",
                  confirmButton: "px-3 py-1 text-sm",
                },
              });
            } else {
              Swal.fire({
                title: "Payment Verification Failed",
                text: "We could not verify your payment.",
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                  popup: "w-80 p-4",
                  confirmButton: "px-3 py-1 text-sm",
                },
              });
            }
          }
        } catch (error) {
          console.error("Error during signature verification:", error);
          if (isReschedule !== "true") {
            await revertBooking(bookingId);
          } else {
            await confirmReschedule(bookingId);

          }
          // Optional: handle unknown errors in reschedule here
        }
      },
      

      prefill: {
        name: authData?.user?.user.firstName || "Guest",
        email: authData?.user?.user.email || "",
        contact: mobile || authData?.user?.user.mobile || "",
      },
      
      // User closed the Razorpay modal without completing payment
      modal: {
        ondismiss: async function () {
           if(isReschedule !== "true"){
            await revertBooking(bookingId);
            }
          
          // For reschedule, need to revert the already completed reschedule
          if (isReschedule === "true") {
            
            Swal.fire({
              title: "Payment Cancelled",
              text: "You cancelled the payment for your rescheduled booking. Please contact support.",
              icon: "info",
              confirmButtonText: "OK",
              customClass: {
                popup: "w-80 p-4",
                confirmButton: "px-3 py-1 text-sm",
              },
            });
          }
        },
      },
    };

    if (options.source) {
      delete options.source;
    }

    const rzp1 = new (window as any).Razorpay(options);

    rzp1.on("payment.failed", async function (response: any) {
      const failureData = {
        bookingId,
        razorPayPaymentId: response.error.metadata.payment_id,
        razorPayOrderId: response.error.metadata.order_id,
        razorPaySignature: response.error.metadata.signature || "xyfgg",
      };

      try {
        await verifyPaymentSignature(failureData);
         if(isReschedule !== "true"){
            await revertBooking(bookingId);
            }
        // For reschedule, need to revert the already completed reschedule
        if (isReschedule === "true") {
          
          Swal.fire({
            title: "Payment Failed",
            text: "Your payment for the rescheduled booking failed. Please contact support.",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              popup: "w-80 p-4",
              confirmButton: "px-3 py-1 text-sm",
            },
          });
          
          sessionStorage.removeItem("rescheduleData");
          sessionStorage.removeItem("isreschedule");
        } else {
          // Normal booking failure
          Swal.fire({
            title: "Payment Failed",
            text: "Your payment could not be processed.",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              popup: "w-80 p-4",
              confirmButton: "px-3 py-1 text-sm",
            },
          });
        }
      } catch (error) {
        console.error("Error during failure signature verification:", error);
         if(isReschedule !== "true"){
            await revertBooking(bookingId);
            }
      }
    });

    rzp1.open();
  } catch (error) {
    console.error("Error during Razorpay payment:", error);
     if(isReschedule !== "true"){
            await revertBooking(bookingId);
            }
    
    // Show appropriate error message based on flow
   
    if (isReschedule === "true") {
      Swal.fire({
        title: "Payment Error",
        text: "There was an error processing your payment for the rescheduled booking.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: "w-80 p-4",
          confirmButton: "px-3 py-1 text-sm",
        },
      });
    } else {
      Swal.fire({
        title: "Payment Error",
        text: "There was an error processing your payment.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: "w-80 p-4",
          confirmButton: "px-3 py-1 text-sm",
        },
      });
    }
  }
}
  
  

  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };
  const truncateWords = (text: string, wordLimit: number) => {
    const words = text.trim().split(/\s+/);
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };
  
  const handleSeeDetails = () => {
    router.push("/myaccount/mytrips");
  };

  const [showErrorModal, setShowErrorModal] = useState(false);

  return (
    <>
      <div className="flex justify-center min-h-screen px-4 sm:px-6 md:px-10 lg:px-20 py-4 bg-[#F7F9FB]">
        <div className="flex flex-col gap-4 w-full max-w-3xl">
          {/* Bus Details */}
          <section className="flex flex-col gap-4">
            <div className="bg-white p-4 sm:p-5">
              <section className="flex flex-row items-center justify-between gap-2 border-b border-b-gray-100 pb-2">
                <p className="text-base font-medium text-gray-800">
                  {vehicleName}
                </p>
              </section>
              <p className="text-xs font-medium text-[#848484]">
                {acType} | {sleeper}
              </p>
            </div>
          </section>
          {/* Places Details */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <section className="flex flex-col gap-2 bg-white p-4 sm:p-5 w-full sm:w-1/2 h-32">
              <p className="text-xs bg-[#E8F8FF] text-[#0f7bab] p-1 my-1.5 w-28 text-center">
                {fromDate
                  ? new Date(fromDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "Invalid Date"}
              </p>
              <p className="text-lg font-semibold">  {truncateWords(source!, 5)}
              </p>
            </section>
            <section className="flex flex-col gap-2 bg-white p-4 sm:p-5 w-full sm:w-1/2 h-32">
              <p className="text-xs bg-[#E8F8FF] text-[#0f7bab] p-1 my-1.5 w-28 text-center">
                {toDate
                  ? new Date(toDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "Invalid Date"}
              </p>
              <p className="text-lg font-semibold">
  {truncateWords(destination!, 5)}
</p>
            </section>
          </div>
  
          <div className="bg-white p-4 sm:p-5">
            <p className="text-normal font-medium text-[#0f7bab] my-1.5">
              Booking Details
            </p>
            <form className="py-2">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      value={passengerInfo.firstName ?? ""}
                      onChange={handleInputChange}
                      type="text"
                      className="text-sm block w-full px-3 py-1 border-0 border-b-1 border-gray-300 focus:border-[#0f7bab] focus:ring-0 outline-none"
                      required
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={passengerInfo.lastName ?? ""}
                      onChange={handleInputChange}
                      className="text-sm block w-full px-3 py-1 border-0 border-b-1 border-gray-300 focus:border-[#0f7bab] focus:ring-0 outline-none"
                      required
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={passengerInfo.email ?? ""}
                    onChange={handleInputChange}
                    className="text-sm block w-full px-3 py-1 border-0 border-b-1 border-gray-300 focus:border-[#0f7bab] focus:ring-0 outline-none"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">
                    Mobile Number
                  </label>
                  <div className="flex items-center gap-2">
                    {authData.isAuthenticated && (
                      <input
                        type="text"
                        value={authData.user?.user.mobile || ""}
                        className="text-sm block w-full px-3 py-2 border-0 border-b-1 border-gray-300 text-gray-600 cursor-not-allowed"
                        readOnly
                      />
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
          {advanceAmountNeedToPay?(""):
          <section className="flex flex-col gap-6 items-center">
            <div className="bg-white p-4 w-full max-h-[300px] overflow-y-auto">
              
             <div className="my-1.5 py-1">
                <span className="text-md font-medium text-[#0f7bab]">
                  Payment Options
                </span>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 mt-2">
                <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="payment"
                      className="form-radio"
                      style={{ accentColor: "#0f7bab" }}
                      value="half"
                      onChange={handlePaymentOptionChange}
                    />
                    <span className="text-xs">Pay Half Now</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="payment"
                      className="form-radio text-[#0f7bab]"
                      defaultChecked
                      style={{ accentColor: "#0f7bab" }}
                      value="full"
                      onChange={handlePaymentOptionChange}
                    />
                    <span className="text-xs">Pay Full Amount</span>
                  </label>
                </div>
              </div>
            </div>
          </section>}
          <div className="bg-white p-4 w-full max-h-[300px] overflow-y-auto flex justify-between">
            <span className="text-md font-medium text-[#0f7bab]">
              Total Amount
            </span>
            <span className="text-md font-semibold">
              ₹{advanceAmountNeedToPay ? advanceAmountNeedToPay :paymentOption === "half" ? (totalAmount-discountAmount) / 2 : totalAmount-discountAmount}
            </span>
          </div>
          {isReschedule !== "true"  && (
  <section className="bg-white p-4 sm:p-5 rounded-lg shadow-sm">
    <p className="text-normal font-medium text-[#0f7bab] mb-3">Apply Coupon</p>
    
    <div className="flex flex-col gap-3">
      {/* Coupon Input Section */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter coupon code"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#0f7bab]"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          {couponApplied && (
            <button
              onClick={removeCoupon}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              title="Remove coupon"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={couponApplied ? removeCoupon : applyCoupon}
          disabled={isApplyingCoupon || (!couponCode && !couponApplied)}
          className={`px-4 py-2 text-white text-sm rounded-md transition-colors ${
            couponApplied 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-[#0f7bab] hover:bg-[#0a5a7a]"
          } disabled:bg-gray-300 disabled:cursor-not-allowed`}
        >
          {isApplyingCoupon 
            ? "Applying..." 
            : couponApplied 
              ? "Remove" 
              : "Apply"}
        </button>
      </div>

      {/* Coupon Radio Options - Bottom Section */}
      {coupons.length > 0 && (
  <div className="mt-2">
    <p className="text-xs font-medium text-gray-600 mb-2">Available Coupons:</p>
    <div className="space-y-2">
      {coupons.slice(0, showCouponDropdown ? coupons.length : 2).map((coupon) => {
        const isSelected = selectedCoupon?.couponId === coupon.couponId;
        return (
          <label 
            key={coupon.couponId}
            className={`flex items-center p-2 border rounded-md cursor-pointer ${
              isSelected
                ? 'border-[#0f7bab] bg-blue-50' 
                : 'border-gray-200'
            }`}
            onClick={(e) => {
              // Prevent double triggering when clicking the radio input directly
            const target = e.target as HTMLElement;
    
    // Prevent double triggering when clicking the radio input directly
    if (target.tagName === 'INPUT') return;
    
              
              if (isSelected) {
                // Deselect the coupon
                setSelectedCoupon(null);
                setCouponCode("");
                setCouponApplied(false);
                setDiscountAmount(0);
              } else {
                // Select new coupon
                setSelectedCoupon(coupon);
                setCouponCode(coupon.couponCode);
                setCouponApplied(false);
                const currentTotalAmount =totalAmount ?? 0;
               
              }
            }}
          >
            <input
              type="radio"
              name="coupon"
              className="mr-2 text-[#0f7bab] focus:ring-[#0f7bab]"
              checked={isSelected}
              onChange={() => {}} // Empty handler to prevent default behavior
              onClick={(e) => e.stopPropagation()} // Prevent label click from triggering twice
            />
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{coupon.couponCode}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {coupon.discountPercentage > 0 
                    ? `${coupon.discountPercentage}% OFF` 
                    : `₹${coupon.discountPercentage} OFF`}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{coupon.couponDescription}</p>
            </div>
          </label>
        );
      })}
      
      {coupons.length > 2 && (
        <button
          type="button"
          className="text-xs text-[#0f7bab] hover:underline flex items-center"
          onClick={() => setShowCouponDropdown(!showCouponDropdown)}
        >
          {showCouponDropdown ? 'Show less' : `+ ${coupons.length - 2} more`}
        </button>
      )}
    </div>
  </div>
)}

      {/* Status Messages */}
      <div className="text-xs mt-2">
        {couponApplied ? (
          <div className="flex items-center text-green-600">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
            Coupon applied! You saved ₹{discountAmount.toFixed(2)}
          </div>
        ) : couponError ? (
          <div className="flex items-center text-red-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            {couponError}
          </div>
        ) : (
          <div className="text-gray-500">
            Have a coupon code? Apply to get discounts
          </div>
        )}
      </div>
    </div>
  </section>
)}
          <button
            onClick={(event) => handleProceedToPay(event, paymentOption)}
            className="w-full py-3 text-white font-normal flex justify-center items-center text-xs transition-all duration-200"
            disabled={Boolean(
              !passengerInfo.firstName ||
                !passengerInfo.lastName ||
              
                errors.firstName ||
                errors.lastName ||
                errors.email
            )}
            style={{
              backgroundColor:
                !passengerInfo.firstName ||
                !passengerInfo.lastName ||
               
                errors.firstName ||
                errors.lastName ||
                errors.email
                  ? "#D3D3D3"
                  : "#0f7bab",
              cursor:
                !passengerInfo.firstName ||
                !passengerInfo.lastName ||
               
                errors.firstName ||
                errors.lastName ||
                errors.email
                  ? "not-allowed"
                  : "pointer",
            }}
          >
                            Proceed to Pay{" "}
                            <MdKeyboardDoubleArrowRight className="text-base" />{" "}
            
          </button>
        </div>
      </div>
     
      <ErrorModal
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Payment Failed"
        content="Something went wrong during the payment"
        buttonText="Retry"
      />
    </>
  );
};

export default Summary;
