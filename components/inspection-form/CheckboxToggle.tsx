"use client";

import React, { useRef, useEffect, useState } from "react";

interface CheckboxToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children?: React.ReactNode;
}

export default function CheckboxToggle({
  label,
  checked,
  onChange,
  children,
}: CheckboxToggleProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(checked ? contentRef.current.scrollHeight : 0);
    }
  }, [checked]);

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-3 cursor-pointer group select-none">
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
              checked
                ? "bg-primary dark:bg-accent border-primary dark:border-accent"
                : "border-gray-300 dark:border-gray-600 group-hover:border-primary dark:group-hover:border-accent"
            }`}
          >
            {checked && (
              <span className="material-symbols-outlined text-white text-base">check</span>
            )}
          </div>
        </div>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
          {label}
        </span>
      </label>

      {children && (
        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{ maxHeight: height }}
        >
          <div ref={contentRef} className="pt-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
