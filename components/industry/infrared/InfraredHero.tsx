"use client";

import HeroMediaShell from "@/components/hero/HeroMediaShell";
import HeroScrollDownButton from "@/components/hero/HeroScrollDownButton";
import { IR_CONTENT_WIDTH, IR_HERO, IR_SECTION_SHELL } from "./infraredThermographyContent";

export default function InfraredHero() {
  return (
    <header className="relative flex min-h-[min(100dvh,680px)] w-full min-w-0 flex-col overflow-x-clip bg-black sm:min-h-[min(100dvh,720px)] lg:min-h-screen">
      <HeroMediaShell imageSrc={IR_HERO.heroImage} strongShade />

      <div
        className={`relative z-10 flex w-full flex-1 flex-col items-center justify-center pb-16 pt-[4.5rem] sm:pb-20 sm:pt-24 ${IR_SECTION_SHELL}`}
      >
        <div className={`${IR_CONTENT_WIDTH} text-center text-white`}>
          <div className="mx-auto mt-2 mb-8 flex justify-center sm:mt-3 sm:mb-10 md:mt-4 md:mb-12">
            <img
              src={IR_HERO.logoSrc}
              alt={IR_HERO.logoAlt}
              className="h-auto w-full max-w-[min(100%,200px)] object-contain sm:max-w-[220px] md:max-w-[240px] lg:max-w-[260px]"
            />
          </div>
          <h1
            className="mx-auto w-full min-w-0 max-w-5xl break-words font-medium leading-[1.12] tracking-normal text-white lg:whitespace-nowrap"
            style={{ fontSize: "clamp(2.125rem, 4.6vw, 4.75rem)" }}
          >
            {IR_HERO.title}
          </h1>
          <p className="mx-auto mt-6 w-full max-w-4xl text-base font-medium leading-relaxed text-white sm:mt-7 sm:text-lg md:mt-8 md:text-xl lg:text-2xl">
            {IR_HERO.subtitle}
          </p>
        </div>
      </div>

      <HeroScrollDownButton />
    </header>
  );
}
