"use client";

import Link from "next/link";
import HeroMediaShell from "@/components/hero/HeroMediaShell";
import HeroScrollDownButton from "@/components/hero/HeroScrollDownButton";
import { SWI_CONTENT_WIDTH, SWI_HERO, SWI_SECTION_SHELL } from "./swiContent";
import { SITE_HERO_BODY_CLASS } from "@/components/home/HomeContent";

export default function SwiHero() {
  return (
    <header className="relative flex min-h-[min(100dvh,680px)] w-full min-w-0 flex-col overflow-x-clip bg-black sm:min-h-[min(100dvh,720px)] lg:min-h-screen">
      <HeroMediaShell imageSrc={SWI_HERO.heroImage} strongShade />

      <div
        className={`relative z-10 flex w-full flex-1 flex-col justify-center pb-16 pt-[4.5rem] text-white sm:pb-20 sm:pt-24 ${SWI_SECTION_SHELL}`}
      >
        <div className={`${SWI_CONTENT_WIDTH} w-full min-w-0`}>
        <div className="flex w-full min-w-0 flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center lg:gap-5 xl:gap-8">
          <div className="w-full max-w-[min(100%,280px)] shrink-0 sm:max-w-[300px] lg:max-w-[320px] xl:max-w-[360px]">
            <img
              src="/swi-logo-hero.png"
              alt="Severe Weather Intelligence"
              className="h-auto w-full object-contain"
            />
          </div>

          <h1
            className="mt-3 w-full min-w-0 max-w-full break-words text-center leading-[1.05] tracking-tight text-white sm:mt-4 sm:max-w-[26rem] lg:mt-8 lg:max-w-[30rem] xl:mt-10 xl:max-w-[34rem]"
            style={{ fontSize: "clamp(1.75rem, 3.6vw, 3.75rem)" }}
          >
            <span className="block font-extralight">{SWI_HERO.titleLightLine1}</span>
            <span className="block font-extralight">{SWI_HERO.titleLightLine2}</span>
            <span className="block font-bold max-sm:whitespace-normal sm:whitespace-nowrap">{SWI_HERO.titleBoldLine}</span>
          </h1>
        </div>

        <p
          className={`mx-auto mt-6 w-full max-w-3xl px-1 text-center text-white sm:mt-8 lg:mt-12 ${SITE_HERO_BODY_CLASS}`}
        >
          {SWI_HERO.subtitle}
        </p>

        <div className="mt-6 flex w-full flex-col items-center justify-center gap-2.5 px-1 sm:mt-8 sm:flex-row sm:gap-4">
          <Link
            href={SWI_HERO.primaryCta.href}
            className="inline-flex min-w-[10.5rem] items-center justify-center rounded-md bg-[#0047AB] px-5 py-2 text-[10px] font-bold transition-colors hover:bg-[#003580] sm:min-w-[11.5rem] sm:px-8 sm:py-3 sm:text-sm md:text-base"
          >
            {SWI_HERO.primaryCta.label}
          </Link>
          <Link
            href={SWI_HERO.secondaryCta.href}
            className="inline-flex min-w-[10.5rem] items-center justify-center rounded-md border-2 border-white bg-black/25 px-5 py-2 text-[10px] font-bold text-white transition-colors hover:border-[#0047AB] hover:bg-[#0047AB] sm:min-w-[11.5rem] sm:px-8 sm:py-3 sm:text-sm md:text-base"
          >
            {SWI_HERO.secondaryCta.label}
          </Link>
        </div>
        </div>
      </div>

      <HeroScrollDownButton />
    </header>
  );
}
