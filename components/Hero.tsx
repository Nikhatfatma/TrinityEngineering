"use client";

import Link from "next/link";
import { ChevronDown, Send } from "lucide-react";

export default function Hero() {
  return (
    <header className="relative min-h-[min(100dvh,720px)] lg:min-h-screen overflow-hidden bg-black flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-background.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6 text-center text-white pt-[4.75rem] sm:pt-24 pb-12 lg:pb-10">
        <p className="text-[9px] min-[400px]:text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.12em] sm:tracking-[0.2em] mb-2 sm:mb-3 uppercase opacity-90 leading-snug max-w-[280px] sm:max-w-none mx-auto text-balance">
          THE MOST TRUSTED ENGINEERING FIRM IN STORM DAMAGE FORENSICS
        </p>

        <h1 className="text-[1.75rem] min-[400px]:text-[2rem] sm:text-4xl md:text-6xl lg:text-7xl font-black mb-3 sm:mb-6 tracking-tight leading-[1.05] sm:leading-tight drop-shadow-2xl px-1 uppercase">
          <span className="text-white lg:bg-clip-text lg:text-transparent lg:bg-gradient-to-b lg:from-white lg:from-[30%] lg:via-[#0047AB] lg:to-[#002D6B]">
            TRINITY ENGINEERING
          </span>
        </h1>

        <div className="flex flex-col items-center gap-2.5 sm:gap-4 max-w-[320px] sm:max-w-2xl md:max-w-4xl mx-auto mb-6 sm:mb-8 px-1">
          <p className="text-xs sm:text-base md:text-lg font-medium leading-snug text-white/95">
            Professional forensic engineering inspections.
          </p>
          <p className="text-xs sm:text-base md:text-lg font-medium leading-snug text-white/90">
            Same-day first contact. 15 states coverage. Next-day inspection reports.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 sm:gap-8">
          <Link
            href="/submit-inspection"
            className="group inline-flex items-center justify-center gap-2 sm:gap-3 w-full max-w-[280px] sm:w-auto sm:max-w-none max-lg:uppercase max-lg:tracking-[0.1em] max-lg:text-[11px] max-lg:font-bold max-lg:bg-[#0047AB] max-lg:border-[#0047AB] max-lg:text-white max-lg:py-3.5 max-lg:shadow-md max-lg:hover:bg-[#003580] max-lg:hover:border-[#003580] bg-transparent border-2 border-white text-white hover:bg-[#0047AB] hover:border-[#0047AB] hover:text-white hover:shadow-lg hover:shadow-[#0047AB]/40 px-6 py-3 sm:px-10 sm:py-4 rounded-md sm:rounded-lg font-bold text-sm sm:text-lg transition-all duration-300"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 max-lg:hidden group-hover:scale-110 transition-transform shrink-0" />
            Submit Inspection
          </Link>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            className="hidden lg:block animate-bounce"
            aria-label="Scroll down"
          >
            <ChevronDown className="w-8 h-8 sm:w-10 sm:h-10 text-white/70" />
          </button>
        </div>
      </div>
    </header>
  );
}
