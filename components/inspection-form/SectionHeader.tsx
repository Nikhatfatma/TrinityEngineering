"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
  optional?: boolean;
}

/**
 * Standardized SectionHeader component
 * Ensures absolute consistency across all form sections.
 */
export default function SectionHeader({
  title,
  icon: Icon,
  optional = false,
}: SectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-1.5 animate-fadeIn">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0 shadow-sm border border-primary/10 dark:border-accent/10">
            <Icon className="text-primary dark:text-accent w-4 h-4" />
          </div>
        )}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <h3 className="text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-primary dark:from-white dark:via-gray-200 dark:to-accent">
              {title}
            </span>
            {optional && (
              <span className="text-[9px] font-black bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-gray-200 dark:border-gray-700">
                Optional
              </span>
            )}
          </h3>
        </div>
      </div>
      {/* Consistent bottom accent line */}
      <div className="h-[2px] w-12 bg-gradient-to-r from-primary/60 via-primary/20 to-transparent dark:from-accent/60 dark:via-accent/20 rounded-full" />
    </div>
  );
}
