"use client";

import Link from "next/link";
import { ChevronDown, Send } from "lucide-react";
import HeroVideoBackground from "@/components/hero/HeroVideoBackground";

export default function Hero() {
  return (
    <header className="relative min-h-[min(100dvh,680px)] sm:min-h-[min(100dvh,720px)] lg:min-h-screen w-full min-w-0 overflow-x-clip bg-black flex flex-col">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HeroVideoBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col w-full max-w-[1440px] mx-auto min-w-0 px-4 sm:px-6 lg:px-8 text-white pt-[4.5rem] sm:pt-24 min-h-0">
        <div className="w-full min-w-0 pt-[22vh] sm:pt-[18vh] md:pt-[22vh] lg:pt-[30vh] xl:pt-[34vh] pb-16 sm:pb-20 md:pl-4 lg:pl-8 xl:pl-12">
          <p
            className="text-left font-bold uppercase opacity-95 leading-snug max-w-4xl break-words tracking-[0.12em] sm:tracking-[0.18em] lg:tracking-[0.2em] drop-shadow-md text-[0.625rem] sm:text-[0.8rem] md:text-sm"
          >
            THE MOST TRUSTED ENGINEERING FIRM IN STORM DAMAGE FORENSICS
          </p>

          <h1
            className="text-left font-black mt-2 sm:mt-3 lg:mt-4 tracking-tight leading-[0.92] uppercase text-white drop-shadow-sm break-words text-[1.75rem] sm:text-[2.5rem] md:text-[3.125rem] lg:text-[4rem] xl:text-[5.25rem]"
          >
            TRINITY ENGINEERING
          </h1>

          <div className="w-full min-w-0 text-left mt-5 sm:mt-6 lg:mt-8 max-w-full md:max-w-[85%] lg:ml-[40%] lg:max-w-[calc(60%-1rem)] xl:ml-[52%] xl:max-w-[calc(48%-1rem)] 2xl:ml-[50%] 2xl:max-w-[calc(50%-1rem)] max-lg:max-w-none">
            <p className="font-medium leading-relaxed text-white drop-shadow-sm text-[0.8125rem] sm:text-sm md:text-base lg:text-lg">
              Professional forensic engineering inspections. Same-day first contact. 15 states
              coverage. Next-day inspection reports.
            </p>

            <Link
              href="/submit-inspection"
              className="group inline-flex w-fit max-w-[220px] items-center justify-center gap-1.5 mt-5 border-2 border-white bg-black/25 hover:bg-[#0047AB] hover:border-[#0047AB] text-white px-3.5 py-1.5 rounded-md font-bold transition-all duration-300 text-[11px] sm:mt-7 sm:w-auto sm:max-w-none sm:gap-2.5 sm:px-7 sm:py-3 sm:text-sm md:text-base lg:mt-8"
            >
              <Send className="w-3.5 h-3.5 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform shrink-0" />
              Submit Inspection
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        className="absolute bottom-5 sm:bottom-8 left-1/2 z-10 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-black/20 text-white/80 hover:bg-white/10 transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </header>
  );
}
