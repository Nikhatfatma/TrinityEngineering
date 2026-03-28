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
    if (!contentRef.current) return;
    const el = contentRef.current;

    const updateHeight = () => setHeight(checked ? el.scrollHeight : 0);
    updateHeight();

    if (!checked) return;

    const observer = new ResizeObserver(() => {
      updateHeight();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [checked]);

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 cursor-pointer group select-none">
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-300 ${
              checked
                ? "bg-primary dark:bg-accent border-primary dark:border-accent"
                : "border-gray-300 dark:border-gray-600 group-hover:border-primary dark:group-hover:border-accent"
            }`}
          >
            {checked && (
              <span className="material-symbols-outlined text-white text-[12px]">check</span>
            )}
          </div>
        </div>
        <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
          {label}
        </span>
      </label>

      {children && (
        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{ maxHeight: height }}
        >
          <div ref={contentRef} className="pt-1.5">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
