"use client";
import { motion } from "framer-motion";
// import { FaGoogle } from "react-icons/fa";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";

import loginBanner from "../../public/assests/nandhu-bus.png";
import logo_img from "../../app/assests/images/nandu tours and travels logo png.png";

import { useLogin } from "@/app/hooks/login/useLogin";
import { useSendOTP } from "@/app/services/data.service";
import { useLanguage } from "@/app/context/language-context";
import { useRouter } from "next/navigation";
import { useLoader } from "@/app/context/LoaderContext";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const {
    otpSent,
    resendTimer,
    setResendTimer,
    handleVerifyOtp,
    phoneNumber,
    setVerifying,
    error,
    verifying,
    otpMessage,
    setError,
    handleResendOTP,
    setOtpSent,
    handleSendOTP,
    setPhoneNumber,
  } = useLogin();
  const { isPending } = useSendOTP();
    const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, resendTimer, setResendTimer]); // Added setResendTimer
  const { errorMessage, setErrorMessage } = useLoader();
  return (
    <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50">
      <motion.div
        className="bg-white shadow-lg flex flex-col md:flex-row w-full max-w-sm md:max-w-2xl min-h-[50vh] md:min-h-[50vh] justify-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
      >
        <div className="hidden md:flex flex-col justify-center items-center bg-[#3891b8] p-8 w-1/2  relative">
          <Image
            src={loginBanner}
            alt="Login"
            layout="fill"
            objectFit="contain"
            className="absolute"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 relative">
          <button
            className="absolute top-3 right-3 text-gray-900 cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>

          <div className="flex flex-col">
            <Image
            src={logo_img}
            alt="Logo"
              width={100}
              height={100}
              className="w-16 mx-auto mb-3"
            />

            <h2 className="text-md font-semibold text-center text-[#0f7bab]">
            {t('loginDiscountMessage')}
                        </h2>

            {otpSent ? (
              <Formik
              initialValues={{ otp: "" }}
              enableReinitialize
              validationSchema={Yup.object({
                otp: Yup.string()
                  .matches(/^\d{6}$/, "Invalid OTP")
                  .required("Required"),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                setVerifying(true);
                const verified = await handleVerifyOtp(
                  phoneNumber,
                  values.otp,
                  onClose
                );
                if (!verified) 
                
                  console.log("OTP verification failed :");
                setVerifying(false);
                setSubmitting(false);
              }}
            >
              {({ handleSubmit, setFieldValue,setFieldTouched, values }) => (
                <Form onSubmit={handleSubmit}>
                  <div>
                    <p className="text-green-500 text-sm text-center">
                      {t('otpSentTo')} {phoneNumber}
                    </p>
                    <label className="text-gray-600 text-xs">{t('enterOtp')}</label>
                    <Field
                      type="text"
                      name="otp"
                      placeholder={t('enterOtp')}
                      className="p-2 border rounded-md w-full mt-1"
                      maxLength={6}
                      value={values.otp} 
                      onInput={()=>{setErrorMessage("")}}// Ensure this value is from Formik's state
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue("otp", e.currentTarget.value.replace(/\D/g, "").slice(0, 6));
                       // Update the value using Formik's setFieldValue
                      }}
                    />
                    
                    <ErrorMessage
                      name="otp"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />

                    {errorMessage && (
                      <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                    )}
                     
                  </div>
            
                  <button
                    type="submit"
                    className="bg-[#0f7bab] text-white py-2 mt-4 rounded-lg w-full font-semibold"
                    disabled={verifying}
                  >
                    {verifying ? t('verifying') : t('verifyOtp')}
                  </button>
                  {otpMessage && (
                    <p className="text-green-500 text-sm text-center">
                      {t('otpResentSuccess')}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-3 text-sm">
                    <button
                      type="button"
                      className="text-blue-600"
                      onClick={() => {setOtpSent(false); setFieldValue("otp", "");setErrorMessage("");setError("");setFieldValue("phoneNumber", "");}}
                    >
                      {t('changeNumber')}
                    </button>
                    <button
  type="button"
  className={`${
    resendTimer === 0
      ? "text-[#0f7bab] font-medium cursor-pointer"
      : "text-gray-500 cursor-not-allowed"
  }`}
  onClick={(event) => {
    handleResendOTP(event);
    setError(""); // Clear any previous errors
    setFieldValue("otp", ""); // Clear the field
    setTimeout(() => {
      setFieldTouched("otp", false);
    }, 0);
  }}

  disabled={resendTimer > 0}
>
  {t('resendOtp')} {resendTimer > 0 ? `(${resendTimer}s)` : ""}
</button>
                  </div>
                </Form>
              )}
            </Formik>
            
            ) : (
              <Formik
                initialValues={{ phoneNumber: "" }}
                validationSchema={Yup.object({
                  phoneNumber: Yup.string()
                    .matches(/\d{10}/, "Invalid phone number")
                    .required("Required"),
                })}
                onSubmit={async (values, { setSubmitting }) => {
                  const otpSent = await handleSendOTP(values.phoneNumber);
                  if (otpSent) {
                    setPhoneNumber(values.phoneNumber);
                    setResendTimer(30);
                  }
                  setSubmitting(false);
                }}
              >
                {({ handleSubmit,setFieldValue }) => (
                  <Form onSubmit={handleSubmit}>
                    <div className="mt-4">
                      <label className="text-gray-600 text-xs">
                      {t('mobileNumber')}
                      </label>
                      <div className="flex border rounded-lg overflow-hidden mt-1">
                        <span className="px-3 py-2 bg-gray-200 border-r text-gray-600 text-sm">
                          +91
                        </span>
                        <Field
                          type="tel"
                          name="phoneNumber"
                          placeholder={t('enterMobileNumber')}
                          className="p-0.5 text-sm flex-grow outline-none"
                          maxLength={10}
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.currentTarget.value = e.currentTarget.value
                              .replace(/\D/g, "")
                              .slice(0, 10);
                              setFieldValue("otp","");
                              setErrorMessage("");
                          }}
                        />
                      </div>

                    
{error && (
  <p className="text-red-500 text-xs mt-1">{error}</p>
)}
                    </div>

                    <button
                      type="submit"
                      className="bg-[#0f7bab] text-white text-sm py-2 mt-4 rounded-md w-full font-semibold cursor-pointer"
                    >
                     {isPending ? t('sending') : t('generateOtp')}
                    </button>
                  </Form>
                )}
              </Formik>
            )}

            <p className="text-xs text-center text-gray-400 mt-8">
            {t('termsAgreement1')}{" "}
            <span
        className="text-[#0f7bab] cursor-pointer"
        onClick={() => {
          onClose();
          router.push('/terms-and-conditions');
        }}      >
        {t('termsConditions')}
      </span>{" "}
      and{" "}
      <span
        className="text-[#0f7bab] cursor-pointer"
        onClick={() => {
          onClose();
          router.push('/privacy');
        }}      >
        {t('privacyPolicy')}
      </span>
              .
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
