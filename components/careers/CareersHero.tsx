"use client";

import Link from "next/link";
import { ChevronDown, Send } from "lucide-react";
import HeroMediaShell from "@/components/hero/HeroMediaShell";
import { CAREERS_HERO, CAREERS_SECTION_SHELL } from "./careersContent";
import { SITE_HERO_BODY_CLASS } from "@/components/home/HomeContent";

export default function CareersHero() {
  return (
    <header className="relative flex min-h-[min(100dvh,680px)] w-full min-w-0 flex-col overflow-x-clip bg-black sm:min-h-[min(100dvh,720px)] lg:min-h-screen">
      <HeroMediaShell strongShade />

      <div
        className={`relative z-10 flex w-full flex-1 flex-col pt-[4.5rem] text-white sm:pt-24 ${CAREERS_SECTION_SHELL}`}
      >
        <div className="w-full min-w-0 pb-20 pt-[16vh] sm:pb-24 sm:pt-[18vh] md:pt-[20vh] lg:pb-28 lg:pt-[24vh] xl:pt-[28vh]">
          <p className="max-w-4xl text-left text-[10px] font-medium uppercase leading-snug tracking-[0.22em] text-white/90 sm:text-[11px] md:text-xs md:tracking-[0.25em]">
            {CAREERS_HERO.eyebrow}
          </p>

          <h1 className="mt-4 max-w-4xl break-words text-left font-bold uppercase leading-[1.02] tracking-tight text-white sm:mt-5 lg:mt-6">
            <span className="block text-[2rem] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[4rem] xl:text-[4.75rem]">
              {CAREERS_HERO.titleLine1}
            </span>
            <span className="block text-[2rem] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[4rem] xl:text-[4.75rem]">
              {CAREERS_HERO.titleLine2}
            </span>
          </h1>

          <div className="mt-6 w-full min-w-0 max-w-full sm:mt-8 lg:ml-[42%] lg:mt-10 lg:max-w-[calc(58%-1rem)] xl:ml-[48%] xl:max-w-[calc(52%-1rem)]">
            <p className={`text-left text-white ${SITE_HERO_BODY_CLASS}`}>{CAREERS_HERO.description}</p>
            <Link
              href={CAREERS_HERO.secondaryCta.href}
              className="group mt-5 inline-flex w-fit items-center gap-2 rounded-md border-2 border-white bg-black/25 px-4 py-2 text-[11px] font-bold text-white transition-all hover:border-[#0047AB] hover:bg-[#0047AB] sm:mt-6 sm:px-6 sm:py-2.5 sm:text-sm"
            >
              <Send className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
              {CAREERS_HERO.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        className="absolute bottom-5 left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/50 bg-black/20 text-white/80 transition-colors hover:bg-white/10 sm:bottom-8"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    </header>
  );
}
