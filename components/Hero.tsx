"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import HeroMediaShell from "@/components/hero/HeroMediaShell";
import HeroScrollDownButton from "@/components/hero/HeroScrollDownButton";
import { HERO_HEADER_CLASS, HERO_STACKED_TITLE_CLASS } from "@/components/hero/heroLayout";
import { HOME_CONTENT_CLASS } from "@/components/home/HomeContent";

export default function Hero() {
  return (
    <header className={HERO_HEADER_CLASS}>
      <HeroMediaShell strongShade />

      <div className={`relative z-10 flex min-h-0 flex-1 flex-col w-full overflow-hidden text-white pt-[4.5rem] sm:pt-24 ${HOME_CONTENT_CLASS}`}>
        <div className="w-full min-w-0 pt-[14vh] sm:pt-[12vh] md:pt-[14vh] lg:pt-[12vh] xl:pt-[14vh] pb-14 sm:pb-16">
          <p
            className="text-left font-bold uppercase opacity-95 leading-snug max-w-4xl break-words tracking-[0.12em] sm:tracking-[0.18em] lg:tracking-[0.2em] drop-shadow-md text-[0.625rem] sm:text-[0.8rem] md:text-sm"
          >
            THE MOST TRUSTED ENGINEERING FIRM IN STORM DAMAGE FORENSICS
          </p>

          <h1
            className={`text-left font-black mt-2 sm:mt-3 lg:mt-4 tracking-tight leading-[0.92] uppercase text-white drop-shadow-sm break-words ${HERO_STACKED_TITLE_CLASS}`}
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
              className="group inline-flex w-fit max-w-[220px] items-center justify-center gap-1.5 mt-5 border-2 border-white bg-black/25 hover:bg-[#0047AB] hover:border-[#0047AB] text-white px-3.5 py-1.5 rounded-md font-bold transition-all duration-300 text-[11px] sm:mt-6 sm:w-auto sm:max-w-none sm:gap-2.5 sm:px-7 sm:py-3 sm:text-sm md:text-base lg:mt-6"
            >
              <Send className="w-3.5 h-3.5 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform shrink-0" />
              Submit Inspection
            </Link>
          </div>
        </div>
      </div>

      <HeroScrollDownButton />
    </header>
  );
}
