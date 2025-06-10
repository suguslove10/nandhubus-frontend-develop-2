"use client";
import {
  calculatePriceSummary,
  confirmReschedule,
  createPayment,
  fareCalculations,
  getCoupons,
  revertBooking,
  updateProfile,
  useAddBooking,
  useRescheduleBooking,
  verifyPaymentSignature,
} from "@/app/services/data.service";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/Redux/store";
import {
  MdInfoOutline,
  MdKeyboardDoubleArrowRight,
  MdOutlineDoubleArrow,
  MdOutlineQuestionAnswer,
  MdQuestionAnswer,
} from "react-icons/md";

export interface PaymentData {
  currency: string;
  totalAmount: number;
  paymentMethod: string;
  razorPayOrderId: string;
}
interface FareCalculationPayload {
  vehicleNumber: string;
  source: string;
  destination: string;
  startDate: string; // Format: 'YYYY-MM-DD'
  endDate: string; // Format: 'YYYY-MM-DD'
  baseFare: number;
}

const PaymentPage = () => {
  const searchParam = useSearchParams();
  const isreschedule = searchParam.get("reschedule");
  const { source, destination, fromDate, toDate } = useSelector(
    (state: RootState) => state.search
  );

  const authData = useSelector(selectAuth);

  const selectedBus = useSelector((state: RootState) => state.bus.selectedBus);

  const selectedBuses = useSelector(
    (state: RootState) => state.multipleBusBooking.selectedBuses
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!isReschedule ) {
      const stored = sessionStorage.getItem("vehicleHoldKeys");
      if (stored) {
        createSession(5 * 60 * 1000, () => {
          alert("Session expired!");
          router.back();
        });
      } else {
        router.back();
      }

      return () => clearSession();
    } else {
      createSession(5 * 60 * 1000, () => {
        alert("Session expired!");
        router.back();
      });
      return () => clearSession();
    }
  }, []);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleSeeDetails = () => {
    router.push("/myaccount/mytrips");
  };

  type TruncatedTextProps = {
    text: string;
    maxLength: number;
    className?: string;
  };
  
  const TruncatedText: React.FC<TruncatedTextProps> = ({
    text,
    maxLength,
    className,
  }) => {
    const truncatedText =
      text.length > maxLength ? text.slice(0, maxLength).trim() + "..." : text;
  
    return (
      <span className={className} title={text}>
        {truncatedText}
      </span>
    );
  };
  
  

  {
  }
  const [passengerInfo, setPassengerInfo] = useState(() => {
    const storedInfo = JSON.parse(
      localStorage.getItem("passengerInfo") || "{}"
    );

    return storedInfo.firstName
      ? storedInfo
      : {
          firstName: authData.user?.user.firstName || "",
          lastName: authData.user?.user.lastName || "",
          email: authData.user?.user.email || "",
          mobile: authData.user?.user.mobile || "",
        };
  });

  // Sync with authData when user logs in
  useEffect(() => {
    if (authData.isAuthenticated && authData.user?.user) {
      const newInfo = {
        firstName: authData.user.user.firstName || "",
        lastName: authData.user.user.lastName || "",
        email: authData.user.user.email || "",
        mobile: authData.user.user.mobile || "",
      };

      setPassengerInfo(newInfo);
      localStorage.setItem("passengerInfo", JSON.stringify(newInfo));
    }
  }, [authData.isAuthenticated, authData.user?.user]);

  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    localStorage.setItem("passengerInfo", JSON.stringify(passengerInfo));
  }, [passengerInfo]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPassengerInfo((prev: any) => ({ ...prev, [id]: value }));

    // Update Redux auth state if user is authenticated
    // if (
    //   authData.isAuthenticated &&
    //   authData.user?.user &&
    //   (id === "firstName" || id === "lastName" || id === "email")
    // ) {
    //   dispatch(
    //     updateUserProfile({
    //       firstName:
    //         id === "firstName" ? value : authData.user.user.firstName || "",
    //       lastName:
    //         id === "lastName" ? value : authData.user.user.lastName || "",
    //       email: id === "email" ? value : authData.user.user.email || "",
    //       mobile: authData.user.user.mobile || "",
    //       gender: authData.user.user.gender || "",
    //     })
    //   );
    // }

    if (typingTimeout) clearTimeout(typingTimeout);

    const newTimeout = setTimeout(() => {
      validateForm(id, value);
    }, 500);

    setTypingTimeout(newTimeout);
  };

  const isMultipleBooking = searchParam.get("isMultipleBooking");

  const rescheduleBookingId = searchParam.get("bookingId") || "";
  const paymentTypess = searchParam.get("paymentType") || "";

  const priceBreakDownParam = searchParam.get("priceBreakDown");
  // let priceBreakDown: PriceBreakDown | null = null;

  // if (priceBreakDownParam && priceBreakDownParam !== "undefined") {
  //   try {
  //     priceBreakDown = JSON.parse(decodeURIComponent(priceBreakDownParam));
  //     if (typeof priceBreakDown === "object" && priceBreakDown !== null) {
  //       console.log("tollCharges:", priceBreakDown);
  //     }
  //   } catch (error) {
  //     console.error("Error parsing priceBreakDown:", error);
  //   }
  // }

  const bookingFormData = sessionStorage.getItem("booking_form__data");
  let newStartDate = "";
  let newEndDate = "";
  let sourceLocation = "";
  let destinationLocation = "";

  if (bookingFormData) {
    const parsedData = JSON.parse(bookingFormData);
    newStartDate = parsedData?.fromDate || "";
    newEndDate = parsedData?.toDate || "";
    sourceLocation = parsedData?.source || " ";
    destinationLocation = parsedData?.destination || " ";
  }

  const paidAdvance = searchParam.get("advanceAmt") || "";
  const balanceAmount = searchParam.get("remainingAmt") || "";
  const earlierAdvancePaid = searchParam.get("previousAdvanceAmountPaid") || "";
  const fullTripAmount = searchParam.get("totalAmount") || "";
  const extraAmountRequired = searchParam.get("additionalAmountRequired") || "";

  const advanceToPay = searchParam.get("advanceAmountNeedToPay") || "";

  const isACBus = searchParam.get("vehicleAC") || "";
  const sleeperCoach = searchParam.get("sleeper") || "";

  const busTitle = searchParam.get("vehicleName") || "";
  const [coupons, setCoupons] = useState<Coupon[]>([]);
const [couponCode, setCouponCode] = useState("");
const [couponId, setCouponId] = useState("");
const [discountAmount, setDiscountAmount] = useState(0);
const [couponApplied, setCouponApplied] = useState(false);
const [couponError, setCouponError] = useState("");
const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

const [showCouponDropdown, setShowCouponDropdown] = useState(false);
const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

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
          } else{
            await confirmReschedule(bookingId);
          }
          return;
        }
      
      // Handle reschedule flow
      if (isReschedule === "true") {
        const rescheduleData = sessionStorage.getItem("rescheduleData");
        
        if (!rescheduleData) {
          throw new Error("Reschedule data not found");
        }
        
        const rescheduleRequest = JSON.parse(rescheduleData);
        
        try {
          // Call reschedule first
          await new Promise((resolve, reject) => {
            rescheduleBookingMutation.mutate(rescheduleRequest, {
              onSuccess: (response) => {
                resolve(response);
              },
              onError: (error) => {
                reject(error);
                
                // Show reschedule failure modal
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
                sessionStorage.removeItem("vehicleHoldKeys");
              }
            });
          });
          
          // If reschedule was successful, continue with payment process
        } catch (error) {
          // If reschedule failed, stop the process
          console.error("Error during reschedule:", error);
          return;
        }
      }
    
      const requestBody = {
        bookingId: bookingId,
        mobile: mobile,
       amount,
        paymentType: paymentType,
      };
  
      try {
        const paymentResponse = await createPayment(requestBody);
  
        if (!paymentResponse ) {
          // Handle case where payment response is falsy but no error was thrown
          if (isReschedule !== "true") {
          // Only call revertBooking for non-reschedule flows
          await revertBooking(bookingId);
        } else {
                    await confirmReschedule(bookingId);
          
        }
          Swal.fire({
            title: "Payment Creation Failed",
            text: "We could not create your payment order. Please try again later.",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              popup: "w-80 p-4",
              confirmButton: "px-3 py-1 text-sm",
            },
          });
          
          if (isReschedule === "true") {
            sessionStorage.removeItem("rescheduleData");
            sessionStorage.removeItem("isreschedule");
          }
          sessionStorage.removeItem("vehicleHoldKeys");
          return;
        }
  
        const paymentData = paymentResponse as PaymentData;
      console.log("Using Razorpay Key:", process.env.NEXT_PUBLIC_RAZORPAY_KEY);
    console.log("Environment:", process.env.NODE_ENV);

        const options: any = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          currency: paymentData.currency,
          amount: paymentData.totalAmount * 100,
          name: "Pay Now",
          description: "Wallet Transaction",
          image: process.env.NEXT_PUBLIC_LOGO_URL,
          order_id: paymentData.razorPayOrderId,
          // In the Razorpay success handler
          handler: async function (response: any) {
            const postData = {
              bookingId: bookingId,
              razorPayPaymentId: response.razorpay_payment_id,
              razorPayOrderId: response.razorpay_order_id,
              razorPaySignature: response.razorpay_signature,
            };
  
            try {
              const verifyResponse = await verifyPaymentSignature(postData);
  
              if (verifyResponse) {
                // Check if this was a reschedule payment
                if (isReschedule === "true") {
                            await confirmReschedule(bookingId);
                  
                  // Show success popup for reschedule
                  Swal.fire({
                    title: "Reschedule Successful!",
                    text: "Your booking has been successfully rescheduled and payment completed.",
                    icon: "success",
                    confirmButtonText: "OK",
                    customClass: {
                      popup: "w-80 p-4",
                      confirmButton: "px-3 py-1 text-sm",
                    },
                  }).then(() => {
                    // Clean up session storage
                    sessionStorage.removeItem("rescheduleData");
                    sessionStorage.removeItem("isreschedule");
                    sessionStorage.removeItem("origin");
                    sessionStorage.removeItem("destination");
                    sessionStorage.removeItem("startDate");
                    sessionStorage.removeItem("endDate");
                    sessionStorage.removeItem("vehicleHoldKeys");
                    router.push("/myaccount/mytrips"); // Redirect to bookings page
                  });
                } else {
                  // Regular booking success flow
                  router.push(`/success?bookingId=${bookingId}`);                  
                  sessionStorage.removeItem("origin");
                  sessionStorage.removeItem("destination");
                  sessionStorage.removeItem("startDate");
                  sessionStorage.removeItem("endDate");
                }
              } else {
               if (isReschedule !== "true") {
                // Only call revertBooking for non-reschedule flows
                await revertBooking(bookingId);
              }
                
                // If this was a reschedule, we need to revert the reschedule as well
                if (isReschedule === "true") {
                            await confirmReschedule(bookingId);
                  
                  // You would need to implement a revertReschedule function
                  // await revertReschedule(bookingId);
                }
                
                Swal.fire({
                  title: "Payment Verification Failed",
                  text: "We could not verify your payment. Please try again or contact support.",
                  icon: "error",
                  confirmButtonText: "OK",
                  customClass: {
                    popup: "w-80 p-4",
                    confirmButton: "px-3 py-1 text-sm",
                  },
                });
              }
            } catch (error) {
              console.error("Error during signature verification:", error);
              // Revert booking on error during verification
             if (isReschedule !== "true") {
              // Only call revertBooking for non-reschedule flows
              await revertBooking(bookingId);
            }else {
                        await confirmReschedule(bookingId);
              
            }
              
              // If this was a reschedule, we need to revert the reschedule as well
              if (isReschedule === "true") {
                          await confirmReschedule(bookingId);
                
                // You would need to implement a revertReschedule function
                // await revertReschedule(bookingId);
              }
              
              Swal.fire({
                title: "Payment Error",
                text: "An error occurred during payment verification. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                  popup: "w-80 p-4",
                  confirmButton: "px-3 py-1 text-sm",
                },
              });
            }
          },
          prefill: {
            name: authData.user?.user.firstName,
            email: authData.user?.user.email,
            contact: authData.user?.user.mobile 
              ? authData.user?.user.mobile 
              : passengerInfo.mobile
          },
          
          // User closed the Razorpay modal without completing payment
          modal: {
            ondismiss: async function () {
              // Revert booking if user exits without paying
                  if (isReschedule !== "true") {
              // Only call revertBooking for non-reschedule flows
              await revertBooking(bookingId);
            }
              else{
                          await confirmReschedule(bookingId);
                
              }
              // If this was a reschedule attempt, we need to revert the reschedule as well
              if (isReschedule === "true") {
                // You would need to implement a revertReschedule function
                // await revertReschedule(bookingId);
                          await confirmReschedule(bookingId);
                
                
                Swal.fire({
                  title: "Reschedule Payment Cancelled",
                  text: "You've cancelled the reschedule payment process. Your booking has been returned to its original state.",
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
            razorPaySignature: response.error.metadata.signature || " xyfgg",
          };
  
          try {
            await verifyPaymentSignature(failureData);
  
            // Call revertBooking to cancel the booking on payment failure
if(isReschedule !== "true"){
        await revertBooking(bookingId);
        }  
            // If this was a reschedule payment, we need to revert the reschedule as well
            if (isReschedule === "true") {
             
              
              Swal.fire({
                title: "Reschedule Payment Failed",
                text: "Your reschedule payment could not be processed. Your booking has been returned to its original state.",
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
              // Regular booking failure
              Swal.fire({
                title: "Payment Failed",
                text: "Your payment could not be processed. The booking has been cancelled.",
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                  popup: "w-80 p-4",
                  confirmButton: "px-3 py-1 text-sm",
                },
              });
            }
            
            // Clean up storage in both cases
            sessionStorage.removeItem("vehicleHoldKeys");
            
          } catch (error) {
            console.error("Error during failure signature verification:", error);
            // Still revert the booking even if verification fails
             if (isReschedule !== "true") {
            // Only call revertBooking for non-reschedule flows
            await revertBooking(bookingId);
          }
            // If this was a reschedule, we need to revert the reschedule as well
            if (isReschedule === "true") {
              // You would need to implement a revertReschedule function
              // await revertReschedule(bookingId);
            }
          }
        });
  
        rzp1.open();
      } catch (createPaymentError: any) {
        // Handle specific errors from createPayment
        console.error("Error creating payment:", createPaymentError);
        
        // Revert the booking
        if (isReschedule !== "true") {
        // Only call revertBooking for non-reschedule flows
        await revertBooking(bookingId);
      }
        
        // Show specific error message from createPayment response if available
        Swal.fire({
          title: "Payment Creation Failed",
          text: createPaymentError.message || "Failed to create payment. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            popup: "w-80 p-4",
            confirmButton: "px-3 py-1 text-sm",
          },
        });
        
        // Clean up session storage
        if (isReschedule === "true") {
          sessionStorage.removeItem("rescheduleData");
          sessionStorage.removeItem("isreschedule");
        }
        sessionStorage.removeItem("vehicleHoldKeys");
      }
    } catch (error: any) {
      console.error("Error during Razorpay payment:", error);
      
      // Check if this was a reschedule attempt
      
      
      // Revert booking if there's an error initializing payment
         if (isReschedule !== "true") {
      // Only call revertBooking for non-reschedule flows
      await revertBooking(bookingId);
    }
      
      // If this was a reschedule, we might need to revert the reschedule as well
      // Only needed if the error happened after the reschedule but before payment completion
      if (isReschedule === "true") {
        // You would need to implement a revertReschedule function
        // await revertReschedule(bookingId);
        
        Swal.fire({
          title: "Reschedule Error",
          text: "There was an error processing your reschedule request. Please try again later.",
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
      } else {
        Swal.fire({
          title: "Payment Error",
          text: error.message || "There was an error processing your payment. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            popup: "w-80 p-4",
            confirmButton: "px-3 py-1 text-sm",
          },
        });
      }
      
      sessionStorage.removeItem("vehicleHoldKeys");
    }
  }
  {
  }
  const dispatch = useDispatch<AppDispatch>();

  const addBooking = useAddBooking();

  const { bookingId } = useSelector((state: RootState) => state.booking);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  {
  }
  const handleProceedToPay = (
    event: React.MouseEvent<HTMLButtonElement>,
    paymentType: string
  ) => {
    event.preventDefault();
  
    const mobileNumber = authData.isAuthenticated
      ? authData.user?.user.mobile
      : passengerInfo.mobile;
  
    const mobile = mobileNumber ?? "";
  
    let totalAmount = 0;
  
    if (selectedBus && fare) {
      const {
        basicFare = 0,
        gst = 0,
        tollCharges = 0,
        driverCharges = 0,
      } = fare;
    
      const stateTax = fare?.taxResponses?.reduce(
        (sum: number, tax: any) => sum + (tax?.stateTax || 0),
        0
      ) || 0;
    
      totalAmount = (fare?.totalAmount || 0) + stateTax;
    
    } else if (selectedBuses && selectedBuses.length > 0) {
      const stateTax = priceSummary?.overAllPriceBreakDown?.taxResponses?.reduce(
        (sum: number, tax: any) => sum + (tax?.stateTax || 0),
        0
      ) || 0;
    
    
      totalAmount = (priceSummary?.overAllPriceBreakDown?.totalAmount || 0) + stateTax;
    }
        
    if (paidAdvance && advanceToPay) {
      dispatch(
        setBookingDetails({
          bookingId: rescheduleBookingId,
          mobile: mobile,
          totalAmount: Number(fullTripAmount) || 0,
        })
      );
  
 displayRazorpay(
        rescheduleBookingId,
        Number(fullTripAmount) || 0,
        mobile,
        paymentTypess
      );
      return;
    }
  
    const requestBody = {
      vehicleRequest,
      fromDate: newStartDate,
      toDate: newEndDate,
      source: sourceLocation,
      destination: destinationLocation,
      user: {
        firstName: passengerInfo.firstName,
        lastName: passengerInfo.lastName,
        mobile: mobile,
        email: passengerInfo.email,
      },
      slotsPojo: null,
      couponId:couponId
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
  
        displayRazorpay(response.bookingId, totalAmount-discountAmount, mobile, paymentType);
      },
      onError: (error: unknown) => {
        console.error("Booking failed:", error);
      },
    });
  };
  
  const searchParams = useSearchParams();

  const vehicleNumber = searchParams.get("vehicleNumber");
  const [fare, setFare] = useState<FareCalculationResponse | null>(null);
  const { showLoader, hideLoader } = useLoader();
  const isReschedule = searchParams.get("reschedule");
  // Before your component return, add this:
  const rescheduleBus =
    isreschedule === "true"
      ? {
          vehicleNumber: vehicleNumber || "",
          vehicleAC: isACBus || "",
          sleeper: sleeperCoach || "",
          vehicleName: busTitle || "",
          price: Number(fullTripAmount) || 0,
          advanceAmt: Number(paidAdvance) || 0,
          remainingAmt: Number(balanceAmount) || 0,
          advanceAmountNeedToPay: Number(advanceToPay) || 0,
          previousAdvanceAmountPaid: Number(earlierAdvancePaid) || 0,
          priceBreakDown: {
            basicFare: Number(fullTripAmount) || 0,
            tollCharges: 0, // You may need to get these from params if available
            gst: 0,
            totalAmount: Number(fullTripAmount) || 0,
            driverCharges: 0,
          },
        }
      : null;

  // Then modify your bus selection logic to include rescheduleBus
  const displayBus = selectedBus || rescheduleBus || selectedBuses?.[0];
  useEffect(() => {
    const fetchFareCalculation = async () => {
      const storedBookingData = sessionStorage.getItem("booking_form__data");
      if (!storedBookingData) return;

      const bookingData = JSON.parse(storedBookingData);

      const { source, destination, fromDate, toDate } = bookingData;

      if (!source || !destination || !fromDate || !toDate) {
        return; // Don't fetch if necessary fields are missing
      }
 
      const payload: FareCalculationPayload = {
        vehicleNumber: vehicleNumber || "",
        source,
        destination,
        startDate: fromDate,
        endDate: toDate,
        baseFare: selectedBus?.price || 0,
      };

      try {
        showLoader(); // Show global loader
        setIsLoading(true);
        setError(null);

        const response = await fareCalculations(payload);
        setFare(response);
      } catch (err) {
        setError("Failed to fetch fare calculation. Please try again later.");
      } finally {
        setIsLoading(false);
        hideLoader();
      }
    };

    if (isMultipleBooking !== "true" && isreschedule !== "true") {
      fetchFareCalculation();
    } else if (isreschedule === "true") {
      if (fullTripAmount || advanceToPay) {
        setIsLoading(false);
      }
    }
  }, [vehicleNumber, selectedBus]);

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


  const [priceSummary, setPriceSummary] = useState<VehicleCalculationData>();
  const handleMultipleBookingSummary = async () => {
    const isReschedule = searchParams.get("reschedule");
    if (isReschedule === "true") return;
  
    const storedBookingData = sessionStorage.getItem("booking_form__data");
    if (!storedBookingData) return;
  
    const bookingData = JSON.parse(storedBookingData);
  
    const { source, destination, fromDate, toDate } = bookingData;
  
    try {
      const requestList: VehiclePriceRequest[] = selectedBuses.map((bus) => ({
        vehicleNumber: bus.vehicleNumber,
        source: source,
        destination: destination,
        startDate: fromDate,
        endDate: toDate,
        baseFare: bus.price,
      }));
  
      const payload: VehiclePriceSummaryRequest = { requestList };
  
      const response = await calculatePriceSummary(payload);
      setPriceSummary(response);
    } catch (error) {
      console.error("Error getting multiple booking summary:", error);
    }
  };
  
  const [paymentOption, setPaymentOption] = useState<"half" | "full">("full");

  const handlePaymentOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentOption(e.target.value as "half" | "full");
  };

  const baseFare = fare?.basicFare ?? 0;

  const gst = fare?.gst ?? 0;

  const tollCharges = fare?.tollCharges ?? 0;

  const driverCharges = fare?.driverCharges ?? 0;

  const totalAmount = fare?.totalAmount ?? 0;
  const tollDetails = fare?.tollDetails;
  const platFormFees = fare?.platFormFees ?? 0;
  const gstOnPlatformFees = fare?.gstOnPlatformFees ?? 0;

  {
  }

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const vehicleNumbersArray = vehicleNumber ? vehicleNumber.split(",") : [];

  const vehicleRequest = vehicleNumbersArray.map((vehicle: any) => {
    // Determine the correct source based on isMultipleBooking
    const priceBreakDownSource = isMultipleBooking === "true" 
      ? priceSummary?.vehicleCalculationResponses?.find(
          (v: VehicleCalculationResponse) => v.vehicleNumber === (vehicle.vehicleNumbers ?? vehicle)
        )?.priceBreakDown
      : fare;
  
    // Calculate state tax
    const stateTax = priceBreakDownSource?.taxResponses?.reduce(
      (sum: number, tax: TaxResponse) => sum + tax.stateTax, 
      0
    ) || 0;
  
    // Calculate total amount with tax
    const totalAmountWithTax = (priceBreakDownSource?.totalAmount ? Number(priceBreakDownSource.totalAmount) : 0) + stateTax;
 
    return {
      vehicleNumbers: vehicle.vehicleNumbers ?? vehicle,
      totalAmount: priceBreakDownSource?.totalAmount ? Number(priceBreakDownSource.totalAmount):0 ,
      tollAndDriverAmount:
        Number(priceBreakDownSource?.tollCharges ?? 0) + 
        Number(priceBreakDownSource?.driverCharges ?? 0),
        discountedAmount: discountAmount,
      priceBreakDown: {
        basicFare: Number(priceBreakDownSource?.basicFare ?? 0),
        driverCharges: Number(priceBreakDownSource?.driverCharges ?? 0),
        tollDetails: priceBreakDownSource?.tollDetails || {},
        tollCharges: Number(priceBreakDownSource?.tollCharges ?? 0),
        gst: Number(priceBreakDownSource?.gst ?? 0),
        taxResponses: priceBreakDownSource?.taxResponses || [],
        totalAmount: totalAmountWithTax,
        platFormFees: Number(priceBreakDownSource?.platFormFees ?? 0),
        gstOnPlatformFees: Number(priceBreakDownSource?.gstOnPlatformFees ?? 0),

      },
    };
  });

  const [showTollDetails, setShowTollDetails] = useState(false);

  const handleTollDetailsToggle = () => {
    setShowTollDetails((prev) => !prev);
  };

  const [showTollDetail, setShowTollDetail] = useState<{
    [key: string]: boolean;
  }>({
    multiple: false,
  });
  const [showPlatformDetail, setShowPlatformDetail] = useState<{
    [key: string]: boolean;
  }>({
    multiple: false,
  });
  useEffect(() => {
    if (authData.isAuthenticated && authData.user?.user) {
      setPassengerInfo({
        firstName: authData.user.user.firstName || "",
        lastName: authData.user.user.lastName || "",
        email: authData.user.user.email || "",
      });
    }
  }, [authData]);
  
  const handleToggleTollDetail = (index: number) => {
    setShowTollDetail((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };


// Add this useEffect to fetch coupons when component mounts
useEffect(() => {
  if(!isReschedule ||!isMultipleBooking){
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
    const currentTotalAmount = fare?.totalAmount ??
      0;

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
  const mapBusToVehicleDto = (bus: Bus): VehicleDto => ({
    vehicleId: bus.vehicleId ?? null,
    vehicleName: bus.vehicleName,
    vehicleNumber: bus.vehicleNumber,
    seatCapacity: bus.seatCapacity,
    s3ImageUrl: bus.s3ImageUrl ?? [],
    vehicleAC: bus.vehicleAC ?? null,
    sleeper: bus.sleeper ?? "",
    image: bus.image ?? null,
    emergencyNumber: bus.emergencyNumber ?? null,
    totalAmount: bus.totalAmount ?? null,
    advanceAmt: bus.advanceAmt ?? null,
    remainingAmt: bus.remainingAmt ?? null,
    isAmountRequired: bus.isAmountRequired ?? null,
    advanceAmountNeedToPay: bus.advanceAmountNeedToPay ?? 0,
    previousAdvanceAmountPaid: bus.previousAdvanceAmountPaid ?? null,
    amtPerKM: bus.amtPerKM ?? null,
    source: bus.source ?? null,
    destination: bus.destination ?? null,
    haltLocation: bus.haltLocation ?? null,
    rating: bus.rating ?? null,
    price: bus.price,
    mileage: bus.mileage ?? null,
    isFastTagAvailable: bus.isFastTagAvailable ?? false,
    amenities: bus.amenities ?? [],
    policies: bus.policies ?? [],
    priceBreakDown: {
      basicFare: bus.priceBreakDown?.basicFare ?? 0,
      tollDetails: bus.priceBreakDown?.tollDetails ?? {},
      tollCharges: bus.priceBreakDown?.tollCharges ?? 0,
      gst: bus.priceBreakDown?.gst ?? 0,
      totalAmount: bus.priceBreakDown?.totalAmount ?? 0,
      driverCharges: bus.priceBreakDown?.driverCharges ?? 0,
    },
  });

  useEffect(() => {
    if (isMultipleBooking === "true") {
      handleMultipleBookingSummary();
    }
  }, []);
  const [showBaseFareDetails, setShowBaseFareDetails] = useState(false);

  const handleBaseFareToggle = () => {
    setShowBaseFareDetails((prev) => !prev);
  };
  
  return (
    <>
      <div className="flex min-h-screen px-4 sm:px-6 md:px-10 lg:px-20 py-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 flex-col lg:flex-row justify-between bg-[#F7F9FB]">
        <section className="flex flex-col gap-4 w-full lg:w-2/3">
          <div className="bg-white p-4 sm:p-5">
            {selectedBuses && selectedBuses.length > 0 ? (
              selectedBuses.map((bus, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg my-4 bg-white shadow-sm"
                >
                  <section className="flex flex-row items-center justify-between gap-2 border-b border-b-gray-100 pb-2">
                    <p className="text-base font-medium text-gray-800">
                      {busTitle ? busTitle : bus.vehicleName}
                    </p>
           

                  </section>

                  <p className="text-xs font-medium text-[#848484] mt-2">
                    {isACBus || sleeperCoach
                      ? `${isACBus ? isACBus : ""}${
                          isACBus && sleeperCoach ? " | " : ""
                        }${sleeperCoach ? sleeperCoach : ""}`
                      : `${
                          bus.vehicleAC && bus.vehicleAC !== null
                            ? bus.vehicleAC
                            : ""
                        }${bus.vehicleAC && bus.sleeper ? " | " : ""}${
                          bus.sleeper && bus.sleeper !== null ? bus.sleeper : ""
                        }`}
                  </p>
                </div>
              ))
            ) : selectedBus || isReschedule === "true" ? (
              <>
                <section className="flex flex-col sm:flex-row justify-between border-b border-b-gray-100 my-1.5">
                  <p className="text-normal font-medium">
                    {busTitle
                      ? busTitle
                      : selectedBus?.vehicleName
                      ? selectedBus.vehicleName
                      : ""}
                  </p>
                 
                </section>
                <p className="text-xs font-medium text-[#848484]">
                  {isACBus || sleeperCoach
                    ? `${isACBus ? isACBus : ""}${
                        isACBus && sleeperCoach && sleeperCoach ? " | " : ""
                      }${sleeperCoach ? sleeperCoach : ""}`
                    : `${
                        selectedBus?.vehicleAC &&
                        selectedBus?.vehicleAC !== null
                          ? selectedBus?.vehicleAC
                          : ""
                      }${
                        selectedBus?.vehicleAC && selectedBus?.sleeper
                          ? " | "
                          : ""
                      }${
                        selectedBus?.sleeper && selectedBus?.sleeper !== null
                          ? selectedBus?.sleeper
                          : ""
                      }`}
                </p>
              </>
            ) : (
              <p>No bus selected</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <section className="flex flex-col gap-2 bg-white p-4 sm:p-5 w-full sm:w-1/2 h-32">
              <p className="text-xs bg-[#E8F8FF] text-[#0f7bab] p-1 my-1.5 w-28 text-center">
                {newStartDate
                  ? new Date(newStartDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : new Date(fromDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
              </p>
              <TruncatedText
                text={sourceLocation ? sourceLocation : source}
                maxLength={28}
                className="text-lg font-semibold"
              />
            </section>
            <section className="flex flex-col gap-2 bg-white p-4 sm:p-5 w-full sm:w-1/2 h-32">
              <p className="text-xs bg-[#E8F8FF] text-[#0f7bab] p-1 my-1.5 w-28 text-center">
                {newEndDate
                  ? new Date(newEndDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : new Date(toDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
              </p>
              <TruncatedText
                text={destinationLocation ? destinationLocation : destination}
                maxLength={28}
                className="text-lg font-semibold"
              />
            </section>
          </div>
          {/* Coupon Section - Add this before the Proceed to Pay button */}
        

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
                      value={
                        passengerInfo.firstName ??
                       
                        ""
                      }
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
                      value={
                        passengerInfo.lastName ?? ""
                      }
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
                    value={
                      passengerInfo.email ?? ""
                    }
                    onChange={handleInputChange}
                    className="text-sm block w-full px-3 py-1 border-0 border-b-1 border-gray-300 focus:border-[#0f7bab] focus:ring-0 outline-none"
                 
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
        </section>
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-12 w-full lg:w-1/3">
          <div className="flex flex-col gap-4 sm:gap-6">
            {selectedBus || isreschedule === "true" ? (
              <section className="flex flex-col gap-6 items-center">
                <div className="bg-white p-5 w-full max-h-[400px] overflow-y-auto">
                  <p className="text-normal font-medium text-[#0f7bab]">
                    Price Summary
                  </p>
                  <div className="text-gray-800 space-y-3 py-2 font-[500]">
                    {paidAdvance ||
                    advanceToPay ||
                    balanceAmount ||
                    earlierAdvancePaid ||
                    fullTripAmount ||
                    isreschedule === "true" ||
                    extraAmountRequired ? (
                      <>
                        {fullTripAmount && (
                          <div className="flex justify-between text-sm">
                            <span>Total Trip Amount</span>
                            <span>₹ {fullTripAmount}</span>
                          </div>
                        )}

                        {paidAdvance && (
                          <div className="flex justify-between text-[14px]">
                            <span className="text-xs">Current Advance</span>
                            <span className="text-xs">₹ {paidAdvance}</span>
                          </div>
                        )}
                        {earlierAdvancePaid && (
                          <div className="flex justify-between text-sm">
                            <span className="text-xs">
                              Advance Paid Earlier
                            </span>
                            <span className="text-xs">
                              ₹ {earlierAdvancePaid}
                            </span>
                          </div>
                        )}
                        {advanceToPay && (
                          <div className="flex justify-between font-bold text-sm">
                            <span className="text-xs">Advance To Pay</span>
                            <span className="text-xs">₹ {advanceToPay}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {}
                        <div className="flex justify-between">
                          <span className="text-xs">Base Fare</span>
                          <span className="text-xs">{baseFare.toFixed(2)}</span>
                        </div>

                        {}
                        <div className="flex justify-between">
                          <span className="text-xs">GST ( 5% )</span>
                          <span className="text-xs">{gst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-xs flex items-center gap-1">
                            <span>Platform Fee</span>
                            <span
                              className="text-[15px] cursor-pointer"
                              onClick={() => {
                                setShowPlatformDetail((prev) => ({
                                  ...prev,
                                  multiple: !prev.multiple,
                                }));
                              }}
                            >
                              <MdInfoOutline className="text-[#0f7bab]" />
                            </span>
                          </div>
                          <span className="text-xs">
                            {(platFormFees + gstOnPlatformFees).toFixed(2)}
                          </span>
                        </div>

                        {showPlatformDetail.multiple && (
                          <div className="bg-gray-100 p-2 mt-2 rounded-lg text-xs flex flex-col gap-1.5">
                            <div className="flex justify-between">
                              <span>Platform Fee:</span>
                              <span>{platFormFees.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>GST on Platform Fee:</span>
                              <span>{gstOnPlatformFees.toFixed(2)}</span>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <div className="text-xs flex items-center gap-2">
                            <span>Toll Charges</span>
                            <span
                              className="text-[15px] cursor-pointer"
                              onClick={handleTollDetailsToggle}
                            >
                              <MdInfoOutline className="text-[#0f7bab]" />
                            </span>
                          </div>
                          <span className="text-xs">{tollCharges.toFixed(2)}</span>
                        </div>

                        {}
                        {showTollDetails && (
                          <>
                            {Object.keys(fare?.tollDetails || {}).length ===
                            0 ? (
                              <div className="bg-gray-100 p-2 mt-2 rounded-lg text-xs text-center">
                                Toll Details not available
                              </div>
                            ) : (
                              <div className="bg-gray-100 p-2 mt-2 rounded-lg text-xs">
                                {Object.entries(fare?.tollDetails || {}).map(
                                  ([tollName, amount]) => (
                                    <div
                                      key={tollName}
                                      className="flex justify-between border-b py-2"
                                    >
                                      <span>{tollName}</span>
                                      <span>₹{amount.toFixed(2)}</span>
                                    </div>
                                  )
                                )}

                                {/* Optional: Total toll charges */}
                                <div className="flex justify-between pt-2 mt-2 border-t font-semibold">
                                  <span>Total Toll Charges</span>
                                  <span>₹{fare?.tollCharges.toFixed(2)}</span>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        <div className="flex justify-between">
                          <span className="text-xs">Driver Fee</span>
                          <span className="text-xs">{driverCharges.toFixed(2)}</span>
                        </div>
                        {fare &&
                          Array.isArray(fare.taxResponses) &&
                          fare.taxResponses.length > 0 && (
                            <div className="flex justify-between">
                              <span className="text-xs">State Taxes</span>
                              <span className="text-xs">
                                {fare.taxResponses
                                  .reduce((sum, tax) => sum + tax.stateTax, 0)
                                  .toFixed(2)}
                              </span>
                            </div>
                          )}
                        <div className="flex justify-between">
                          <span className="text-xs">Total Amount</span>
                          <span className="text-xs">
                            {(totalAmount-discountAmount).toFixed(2)}
                         
                          </span>
                        </div>
                        {}
                        <div className="my-1.5 py-1">
  <span className="text-sm font-medium text-[#0f7bab]">
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
        className="form-radio"
        defaultChecked
        style={{ accentColor: "#0f7bab" }}
        value="full"
        onChange={handlePaymentOptionChange}
      />
      <span className="text-xs">Pay Full Amount</span>
    </label>
  </div>
</div>

                        {}
                        <div className="flex flex-col pt-3 bg-white">
                          {paymentOption === "full" && (
                            <>
                              {}
                              <div className="flex justify-between text-sm font-semibold">
                                <span>Total Amount</span>
                                <span>
                                  {" "}
                                  ₹{" "}
                                  {(
                                    totalAmount-discountAmount +
                                    (fare?.taxResponses?.reduce(
                                      (sum, tax) => sum + tax.stateTax,
                                      0
                                    ) || 0)
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </>
                          )}
                          {paymentOption === "half" && (
                            <div className="flex justify-between text-sm font-semibold">
                              <span>Total Amount</span>
                              <span>
                                ₹{" "}
                                {(
                                  (totalAmount-discountAmount) / 2 +
                                  (fare?.taxResponses?.reduce(
                                    (sum, tax) => sum + tax.stateTax,
                                    0
                                  ) || 0)
                                ).toFixed(2)}
                              </span>
                            </div>
                          )}
                          {fare &&
                            Array.isArray(fare.taxResponses) &&
                            fare.taxResponses.length > 0 && (
                              <p className="text-[11px] text-gray-500 italic">
                                Includes ₹
                                {fare.taxResponses
                                  .reduce((sum, tax) => sum + tax.stateTax, 0)
                                  .toFixed(2)}{" "}
                                as State Tax
                              </p>
                            )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </section>
            ) : (
              <>
                <section className="flex flex-col gap-6 items-center">
                  <div className="bg-white p-4 w-full max-h-[400px] overflow-y-auto">
                    <p className="text-normal font-medium text-[#0f7bab]">
                      Price summary
                    </p>
                    <div className="text-gray-800 space-y-3 py-2">
                      {priceSummary ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-xs">Base Fare</span>
                            <span className="text-xs">
                              {priceSummary.overAllPriceBreakDown.basicFare?.toFixed(
                                2
                              ) || "0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs">GST (5%)</span>
                            <span className="text-xs">
                              {priceSummary.overAllPriceBreakDown.gst?.toFixed(
                                2
                              ) || "0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <div className="text-xs flex items-center gap-1">
                              <span>Platform Fee</span>
                              <span
                                className="text-[15px] cursor-pointer"
                                onClick={handleBaseFareToggle}
                              >
                                <MdInfoOutline className="text-[#0f7bab]" />
                              </span>
                            </div>
                            <span className="text-xs">
                              {(
                                priceSummary.overAllPriceBreakDown
                                  .platFormFees +
                                priceSummary.overAllPriceBreakDown
                                  .gstOnPlatformFees
                              ).toFixed(2)}
                            </span>
                          </div>

                          {showBaseFareDetails && (
                            <div className="bg-gray-100 p-2 mt-2 rounded-lg text-xs flex flex-col gap-1.5">
                              <div className="flex justify-between">
                                <span>Platform Fee:</span>
                                <span>
                                  {priceSummary.overAllPriceBreakDown.platFormFees.toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>GST on Platform Fee:</span>
                                <span>
                                  {priceSummary.overAllPriceBreakDown.gstOnPlatformFees.toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between">
                            <div className="text-xs flex items-center gap-2">
                              <span>Toll Charges</span>
                              <span
                                className="text-[15px] cursor-pointer"
                                onClick={() =>
                                  setShowTollDetail((prev) => ({
                                    ...prev,
                                    multiple: !prev.multiple,
                                  }))
                                }
                              >
                                <MdInfoOutline className="text-[#0f7bab]" />
                              </span>
                            </div>
                            <span className="text-xs">
                              {priceSummary?.overAllPriceBreakDown
                                .tollCharges || "0.00"}
                            </span>
                          </div>

                          {/* {showTollDetail.multiple && (
  <div className="bg-gray-100 p-2 mt-2 rounded-lg text-xs">
    {Object.keys(priceSummary.overAllPriceBreakDown.tollDetails || {}).length > 0 ? (
      <div className="space-y-2 mt-2">
        {Object.keys(priceSummary.overAllPriceBreakDown.tollDetails).map((tollLocation, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-xs">{tollLocation}</span>
            <span className="text-xs">
              {priceSummary.overAllPriceBreakDown.tollDetails[tollLocation]?.toFixed(2) || "0.00"}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center text-xs text-gray-500">
        No toll details available
      </div>
    )}
  </div>
)} */}

                          {showTollDetail.multiple && (
                            <div className="bg-gray-100 p-2 mt-2 rounded-lg text-xs">
                              {Object.keys(
                                priceSummary.overAllPriceBreakDown
                                  .tollDetails || {}
                              ).length > 0 ? (
                                <div className="space-y-2 mt-2">
                                  {Object.keys(
                                    priceSummary.overAllPriceBreakDown
                                      .tollDetails
                                  ).map((tollLocation, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between"
                                    >
                                      <span className="text-xs">
                                        {tollLocation}
                                      </span>
                                      <span className="text-xs">
                                        {priceSummary.overAllPriceBreakDown.tollDetails[
                                          tollLocation
                                        ]?.toFixed(2) || "0.00"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center text-xs text-gray-500">
                                  No toll details available
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex justify-between">
                            <span className="text-xs">Driver Charges</span>
                            <span className="text-xs">
                              {priceSummary.overAllPriceBreakDown.driverCharges.toFixed(
                                2
                              ) || "0.00"}
                            </span>
                          </div>
                          {priceSummary?.overAllPriceBreakDown?.taxResponses
                            ?.length > 0 && (
                            <div className="flex justify-between">
                              <span className="text-xs">State Taxes</span>
                              <span className="text-xs">
                                {priceSummary?.overAllPriceBreakDown?.taxResponses
                                  .reduce((sum, tax) => sum + tax.stateTax, 0)
                                  .toFixed(2)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-xs">Total Amount</span>
                            <span className="text-xs">
                              {(priceSummary.overAllPriceBreakDown.totalAmount).toFixed(
                                2
                              )}
                            </span>
                          </div>
                          <div className="my-1.5 py-1">
  <span className="text-sm font-medium text-[#0f7bab]">
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
        className="form-radio"
        defaultChecked
        style={{ accentColor: "#0f7bab" }}
        value="full"
        onChange={handlePaymentOptionChange}
      />
      <span className="text-xs">Pay Full Amount</span>
    </label>
  </div>
</div>

                          <div className="pt-3">
                            {paymentOption === "full" && (
                              <div className="flex justify-between text-sm font-semibold">
                                <span>Total Amount</span>
                                <span>
                                  ₹{" "}
                                  {(
                                    priceSummary.overAllPriceBreakDown
                                      .totalAmount-discountAmount +
                                    (priceSummary.overAllPriceBreakDown.taxResponses.reduce(
                                      (sum, tax) => sum + tax.stateTax,
                                      0
                                    ) || 0)
                                  ).toFixed(2) || "0.00"}
                                </span>
                              </div>
                            )}
                            {paymentOption === "half" && (
                              <div className="flex justify-between text-sm font-semibold">
                                <span>Total Amount</span>
                                <span>
                                  ₹{" "}
                                  {(
                                    priceSummary.overAllPriceBreakDown
                                      .totalAmount /
                                      2 +
                                    (priceSummary.overAllPriceBreakDown.taxResponses.reduce(
                                      (sum, tax) => sum + tax.stateTax,
                                      0
                                    ) || 0)
                                  ).toFixed(2) || "0.00"}
                                </span>
                              </div>
                            )}
                            {priceSummary?.overAllPriceBreakDown?.taxResponses
                              ?.length > 0 && (
                              <p className="text-[11px] text-gray-500 italic">
                                Includes ₹
                                {priceSummary?.overAllPriceBreakDown?.taxResponses
                                  .reduce((sum, tax) => sum + tax.stateTax, 0)
                                  .toFixed(2)}{" "}
                                as State Tax
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <div>Loading...</div>
                      )}
                    </div>
                  </div>
                </section>
              </>
            )}
{isReschedule !== "true" && isMultipleBooking === "false" && (
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
                const currentTotalAmount = fare?.totalAmount ?? 0;
               
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
            <div className="relative">
              <button
                 onClick={(event) => {
          
            handleProceedToPay(event, paymentOption);
          
        }}
                className="w-full py-3 text-white font-normal flex justify-center items-center text-xs transition-all duration-200"
                disabled={Boolean(
                  !passengerInfo.firstName ||
                  
                    errors.firstName ||
                    errors.lastName ||
                    errors.email
                )}
                style={{
                  backgroundColor:
                  !passengerInfo.firstName ||
                
                    errors.firstName ||
                    errors.lastName ||
                    errors.email
                      ? "#D3D3D3"
                      : "#0f7bab",
                  cursor:
                  !passengerInfo.firstName ||
                 
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

              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="flex-1 py-3 gap-2 w-full bg-[#0f7bab] hover:bg-[#0f7bab] text-white mt-[9px] font-normal flex justify-center items-center text-xs transition-all duration-200  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Enquiry <MdOutlineQuestionAnswer className=" text-base" />
              </button>
            </div>
          </div>
          <section>
            <StrategyCards />
          </section>
        </div>
      </div>
   
      <EnquiryPopup
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </>
  );
};

import { useState, useEffect } from "react";
import { selectAuth, updateUserProfile } from "@/app/Redux/authSlice";
import { setBookingDetails } from "@/app/Redux/bookingSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { Bus, PriceBreakDown } from "@/app/types/list.response";
import { VehicleDto } from "@/app/types/price.response";
import { useLoader } from "@/app/context/LoaderContext";
import {
  VehiclePriceRequest,
  VehiclePriceSummaryRequest,
} from "@/app/types/calculateMultipleresponse";
import Swal from "sweetalert2";
import { TaxResponse, VehicleCalculationData, VehicleCalculationResponse } from "@/app/types/multipleCalculationresponse";
import { FareCalculationResponse } from "@/app/types/fareCalculationresponse";
import { EnquiryPopup } from "@/components/enquiry/EnquiryPopup";
import { clearSession, createSession } from "@/app/services/sessionManager";
import Link from "next/link";

function StrategyCards() {
  const strategies = [
    {
      title: "Secure Payment",
      image: "/assests/payment.png",
    },
    {
      title: "Customer Support",
      image: "/assests/customer.png",
    },
    {
      title: "Best Price",
      image: "/assests/best_price.png",
    },
  ];

  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-xl shadow-md">
      <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto scrollbar-hide">
        {strategies.map((strategy, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 text-center min-w-[100px] md:min-w-0 flex-shrink-0 transition-transform duration-300 hover:scale-105"
          >
            <img
              src={strategy.image}
              alt={strategy.title}
              className="w-12 h-12 sm:w-10 sm:h-10 object-contain"
            />
            <h3 className="text-xs sm:text-[10px] font-semibold text-gray-700 whitespace-nowrap">
              {strategy.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentPage;