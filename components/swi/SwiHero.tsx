"use client";

import Link from "next/link";
import HeroMediaShell from "@/components/hero/HeroMediaShell";
import {
  HERO_CENTERED_TITLE_SIZE,
  HERO_CONTENT_LAYER_CENTERED_CLASS,
  HERO_HEADER_CLASS,
  HERO_SWI_LOGO_WRAP_CLASS,
} from "@/components/hero/heroLayout";
import { SWI_CONTENT_WIDTH, SWI_HERO, SWI_SECTION_SHELL } from "./swiContent";
import { SITE_HERO_BODY_CLASS } from "@/components/home/HomeContent";

export default function SwiHero() {
  return (
    <header className={HERO_HEADER_CLASS}>
      <HeroMediaShell imageSrc={SWI_HERO.heroImage} strongShade />

      <div className={`${HERO_CONTENT_LAYER_CENTERED_CLASS} w-full text-white ${SWI_SECTION_SHELL}`}>
        <div className={`${SWI_CONTENT_WIDTH} w-full min-w-0 mt-4 sm:mt-5 md:mt-6 lg:mt-8 xl:mt-10`}>
        <div className="flex w-full min-w-0 flex-col items-center gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-center lg:gap-x-10 xl:gap-x-14 2xl:gap-x-16">
          <div className={`${HERO_SWI_LOGO_WRAP_CLASS} lg:shrink-0 lg:pr-2 xl:pr-4`}>
            <img
              src="/swi-logo-hero.png"
              alt="Severe Weather Intelligence"
              className="h-auto w-full object-contain"
            />
          </div>

          <h1
            className="mt-3 w-full min-w-0 max-w-full break-words text-center leading-[1.05] tracking-tight text-white sm:mt-4 sm:max-w-[24rem] lg:mt-0 lg:w-auto lg:max-w-[22rem] lg:shrink lg:pl-2 lg:text-left xl:max-w-[24rem] xl:pl-4 2xl:max-w-[26rem]"
            style={{ fontSize: HERO_CENTERED_TITLE_SIZE }}
          >
            <span className="block font-extralight lg:text-left">{SWI_HERO.titleLightLine1}</span>
            <span className="block text-center font-extralight">{SWI_HERO.titleLightLine2}</span>
            <span className="block font-bold max-sm:whitespace-normal sm:whitespace-nowrap lg:text-left">{SWI_HERO.titleBoldLine}</span>
          </h1>
        </div>

        <p
          className={`mx-auto mt-4 w-full max-w-3xl px-1 text-center text-white sm:mt-5 lg:mt-6 ${SITE_HERO_BODY_CLASS}`}
        >
          {SWI_HERO.subtitle}
        </p>

        <div className="mt-5 flex w-full flex-col items-center justify-center gap-2.5 px-1 sm:mt-6 sm:flex-row sm:gap-4">
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
    </header>
  );
}
