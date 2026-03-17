"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface SuccessMessageProps {
  onReset: () => void;
}

export default function SuccessMessage({ onReset }: SuccessMessageProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-section-dark rounded-2xl shadow-xl max-w-md mx-auto text-center border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Inspection Request Submitted
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
        Your inspection request has been submitted successfully. Our engineering team will review your details and contact you shortly.
      </p>

      <div className="flex flex-col w-full gap-3">
        <button
          onClick={() => router.push("/")}
          className="w-full bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">home</span>
          Return to Home
        </button>
        
        <button
          onClick={onReset}
          className="w-full bg-white dark:bg-background-dark text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold py-3 px-6 rounded-xl transition-all border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">refresh</span>
          Submit Another Request
        </button>
      </div>
    </div>
  );
}
