"use client";

import { Check } from "lucide-react";

interface SelectCardProps {
  label: string;
  value: string;
  image: string;
  selected: boolean;
  onSelect: () => void;
  dimmed?: boolean;
  horizontal?: boolean;
}

export default function SelectCard({
  label,
  value,
  image,
  selected,
  onSelect,
  dimmed = false,
  horizontal = false,
}: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex w-full transition-all duration-300 border overflow-hidden ${horizontal ? "flex-row items-center h-12 rounded-lg" : "flex-col items-center rounded-lg text-center"
        } ${selected
          ? "border-primary ring-2 ring-primary/30 shadow-lg shadow-primary/10"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark hover:shadow-lg hover:-translate-y-0.5 shadow-sm"
        } ${dimmed && !selected ? "opacity-65 saturate-75 scale-[0.97]" : "opacity-100"}`}
    >
      {/* Image — adjusted for horizontal or vertical */}
      <div className={`${horizontal ? "w-16 h-full border-r border-gray-100 dark:border-gray-800" : "w-full h-32 md:h-40"
        } relative overflow-hidden flex-shrink-0`}>
        <img
          src={image}
          alt={label}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle unselected overlay */}
        {!selected && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-0" />
        )}
        {/* Selected check overlay */}
        {selected && (
          <div className="absolute inset-0 bg-primary/15 flex items-center justify-center">
            <div className={`${horizontal ? "w-4 h-4" : "w-6 h-6"} rounded-full bg-primary flex items-center justify-center shadow-md`}>
              <Check className="text-white w-2.5 h-2.5" strokeWidth={3} />
            </div>
          </div>
        )}
      </div>
      {/* Label */}
      <div className={`w-full transition-colors flex items-center ${horizontal ? "px-3 h-full" : "px-1.5 py-1.5"
        } ${selected ? "bg-primary/5 dark:bg-accent/10" : "bg-white dark:bg-background-dark"
        }`}>
        <span
          className={`text-[10px] font-bold leading-tight block text-left transition-colors ${selected ? "text-primary dark:text-accent" : "text-gray-700 dark:text-gray-300"
            }`}
        >
          {label}
        </span>
      </div>
    </button>
  );
}
