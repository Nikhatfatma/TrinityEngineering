"use client";

import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: "text" | "email" | "tel" | "date" | "number";
  placeholder?: string;
  required?: boolean;
  icon?: string;
  disabled?: boolean;
  invalid?: boolean;
  error?: string;
}

export default function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  icon,
  disabled = false,
  invalid = false,
  error,
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
      >
        {icon && (
          <span className="material-symbols-outlined text-primary dark:text-accent text-sm">
            {icon}
          </span>
        )}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full bg-gray-50 dark:bg-background-dark border rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          invalid
            ? "border-red-500 focus:ring-red-500 dark:focus:ring-red-400"
            : "border-gray-200 dark:border-gray-700"
        }`}
      />
      {error && (
        <p className="text-xs text-red-500 font-semibold mt-0.5">{error}</p>
      )}
    </div>
  );
}
