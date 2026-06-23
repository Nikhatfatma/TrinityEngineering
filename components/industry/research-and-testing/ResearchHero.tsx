"use client";

import HeroMediaShell from "@/components/hero/HeroMediaShell";
import HeroScrollDownButton from "@/components/hero/HeroScrollDownButton";
import { RT_CONTENT_WIDTH, RT_HERO, RT_SECTION_SHELL } from "./researchAndTestingContent";

export default function ResearchHero() {
  return (
    <header className="relative flex min-h-[min(100dvh,680px)] w-full min-w-0 flex-col overflow-x-clip bg-black sm:min-h-[min(100dvh,720px)] lg:min-h-screen">
      <HeroMediaShell imageSrc={RT_HERO.heroImage} strongShade />

      <div
        className={`relative z-10 flex w-full flex-1 flex-col items-center justify-center pb-16 pt-[4.5rem] sm:pb-20 sm:pt-24 ${RT_SECTION_SHELL}`}
      >
        <div className={`${RT_CONTENT_WIDTH} text-center text-white`}>
          {/* Knot + logo + overlaid text */}
          <div className="relative flex flex-col items-center">
            {/* Knot + logo stack */}
            <div className="relative flex items-center justify-center">
              <img
                src="/industry/trinity-knot.png"
                alt=""
                aria-hidden
                className="h-auto object-contain drop-shadow-[0_0_80px_rgba(96,165,250,0.45)]"
                style={{ width: "clamp(260px, 38vw, 480px)" }}
              />
              {/* Navbar logo centered on knot */}
              <img
                src={RT_HERO.logoSrc}
                alt={RT_HERO.logoAlt}
                className="absolute inset-0 m-auto h-auto object-contain drop-shadow-2xl"
                style={{ width: "clamp(100px, 12vw, 155px)", transform: "translate(8%, -10%)" }}
              />
            </div>

            {/* Text pulled up over the bottom half of the knot */}
            <div
              className="relative z-10 w-full text-center"
              style={{ marginTop: "clamp(-80px, -6vw, 0px)" }}
            >
              <h1
                className="mx-auto w-full min-w-0 max-w-5xl break-words font-medium leading-[1.12] tracking-normal text-white lg:whitespace-nowrap"
                style={{ fontSize: "clamp(2rem, 4.2vw, 4.5rem)" }}
              >
                {RT_HERO.title}
              </h1>
              <p className="mx-auto mt-4 w-full max-w-4xl text-base font-medium leading-relaxed text-white sm:mt-5 sm:text-lg md:mt-6 md:text-xl lg:text-2xl">
                {RT_HERO.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      <HeroScrollDownButton />
    </header>
  );
}
