"use client";

import React from "react";

interface FormSectionProps {
  title: string;
  icon: string;
  subtitle?: string;
  optional?: boolean;
  children: React.ReactNode;
}

export default function FormSection({
  title,
  icon,
  subtitle,
  optional = false,
  children,
}: FormSectionProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-primary dark:text-accent text-2xl">
            {icon}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              {title}
            </h2>
            {optional && (
              <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full">
                Optional
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
