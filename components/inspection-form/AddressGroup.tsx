"use client";

import React, { useState } from "react";
import InputField from "./InputField";
import { MapPin, Home, Hash, Building2, Globe } from "lucide-react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

import SectionHeader from "./SectionHeader";

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

const libraries: ("places")[] = ["places"];

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
  
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries,
  });

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      let streetNum = "";
      let route = "";
      let cityName = "";
      let stateCode = "";
      let zipCode = "";
      let subPremise = "";

      place.address_components.forEach((component: any) => {
        const types = component.types;
        if (types.includes("street_number")) streetNum = component.long_name;
        if (types.includes("route")) route = component.long_name;
        if (types.includes("locality")) cityName = component.long_name;
        if (types.includes("administrative_area_level_1")) stateCode = component.short_name;
        if (types.includes("postal_code")) zipCode = component.long_name;
        if (types.includes("subpremise")) subPremise = component.long_name;
      });

      const fullStreet = `${streetNum} ${route}`.trim();

      const updateField = (name: string, value: string) => {
        onChange({
          target: {
            name: `${namePrefix}${name}`,
            value: value,
          },
        } as React.ChangeEvent<HTMLInputElement>);
      };

      if (fullStreet) updateField("streetAddress", fullStreet);
      if (cityName) updateField("city", cityName);
      if (stateCode && US_STATES.includes(stateCode)) updateField("state", stateCode);
      if (zipCode) updateField("zip", zipCode);
      if (subPremise) updateField("addressLine2", subPremise);
    }
  };

  return (
    <div className="space-y-1.5 address-group-container">
      <SectionHeader title="Property Address" icon={MapPin} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoaded ? (
          <Autocomplete
            onLoad={(ac) => setAutocomplete(ac)}
            onPlaceChanged={onPlaceChanged}
            options={{
              componentRestrictions: { country: "us" },
              types: ["address"],
              fields: ["address_components", "geometry", "formatted_address"],
            }}
          >
            <InputField
              label="Street Address"
              name={`${namePrefix}streetAddress`}
              value={streetAddress}
              onChange={onChange}
              placeholder="123 Main St"
              required
              icon={Home}
              invalid={!!getError("streetAddress")}
              error={getError("streetAddress")}
              autoComplete="off"
            />
          </Autocomplete>
        ) : (
          <InputField
            label="Street Address"
            name={`${namePrefix}streetAddress`}
            value={streetAddress}
            onChange={onChange}
            placeholder="123 Main St"
            required
            icon={Home}
            invalid={!!getError("streetAddress")}
            error={getError("streetAddress")}
            autoComplete="off"
          />
        )}
        <InputField
          label="Apt/Suite"
          name={`${namePrefix}addressLine2`}
          value={addressLine2}
          onChange={onChange}
          placeholder="Unit #, Suite, etc."
          icon={Hash}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="City"
          name={`${namePrefix}city`}
          value={city}
          onChange={onChange}
          placeholder="New York"
          required
          icon={Building2}
          invalid={!!getError("city")}
          error={getError("city")}
        />

        <div className="space-y-0.5">
          <label
            htmlFor={`${namePrefix}state`}
            className="text-[10px] font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1"
          >
            <Globe className="text-primary dark:text-accent w-3 h-3" />
            State
          </label>
          <select
            id={`${namePrefix}state`}
            name={`${namePrefix}state`}
            value={state}
            onChange={onChange}
            className={`w-full bg-gray-50 dark:bg-background-dark border rounded-lg px-3 py-2 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all cursor-pointer ${
              getError("state")
                ? "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400"
                : "border-gray-200 focus:ring-primary dark:border-gray-700 dark:focus:ring-accent"
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
            <p className="text-[10px] text-red-500 font-semibold -mt-0.5">
              {getError("state")}
            </p>
          )}
        </div>

        <InputField
          label="Zip Code"
          name={`${namePrefix}zip`}
          value={zip}
          onChange={onChange}
          placeholder="10001"
          required
          icon={MapPin}
          invalid={!!getError("zip")}
          error={getError("zip")}
        />
      </div>
      <style jsx global>{`
        .pac-container {
          z-index: 9999 !important;
          border-radius: 0.5rem;
          margin-top: 2px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          font-family: inherit;
        }
        .dark .pac-container {
          background-color: #1f2937 !important;
          border-color: #374151 !important;
          color: #ffffff !important;
        }
        .pac-item {
          padding: 8px 12px;
          cursor: pointer;
          font-size: 13px;
        }
        .dark .pac-item {
          border-color: #374151 !important;
          color: #d1d5db !important;
        }
        .pac-item:hover {
          background-color: #f3f4f6;
        }
        .dark .pac-item:hover {
          background-color: #374151 !important;
        }
        .pac-item-query {
          font-size: 13px;
        }
        .dark .pac-item-query {
          color: #ffffff !important;
        }
        .pac-matched {
          font-weight: 700;
        }
        .pac-logo:after {
          display: none;
        }
      `}</style>
    </div>
  );
}
