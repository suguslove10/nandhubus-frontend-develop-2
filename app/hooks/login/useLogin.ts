import {
  loginService,
  resendOtpRequest,
  useSendOTP,
  useValidateOTP,
} from "@/app/services/data.service";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/app/Redux/authSlice";
import { isPending } from "@reduxjs/toolkit";
import { ILoginResponse } from "@/app/types/loginResponse.type";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useLoader } from "@/app/context/LoaderContext";

export const useLogin = () => {
  const router = useRouter();

  const [otpSent, setOtpSent] = useState(false);

  const [otpMessage, setOtpMessage] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");

  const [resendTimer, setResendTimer] = useState(30);

  const [verifying, setVerifying] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const { mutate: sendOTP } = useSendOTP();
  const { mutate: verifyOTP } = useValidateOTP();

  const handleSendOTP = async (mobile: string): Promise<boolean> => {
    try {
      sendOTP(mobile, {
        onSuccess: (data) => {
          if (data && (data as { type?: string }).type === "error") {
            setError("An error occurred while sending OTP.");
            return;
          }
          setOtpSent(true);
          setPhoneNumber(mobile);
          setResendTimer(30);
          setError("");
        },
        onError: (error) => {
          setError(error.message);
        },
      });
      return true;
    } catch {
      return false;
    }
  };

  const handleResendOtpRequest = async (
    phoneNumber: string
  ): Promise<{ type: string }> => {
    try {
      const res = await resendOtpRequest(phoneNumber);
      return res as unknown as { type: string };
    } catch (error) {
      throw error;
    }
  };

  const handleVerifyOtp = async (
    mobile: string,
    otp: string,
    onClose: () => void
  ): Promise<boolean> => {
    try {
      // Use a Promise to properly handle async flow
      return new Promise((resolve) => {
        verifyOTP(
          { mobile, otp },
          {
            onSuccess: async (data: unknown) => {
              const {
                userType,
              }: { message: string; statusCode: number; userType: string } =
                data as { message: string; statusCode: number; userType: string };
              
             
              setError("");
              
              userLogin.mutate(
                { mobile, userType },
                {
                  onSuccess: () => {
                    onClose();
                    resolve(true); // Resolve with true on success
                  },
                  onError: (error) => {
                    resolve(false); // Resolve with false on login error
                  },
                }
              );
            },
            onError: (error:any) => {
              setError("Invalid OTP");
              setErrorMessage(error.response?.data?.message || error.message);
             
              resolve(false); // Resolve with false on OTP validation error
            },
          }
        );
      });
    } catch (error) {
      return false;
    }
  };
  const { errorMessage, setErrorMessage } = useLoader();

  const userLogin = useMutation({
    mutationFn: loginService,
    onSuccess: (res: ILoginResponse) => {
      if (!res || !res.authTokenResponse) {
        setErrorMessage("Login failed. No token received.");
        return;
      }
  
      const accessToken = res.authTokenResponse.accessToken;
      dispatch(login(res));
  
      const userType = res.user.userType;
      setCookie("userType", userType);
  
      localStorage.setItem("accessToken", accessToken);
      if (userType === "admin") {
        router.push("/admin/dashboard");
      }
      setErrorMessage(null); // Clear the error
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || error.message || "An unknown error occurred";
      setErrorMessage(errorMsg);
      console.error("Login error:", errorMsg);
    },
  });

  const handleResendOTP = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (resendTimer === 0) {
      const res = await handleResendOtpRequest(phoneNumber);
      if (res && res.type === "error") {
        setError("Cant resend otp");
        return;
      }
      setError("");
      setResendTimer(30);
      setOtpMessage(true);
      setTimeout(() => setOtpMessage(false), 2000);
    }
  };

  return {
    otpSent,
    otpMessage,
    phoneNumber,
    resendTimer,
    verifying,
    error,
    userLogin,
    handleSendOTP,
    handleVerifyOtp,
    handleResendOTP,
    setVerifying,
    setResendTimer,
    setError,
    setOtpSent,
    setPhoneNumber,
    isPending,
    errorMessage,
  };
};
