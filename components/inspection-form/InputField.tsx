"use client";

import React, { forwardRef } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ElementType;
  invalid?: boolean;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, name, type = "text", placeholder = "", required = false, icon: Icon, disabled = false, invalid = false, error, ...props }, ref) => {
    return (
      <div className="space-y-0.5 w-full">
        {label && (
          <label
            htmlFor={name}
            className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
          >
            {Icon && (
              <Icon className="text-primary dark:text-accent w-3 h-3" />
            )}
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            {...props}
            ref={ref}
            id={name}
            name={name}
            type={type}
            required={required}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full bg-gray-50 dark:bg-background-dark border rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
              invalid
                ? "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400"
                : "border-gray-200 focus:ring-primary dark:border-gray-700 dark:focus:ring-accent"
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          />
        </div>
        {error && (
          <p className="text-[10px] text-red-500 font-semibold">
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
