"use client";

import React from "react";

interface Step {
  title: string;
  icon: string;
}

interface StepProgressBarProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function StepProgressBar({
  steps,
  currentStep,
  onStepClick,
}: StepProgressBarProps) {
  return (
    <div className="mb-12">
      <div className="relative max-w-5xl mx-auto">
        {/* Background connecting line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

        {/* Active progress line */}
        <div
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-green-500 via-primary to-accent transition-all duration-700 ease-out hidden md:block"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        ></div>

        {/* Steps */}
        <div className="relative flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const isClickable = onStepClick && index < currentStep;

            return (
              <div
                key={index}
                className={`flex flex-col items-center relative z-10 ${
                  isClickable ? "cursor-pointer" : ""
                }`}
                onClick={() => isClickable && onStepClick(index)}
              >
                {/* Circle */}
                <div
                  className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 transition-all duration-500 ${
                    isCompleted
                      ? "bg-green-500 shadow-lg shadow-green-500/30"
                      : isActive
                      ? "bg-primary dark:bg-accent shadow-xl shadow-primary/40 dark:shadow-accent/40 scale-110"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-lg md:text-xl transition-all ${
                      isCompleted || isActive ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {isCompleted ? "check" : step.icon}
                  </span>

                  {/* Pulse animation for active step */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-primary dark:bg-accent animate-ping opacity-20"></span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] md:text-xs font-bold mt-2 md:mt-3 text-center max-w-[70px] md:max-w-[90px] leading-tight transition-colors ${
                    isCompleted || isActive
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile step indicator */}
      <div className="md:hidden mt-4 text-center">
        <span className="text-sm font-bold text-primary dark:text-accent">
          Step {currentStep + 1} of {steps.length}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
          — {steps[currentStep].title}
        </span>
      </div>
    </div>
  );
}
