"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import HeroMediaShell from "@/components/hero/HeroMediaShell";
import { HERO_CONTENT_LAYER_CLASS, HERO_HEADER_CLASS, HERO_STACKED_TITLE_CLASS } from "@/components/hero/heroLayout";
import { CAREERS_HERO, CAREERS_SECTION_SHELL } from "./careersContent";
import { SITE_HERO_BODY_CLASS } from "@/components/home/HomeContent";

export default function CareersHero() {
  return (
    <header className={HERO_HEADER_CLASS}>
      <HeroMediaShell strongShade />

      <div className={`${HERO_CONTENT_LAYER_CLASS} w-full text-white ${CAREERS_SECTION_SHELL}`}>
        <div className="w-full min-w-0 overflow-hidden pt-[10vh] sm:pt-[12vh] md:pt-[13vh] lg:pt-[14vh] xl:pt-[15vh]">
          <p className="max-w-4xl text-left text-[10px] font-medium uppercase leading-snug tracking-[0.22em] text-white/90 sm:text-[11px] md:text-xs md:tracking-[0.25em]">
            {CAREERS_HERO.eyebrow}
          </p>

          <h1 className="mt-4 max-w-4xl break-words text-left font-bold uppercase leading-[1.02] tracking-tight text-white sm:mt-5 lg:mt-6">
            <span className={`block ${HERO_STACKED_TITLE_CLASS}`}>
              {CAREERS_HERO.titleLine1}
            </span>
            <span className={`block ${HERO_STACKED_TITLE_CLASS}`}>
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
    </header>
  );
}
