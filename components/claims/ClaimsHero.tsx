"use client";

import Link from "next/link";
import { ChevronDown, Send } from "lucide-react";
import HeroVideoBackground from "@/components/hero/HeroVideoBackground";
import { CLAIMS_CONTENT_WIDTH, CLAIMS_HERO, CLAIMS_SECTION_SHELL } from "./claimsContent";
import { SITE_HERO_BODY_CLASS } from "@/components/home/HomeContent";

export default function ClaimsHero() {
  return (
    <header className="relative flex min-h-[min(100dvh,680px)] w-full min-w-0 flex-col overflow-x-clip bg-black sm:min-h-[min(100dvh,720px)] lg:min-h-screen">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HeroVideoBackground />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/55" />
      </div>

      <div className={`relative z-10 flex w-full flex-1 flex-col items-center justify-center pb-16 pt-[4.5rem] sm:pb-20 sm:pt-24 ${CLAIMS_SECTION_SHELL}`}>
        <div className={`${CLAIMS_CONTENT_WIDTH} text-center text-white`}>
          <h1
          className="w-full min-w-0 break-words font-medium leading-[1.12] tracking-normal text-white"
          style={{ fontSize: "clamp(1.875rem, 3.8vw, 3.75rem)" }}
        >
          <span className="block">{CLAIMS_HERO.titleLine1}</span>
          <span className="block">{CLAIMS_HERO.titleLine2}</span>
        </h1>
        <p className={`mt-5 w-full text-white sm:mt-6 md:mt-7 ${SITE_HERO_BODY_CLASS}`}>
          {CLAIMS_HERO.subtitle}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <Link
            href={CLAIMS_HERO.primaryCta.href}
            className="inline-flex min-w-[10.5rem] items-center justify-center rounded-md bg-[#0047AB] px-7 py-2.5 text-[11px] font-bold transition-colors hover:bg-[#003580] sm:min-w-[11.5rem] sm:px-8 sm:py-3 sm:text-sm md:text-base"
          >
            {CLAIMS_HERO.primaryCta.label}
          </Link>
          <Link
            href={CLAIMS_HERO.secondaryCta.href}
            className="group inline-flex w-fit max-w-[220px] items-center justify-center gap-1.5 border-2 border-white bg-black/25 text-white px-3.5 py-1.5 rounded-md font-bold transition-all duration-300 hover:bg-[#0047AB] hover:border-[#0047AB] text-[11px] sm:w-auto sm:max-w-none sm:gap-2.5 sm:px-7 sm:py-3 sm:text-sm md:text-base"
          >
            <Send className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
            {CLAIMS_HERO.secondaryCta.label}
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
        <ChevronDown className="h-5 w-5 sm:w-6 sm:h-6" />
      </button>
    </header>
  );
}
