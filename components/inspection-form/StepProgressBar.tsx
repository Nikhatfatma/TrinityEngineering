"use client";

import { Check } from "lucide-react";

interface Step {
  title: string;
  icon: React.ElementType;
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
    <div className="w-full mb-3 px-2">
      <div className="relative flex justify-between items-start">
        {/* Background Line */}
        <div className="absolute top-[14px] left-0 w-full h-[2px] bg-gray-200 dark:bg-gray-700 rounded-full" />

        {/* Active Progress Line — green for completed, transitions to blue at active */}
        <div
          className="absolute top-[14px] left-0 h-[2px] rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
            background: currentStep > 0
              ? `linear-gradient(to right, #22c55e 0%, #22c55e ${((currentStep - 1) / currentStep) * 100}%, #2563eb 100%)`
              : "#2563eb",
          }}
        />

        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const StepIcon = step.icon;

          return (
            <div
              key={index}
              className="flex flex-col items-center relative z-10"
              style={{ width: `${100 / steps.length}%` }}
            >
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                  isActive
                    ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)] ring-3 ring-blue-400/30 scale-110"
                    : isCompleted
                    ? "bg-green-500 text-white shadow-sm"
                    : "bg-white dark:bg-section-dark border-2 border-gray-300 dark:border-gray-600 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : (
                  <StepIcon className="w-3.5 h-3.5" />
                )}

                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
                )}
              </button>
              <span
                className={`text-[9px] font-bold mt-1 transition-colors uppercase tracking-wide text-center leading-tight ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : isCompleted
                    ? "text-green-600 dark:text-green-400"
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
  );
}
