import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import alert_img from "../../app/assests/images/not_right.png";

interface WarningModalProps {
  warningModalOpen: boolean;
  setWarningModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function WarningModal({
  setWarningModalOpen,
  warningModalOpen,
}: WarningModalProps) {
  // Function to refresh the page
  const handleRefresh = () => {
    window.location.reload();
    
  };

  if (!warningModalOpen) return null;

  return (
    <>
      {/* Background Overlay */}
      <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40" />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  max-w-[90%] md:max-w-[600px] w-full lg:max-w-[800px] h-auto md:h-[300px] bg-white flex rounded-lg shadow-lg z-50 md:flex-row flex-col p-4"
      >
        <div className="p-10 px-20 flex justify-center items-center ">
          <Image
            src={alert_img}
            alt="something went wrong"
            className="w-[100px] h-[100px] md:w-[150px] md:h-[150px]"
            width={150}
            height={150}
          />
        </div>

        {/* Right side with the text */}
        <div className="flex-1 flex flex-col justify-center items-center md:items-start p-4">
          <h3 className="md:text-2xl text-lg font-semibold mb-4 text-gray-800 md:text-left text-center ">
            Sorry, something went wrong
          </h3>
          <p className="mb-4 text-gray-500 md:text-left text-center">
            These buses are not available. Try booking a different bus.
          </p>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 text-white py-2 px-4 rounded max-w-[150px] text-sm cursor-pointer"
          >
            Refresh Page
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default WarningModal;
