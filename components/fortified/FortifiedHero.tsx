"use client";

import Link from "next/link";
import HeroMediaShell from "@/components/hero/HeroMediaShell";
import {
  HERO_CENTERED_TITLE_SIZE,
  HERO_CONTENT_LAYER_CENTERED_CLASS,
  HERO_FORTIFIED_LOGO_WRAP_CLASS,
  HERO_HEADER_CLASS,
} from "@/components/hero/heroLayout";
import {
  FORTIFIED_CONTENT_WIDTH,
  FORTIFIED_HERO,
  FORTIFIED_SECTION_SHELL,
} from "./fortifiedContent";
import { SITE_HERO_BODY_CLASS } from "@/components/home/HomeContent";

export default function FortifiedHero() {
  return (
    <header className={HERO_HEADER_CLASS}>
      <HeroMediaShell
        imageSrc={FORTIFIED_HERO.heroImage}
        imageObjectPosition={FORTIFIED_HERO.heroImageObjectPosition}
        strongShade
      />

      <div className={`${HERO_CONTENT_LAYER_CENTERED_CLASS} w-full text-white ${FORTIFIED_SECTION_SHELL}`}>
        <div className={`${FORTIFIED_CONTENT_WIDTH} text-center`}>
          <div className={HERO_FORTIFIED_LOGO_WRAP_CLASS}>
            <img
              src={FORTIFIED_HERO.logoImage}
              alt="FORTIFIED Roof"
              className="h-auto w-full object-contain drop-shadow-lg"
            />
          </div>

          <h1
            className="mx-auto w-full break-words font-normal leading-[1.12] tracking-tight text-white"
            style={{ fontSize: HERO_CENTERED_TITLE_SIZE }}
          >
            {FORTIFIED_HERO.title}
          </h1>
          <p className={`mx-auto mt-3 w-full text-white sm:mt-4 md:mt-5 ${SITE_HERO_BODY_CLASS}`}>
            {FORTIFIED_HERO.subtitle}
          </p>

          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:mt-6 sm:flex-row sm:gap-4">
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
    </header>
  );
}
