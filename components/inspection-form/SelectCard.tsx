"use client";

import React, { useState } from "react";
import Image from "next/image";

interface GridSelectCardProps {
  label: string;
  value: string;
  image?: string;
  selected: boolean;
  onSelect: () => void;
  dimmed?: boolean;
}

export default function SelectCard({
  label,
  value,
  image,
  selected,
  onSelect,
  dimmed = false,
}: GridSelectCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex flex-col items-center justify-start text-center rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer w-full
        ${
          selected
            ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-500/50 scale-[1.02]"
            : `border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg hover:scale-[1.01] ${
                dimmed ? "opacity-60 grayscale-[0.2]" : ""
              }`
        }
      `}
    >
      {/* Selected check indicator */}
      {selected && (
        <div className="absolute top-3 right-3 z-10 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-white text-sm font-bold">check</span>
        </div>
      )}

      {/* Image container */}
      <div className="w-full relative h-20 sm:h-24 bg-gray-100 overflow-hidden">
        {image && !imgError ? (
           <Image 
              src={image} 
              alt={label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onError={() => setImgError(true)}
           />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <span className="material-symbols-outlined text-4xl mb-2">image</span>
            <span className="text-xs">{label}</span>
          </div>
        )}
        
        {/* Subtle gradient overlay to match aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Label container */}
      <div className="w-full px-2 py-1.5 border-t border-gray-100 flex-grow flex items-center justify-center">
        <span
          className={`font-bold text-[11px] sm:text-xs leading-tight text-center transition-colors duration-300 ${
            selected
              ? "text-blue-700"
              : "text-gray-900 group-hover:text-blue-600"
          }`}
        >
          {label}
        </span>
      </div>
    </button>
  );
}
