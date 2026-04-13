"use client";

import React, { forwardRef } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ElementType;
  invalid?: boolean;
  error?: string;
  optional?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, name, type = "text", placeholder = "", required = false, icon: Icon, disabled = false, invalid = false, error, optional, ...props }, ref) => {
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
            {optional && <span className="text-gray-400 dark:text-gray-500 text-[9px] font-normal italic ml-0.5">(Optional)</span>}
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
                ? "border-gray-400 focus:ring-gray-300 dark:border-gray-600 dark:focus:ring-gray-600"
                : "border-gray-200 focus:ring-primary dark:border-gray-700 dark:focus:ring-accent"
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          />
        </div>
        {error && (
          <p className="text-[10px] text-gray-900 font-black bg-gray-200/80 backdrop-blur-sm px-1.5 py-0.5 rounded mt-0.5 inline-block border border-gray-300/50">
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
