"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useGetAllFaqs } from "@/app/services/data.service";
import toast from "react-hot-toast";

interface FAQ {
  faqsId: string;
  category: string;
  questions: {
    question: string;
    answer: string;
  }[];
}

export interface FAQResponse {
  faqs: FAQ[];
}

export default function FAQSection() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestions, setOpenQuestions] = useState<{ [key: string]: number | null }>({}); // Store open questions per category

  // Fetch FAQs from API
  const { data, isLoading, isError } = useGetAllFaqs();

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading FAQs...</div>;
  }

  if (isError) {
    toast.error("Failed to load FAQs");
    return <div className="text-center text-red-500">Error fetching FAQs</div>;
  }

  // Ensure proper mapping
  const faqs: FAQ[] = Array.isArray(data)
    ? data.map((faq: any) => ({
        faqsId: faq.faqsId ?? Math.random().toString(),
        category: faq.category ?? "Unknown Category",
        questions: Array.isArray(faq.questions) ? faq.questions : [],
      }))
    : [];

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 flex flex-col items-center justify-center mt-10 md:mt-0">
      <h2 className=" text-xl md:text-2xl font-bold text-[#0f7bab] text-center">
        Frequently Asked Questions
      </h2>

      {faqs.length > 0 ? (
        faqs.map((faq) => (
          <div key={faq.faqsId} className="border-b mt-4 w-full max-w-sm md:max-w-3xl">
            {/* Category Header */}
            <button
              onClick={() => setOpenCategory(openCategory === faq.faqsId ? null : faq.faqsId)}
              className="w-full flex justify-between items-center py-3 text-md md:text-lg font-semibold text-gray-900 cursor-pointer"
            >
              <span className="text-md font-medium text-gray-700">
                {faq.category}
              </span>
              <span>{openCategory === faq.faqsId ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
            </button>

            {/* Questions inside each category */}
            {openCategory === faq.faqsId && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
                className="p-3 space-y-2"
              >
                {faq.questions.map((q, index) => (
                  <div key={index} className={`pb-2 text-gray-700 text-left ${index !== faq.questions.length - 1 ? "border-b" : ""}`}>
                    <button
                      onClick={() =>
                        setOpenQuestions((prev) => ({
                          ...prev,
                          [faq.faqsId]: prev[faq.faqsId] === index ? null : index,
                        }))
                      }
                      className="w-full flex justify-between items-center text-gray-700 text-sm md:text-md font-medium cursor-pointer"
                    >
                      {q.question}
                      <span>{openQuestions[faq.faqsId] === index ? "-" : "+"}</span>
                    </button>
                    {openQuestions[faq.faqsId] === index && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-gray-600 mt-1 text-left text-xs md:text-sm"
                      >
                        {q.answer.split("\n").map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </motion.p>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No FAQs available</div>
      )}
    </div>
  );
}
