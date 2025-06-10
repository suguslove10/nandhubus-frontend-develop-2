"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { AiOutlineCloseCircle, AiOutlineWarning } from "react-icons/ai";

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  buttonText: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  open,
  onClose,
  title,
  content,
  buttonText,
}) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="relative w-full max-w-sm bg-white rounded-lg shadow-xl p-6 transform transition-all">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              >
                <AiOutlineCloseCircle className="w-6 h-6" />
              </button>

              {/* Error Icon */}
              <div className="flex flex-col items-center justify-center">
                <AiOutlineWarning className="w-16 h-16 text-red-500 animate-pulse" />

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-800 mt-4">
                  {title}
                </h2>

                {/* Content */}
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {content}
                </p>

                {/* Action Button */}
                <button
                  onClick={onClose}
                  className="mt-6 w-full bg-red-600 text-white font-medium text-xs uppercase py-3 rounded-full shadow-lg hover:bg-red-700 transition"
                >
                  {buttonText}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ErrorModal;
