"use client";

import React from "react";
import InputField from "./InputField";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

interface AddressGroupProps {
  streetAddress: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  prefix?: string;
  errors?: Partial<Record<string, string>>;
}

export default function AddressGroup({
  streetAddress,
  addressLine2,
  city,
  state,
  zip,
  onChange,
  prefix = "",
  errors = {},
}: AddressGroupProps) {
  const namePrefix = prefix ? `${prefix}_` : "";
  const getError = (fieldName: string) => errors[`${namePrefix}${fieldName}`];

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        <span className="material-symbols-outlined text-primary dark:text-accent text-sm">location_on</span>
        Inspection Address
      </h4>

      <div className="grid grid-cols-1 gap-3">
        <InputField
          label="Street Address"
          name={`${namePrefix}streetAddress`}
          value={streetAddress}
          onChange={onChange}
          placeholder="123 Main Street"
          required
          icon="home"
          invalid={!!getError("streetAddress")}
          error={getError("streetAddress")}
        />
        <InputField
          label="Address Line 2"
          name={`${namePrefix}addressLine2`}
          value={addressLine2}
          onChange={onChange}
          placeholder="Apt, Suite, Unit, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <InputField
          label="City"
          name={`${namePrefix}city`}
          value={city}
          onChange={onChange}
          placeholder="City"
          required
          invalid={!!getError("city")}
          error={getError("city")}
        />

        {/* State dropdown */}
        <div className="space-y-1">
          <label
            htmlFor={`${namePrefix}state`}
            className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
          >
            State <span className="text-red-500">*</span>
          </label>
          <select
            id={`${namePrefix}state`}
            name={`${namePrefix}state`}
            value={state}
            onChange={onChange}
            required
            className={`w-full bg-gray-50 dark:bg-background-dark border rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all cursor-pointer ${
              getError("state")
                ? "border-red-500 focus:ring-red-500 dark:focus:ring-red-400"
                : "border-gray-200 dark:border-gray-700 focus:ring-primary dark:focus:ring-accent"
            }`}
          >
            <option value="">Select State</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {getError("state") && (
            <p className="text-xs text-red-500 font-semibold -mt-1">
              {getError("state")}
            </p>
          )}
        </div>

        <InputField
          label="Zip Code"
          name={`${namePrefix}zip`}
          value={zip}
          onChange={onChange}
          placeholder="12345"
          required
          invalid={!!getError("zip")}
          error={getError("zip")}
        />
      </div>
    </div>
  );
}
