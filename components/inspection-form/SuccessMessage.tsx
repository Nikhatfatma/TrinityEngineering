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
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-section-dark rounded-2xl max-w-sm mx-auto text-center animate-in fade-in zoom-in duration-500">
      <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
        <CheckCircle className="w-7 h-7 text-green-500" />
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Inspection Request Submitted
      </h2>
      
      <p className="text-[13px] text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        You have been submitted successfully. You should receive a confirmation email shortly and we will schedule with the contacts you have provided.
      </p>

      <div className="flex flex-col w-full gap-2.5">
        <button
          onClick={() => router.push("/")}
          className="w-full bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-xs"
        >
          <span className="material-symbols-outlined text-lg">home</span>
          Return to Home
        </button>
        
        <button
          onClick={onReset}
          className="w-full bg-white dark:bg-background-dark text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold py-2.5 px-6 rounded-xl transition-all border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 flex items-center justify-center gap-2 text-xs"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>
          Submit Another Request
        </button>
      </div>
    </div>
  );
}
