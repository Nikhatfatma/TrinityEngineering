"use client";

import HeroMediaShell from "@/components/hero/HeroMediaShell";
import HeroScrollDownButton from "@/components/hero/HeroScrollDownButton";
import { EDUCATION_CONTENT_WIDTH, EDUCATION_HERO, EDUCATION_SECTION_SHELL } from "./educationContent";
import { SITE_HERO_BODY_CLASS } from "@/components/home/HomeContent";

export default function EducationHero() {
  return (
    <header className="relative flex min-h-[min(100dvh,680px)] w-full min-w-0 flex-col overflow-x-clip bg-black sm:min-h-[min(100dvh,720px)] lg:min-h-screen">
      <HeroMediaShell imageSrc={EDUCATION_HERO.heroImage} imageObjectPosition="center 20%" strongShade />

      <div
        className={`relative z-10 flex w-full flex-1 flex-col items-center justify-center pb-16 pt-[4.5rem] text-white sm:pb-20 sm:pt-24 ${EDUCATION_SECTION_SHELL}`}
      >
        <div className={`${EDUCATION_CONTENT_WIDTH} text-center w-full min-w-0`}>
          {EDUCATION_HERO.logoImage && (
            <div className="mx-auto mb-6 w-[140px] sm:w-[180px] md:w-[210px] transition-transform duration-500 hover:scale-102">
              <img
                src={EDUCATION_HERO.logoImage}
                alt="Trinity Institute of Forensic Engineering"
                className="h-auto w-full object-contain drop-shadow-2xl"
              />
            </div>
          )}

          <h1
            className="mx-auto mt-4 w-full max-w-[1413px] break-words text-white text-center"
            style={{
              fontFamily: "'Mulish', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(2rem, 5.5vw, 88px)",
              lineHeight: "clamp(2.2rem, 6vw, 98px)",
              textTransform: "capitalize",
            }}
          >
            {EDUCATION_HERO.title}
          </h1>

          <p className={`mx-auto mt-6 w-full max-w-3xl text-white/90 sm:mt-8 md:mt-10 ${SITE_HERO_BODY_CLASS}`}>
            {EDUCATION_HERO.subtitle}
          </p>
        </div>
      </div>

      <HeroScrollDownButton />
    </header>
  );
}
