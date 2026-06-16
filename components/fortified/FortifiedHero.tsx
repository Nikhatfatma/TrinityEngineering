"use client";

import Link from "next/link";
import HeroMediaShell from "@/components/hero/HeroMediaShell";
import HeroScrollDownButton from "@/components/hero/HeroScrollDownButton";
import {
  FORTIFIED_CONTENT_WIDTH,
  FORTIFIED_HERO,
  FORTIFIED_SECTION_SHELL,
} from "./fortifiedContent";
import { SITE_HERO_BODY_CLASS } from "@/components/home/HomeContent";

export default function FortifiedHero() {
  return (
    <header className="relative flex min-h-[min(100dvh,680px)] w-full min-w-0 flex-col overflow-x-clip bg-black sm:min-h-[min(100dvh,720px)] lg:min-h-screen">
      <HeroMediaShell
        imageSrc={FORTIFIED_HERO.heroImage}
        imageObjectPosition={FORTIFIED_HERO.heroImageObjectPosition}
        strongShade
      />

      <div
        className={`relative z-10 flex w-full flex-1 flex-col items-center justify-center pb-16 pt-[4.5rem] text-white sm:pb-20 sm:pt-24 ${FORTIFIED_SECTION_SHELL}`}
      >
        <div className={`${FORTIFIED_CONTENT_WIDTH} text-center`}>
          <div className="mx-auto mb-5 w-[min(100%,170px)] sm:mb-6 sm:w-[min(100%,210px)] md:w-[250px]">
            <img
              src={FORTIFIED_HERO.logoImage}
              alt="FORTIFIED Roof"
              className="h-auto w-full object-contain drop-shadow-lg"
            />
          </div>

          <h1
            className="mx-auto w-full break-words font-normal leading-[1.12] tracking-tight text-white"
            style={{ fontSize: "clamp(1.75rem, 3.8vw, 3.5rem)" }}
          >
            {FORTIFIED_HERO.title}
          </h1>
          <p className={`mx-auto mt-5 w-full text-white sm:mt-6 md:mt-7 ${SITE_HERO_BODY_CLASS}`}>
            {FORTIFIED_HERO.subtitle}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <Link
              href={FORTIFIED_HERO.primaryCta.href}
              className="inline-flex min-w-[10.5rem] items-center justify-center rounded-md bg-[#0047AB] px-7 py-2.5 text-[11px] font-bold transition-colors hover:bg-[#003580] sm:min-w-[11.5rem] sm:px-8 sm:py-3 sm:text-sm md:text-base"
            >
              {FORTIFIED_HERO.primaryCta.label}
            </Link>
            <Link
              href={FORTIFIED_HERO.secondaryCta.href}
              className="inline-flex min-w-[10.5rem] items-center justify-center rounded-md border-2 border-white bg-black/25 px-7 py-2.5 text-[11px] font-bold text-white transition-colors hover:border-[#0047AB] hover:bg-[#0047AB] sm:min-w-[11.5rem] sm:px-8 sm:py-3 sm:text-sm md:text-base"
            >
              {FORTIFIED_HERO.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>

      <HeroScrollDownButton />
    </header>
  );
}
