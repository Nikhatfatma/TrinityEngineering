"use client";

import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Phone } from "lucide-react";

interface PhoneInputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  error?: string;
  placeholder?: string;
}

export default function PhoneInputField({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  invalid = false,
  error,
  placeholder = "+1 (555) 000-0000",
}: PhoneInputFieldProps) {
  return (
    <div className="space-y-0.5 w-full phone-input-container">
      {label && (
        <label
          htmlFor={name}
          className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
        >
          <Phone className="text-primary dark:text-accent w-3 h-3" />
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <PhoneInput
          country={"us"}
          value={value}
          onChange={(val) => onChange({ target: { name, value: `+${val}` } })}
          disabled={disabled}
          placeholder={placeholder}
          inputProps={{
            name: name,
            required: required,
            id: name,
          }}
          containerClass="w-full"
          inputClass={`!w-full !bg-gray-50 dark:!bg-background-dark !border !rounded-lg !px-12 !py-2 !text-xs !text-gray-900 dark:!text-white placeholder-gray-400 dark:placeholder-gray-500 focus:!outline-none focus:!ring-2 focus:!border-transparent !transition-all ${
            invalid
              ? "!border-red-500 !focus:ring-red-500 dark:!border-red-400 dark:!focus:ring-red-400"
              : "!border-gray-200 !focus:ring-primary dark:!border-gray-700 dark:!focus:ring-accent"
          } ${disabled ? "!opacity-60 !cursor-not-allowed" : ""}`}
          buttonClass="!bg-transparent !border-none !rounded-l-lg hover:!bg-gray-100 dark:hover:!bg-gray-800"
          dropdownClass="dark:!bg-background-dark dark:!text-white"
        />
      </div>
      {error && (
        <p className="text-[10px] text-red-500 font-semibold">
          {error}
        </p>
      )}
      <style jsx global>{`
        .phone-input-container .react-tel-input .form-control {
          height: auto !important;
          line-height: normal !important;
        }
        .phone-input-container .react-tel-input .flag-dropdown {
          background: transparent !important;
          border: none !important;
          padding: 0 8px !important;
        }
        .phone-input-container .react-tel-input .selected-flag {
          background: transparent !important;
          padding: 0 0 0 8px !important;
        }
        .phone-input-container .react-tel-input .selected-flag:hover {
           background: transparent !important;
        }
        .dark .phone-input-container .react-tel-input .flag-dropdown .country-list {
          background-color: #1a1a1a !important;
          color: #ffffff !important;
        }
        .dark .phone-input-container .react-tel-input .flag-dropdown .country-list .country:hover {
          background-color: #333333 !important;
        }
        .dark .phone-input-container .react-tel-input .flag-dropdown .country-list .country.highlight {
          background-color: #333333 !important;
        }
      `}</style>
    </div>
  );
}
