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

export default function CustomerSupport() {
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
    <div className="max-w-md mx-auto p-3 space-y-3  rounded-lg shadow-md">

      {faqs.length > 0 ? (
        faqs.map((faq) => (
          <div key={faq.faqsId} className="w-full">
            {/* Category Header */}
            <button
              onClick={() => setOpenCategory(openCategory === faq.faqsId ? null : faq.faqsId)}
              className="w-full flex justify-between items-center py-2 text-[13px] font-medium text-gray-800 border-b border-gray-300"
            >
              <span className="text-gray-700">{faq.category}</span>
              <span className="text-gray-500">
                {openCategory === faq.faqsId ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
              </span>
            </button>

            {/* Questions inside each category */}
            {openCategory === faq.faqsId && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="mt-2 space-y-3"
              >
                {faq.questions.map((q, index) => (
                  <div key={index} className="py-2">
                    {/* Question Bubble */}
                    <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-[13px] font-medium shadow-sm w-fit">
                      {q.question}
                    </div>

                    {/* View Answer Button */}
                    <button
                      onClick={() =>
                        setOpenQuestions((prev) => ({
                          ...prev,
                          [faq.faqsId]: prev[faq.faqsId] === index ? null : index,
                        }))
                      }
                      className="mt-1 text-xs text-blue-500 font-semibold hover:underline"
                    >
                      {openQuestions[faq.faqsId] === index ? "Hide Answer" : "View Answer"}
                    </button>

                    {/* Answer Bubble */}
                    {openQuestions[faq.faqsId] === index && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-[13px] shadow-sm w-fit mt-1"
                      >
                        {q.answer.split("\n").map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400 text-sm">No FAQs available</div>
      )}
    </div>
  
  
  );
}
