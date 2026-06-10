"use client";

import { ChevronDown } from "lucide-react";

export default function HeroScrollDownButton() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center sm:bottom-6">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-black/20 text-white/80 transition-colors hover:bg-white/10 animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
}
