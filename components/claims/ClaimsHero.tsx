"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import HeroMediaShell from "@/components/hero/HeroMediaShell";
import HeroScrollDownButton from "@/components/hero/HeroScrollDownButton";
import { CLAIMS_CONTENT_WIDTH, CLAIMS_HERO, CLAIMS_SECTION_SHELL } from "./claimsContent";
import { SITE_HERO_BODY_CLASS } from "@/components/home/HomeContent";

export default function ClaimsHero() {
  return (
    <header className="relative flex min-h-[min(100dvh,680px)] w-full min-w-0 flex-col overflow-x-clip bg-black sm:min-h-[min(100dvh,720px)] lg:min-h-screen">
      <HeroMediaShell strongShade imageSrc="/claims-hero.jpg" />

      <div className={`relative z-10 flex w-full flex-1 flex-col items-center justify-center pb-16 pt-[4.5rem] sm:pb-20 sm:pt-24 ${CLAIMS_SECTION_SHELL}`}>
        <div className={`${CLAIMS_CONTENT_WIDTH} text-white translate-y-8 lg:translate-y-14`}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12 items-start">
            {/* Left side: Eyebrow + Title */}
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 sm:text-xs lg:whitespace-nowrap">
                {CLAIMS_HERO.eyebrow}
              </p>
              <h1
                className="mt-3.5 w-full min-w-0 break-words font-medium leading-[1.08] tracking-tight text-white lg:whitespace-nowrap"
                style={{ fontSize: "clamp(2.35rem, 5.2vw, 4.75rem)" }}
              >
                {CLAIMS_HERO.title}
              </h1>
            </div>

            {/* Right side: Subtitle + Button */}
            <div className="flex flex-col items-start text-left gap-4 sm:gap-6 mt-0 sm:mt-2 lg:mt-28 lg:pl-16">
              <p className="max-w-[440px] text-sm font-semibold leading-relaxed text-gray-200 sm:text-base md:text-[18px]">
                Storm damage, structural, water loss,<br className="hidden lg:inline" />
                large or complex loss, small fire,<br className="hidden lg:inline" />
                component, and other claim types
              </p>
              <Link
                href={CLAIMS_HERO.cta.href}
                className="group inline-flex items-center justify-center gap-2 border border-[#0047AB] bg-[#0047AB] text-white px-7 py-3 rounded-md font-bold transition-all duration-300 hover:bg-black/25 hover:border-white text-xs sm:text-sm md:text-[15px]"
              >
                <Send className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                {CLAIMS_HERO.cta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <HeroScrollDownButton />
    </header>
  );
}
