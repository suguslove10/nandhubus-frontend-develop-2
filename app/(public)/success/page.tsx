"use client";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaHome, FaListAlt } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";

const PaymentSuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Restore auth state if lost
    const savedAuth = localStorage.getItem('authBackup');
    if (savedAuth) {
      const { token, user } = JSON.parse(savedAuth);
      // Update your auth context (e.g., via login function)
      localStorage.removeItem('authBackup');
    }
  }, []);
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  // Clean up session storage and show confetti
  useEffect(() => {
    sessionStorage.removeItem("origin");
    sessionStorage.removeItem("destination");
    sessionStorage.removeItem("startDate");
    sessionStorage.removeItem("endDate");
    sessionStorage.removeItem("vehicleHoldKeys");

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleSeeDetails = () => {
    router.push("/myaccount/mytrips");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[99999] overflow-hidden">
      {/* Confetti effect */}
      {showConfetti && width && height && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      {/* Back button */}
      <button
        onClick={handleGoHome}
        className="absolute top-4 left-4 flex items-center text-[#0f7bab] hover:text-[#0a5a7a] transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Home
      </button>

      {/* Main content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md p-6 text-center"
      >
        {/* Check icon with animation */}
        <motion.div
          variants={itemVariants}
          className="my-6 flex justify-center"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 10,
              }}
            >
              <FaCheckCircle className="text-green-500 text-6xl" />
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-full bg-green-100 opacity-0"
              animate={{
                opacity: [0, 0.3, 0],
                scale: [1, 1.5, 2],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Title with animation */}
        <motion.h2
          variants={itemVariants}
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          Booking Confirmed!
        </motion.h2>

        {/* Subtitle with animation */}
        <motion.p
          variants={itemVariants}
          className="text-gray-600 mb-6 text-sm"
        >
          Thank you for choosing us. Your booking has been successfully confirmed.
        </motion.p>

        {/* Booking ID with animation */}
        <motion.div
          variants={itemVariants}
          className="bg-blue-50 rounded-lg p-4 mb-6"
        >
          <p className="text-sm text-gray-600">Booking Reference</p>
          <p className="text-lg font-semibold text-[#0f7bab]">{bookingId}</p>
        </motion.div>

        {/* Buttons with animations */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
        >
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 bg-[#0f7bab] text-white py-3 px-6 rounded-full text-sm font-medium"
          >
            <FaHome />
            Go to Home
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleSeeDetails}
            className="flex items-center justify-center gap-2 border border-[#0f7bab] text-[#0f7bab] py-3 px-6 rounded-full text-sm font-medium"
          >
            <FaListAlt />
            View Booking Details
          </motion.button>
        </motion.div>

        {/* Additional information */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-xs text-gray-500"
        >
          <p>We've sent the booking details to your email.</p>
          <p className="mt-1">
            Need help?{" "}
            <button
              onClick={() => router.push("/contact")}
              className="text-[#0f7bab] hover:underline"
            >
              Contact Support
            </button>
          </p>
        </motion.div>
      </motion.div>

      {/* Floating celebration elements */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * (width || 0),
                  y: -50,
                  rotate: 0,
                }}
                animate={{
                  y: height || 0,
                  rotate: 360,
                  x: [
                    Math.random() * (width || 0) * 0.2,
                    Math.random() * (width || 0) * 0.4,
                    Math.random() * (width || 0) * 0.6,
                  ],
                }}
                transition={{
                  duration: 3 + Math.random() * 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  opacity: 0.7,
                }}
              >
                {["🎉", "✨", "👍", "🚌"][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentSuccessPage;