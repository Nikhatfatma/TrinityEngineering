"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SWI_HERO, SWI_SECTION_SHELL } from "./swiContent";
import { SITE_HERO_BODY_CLASS } from "@/components/home/HomeContent";

const HERO_VIDEO_SRC = "/Trinity%20Engineering%20Hero%20Video%20VER2.mov";
const HERO_VIDEO_POSTER = "/hero-background.png";

export default function SwiHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduceMotion || !videoRef.current) return;
    videoRef.current.play().catch(() => {});
  }, [reduceMotion]);

  return (
    <header className="relative flex min-h-[min(100dvh,680px)] w-full min-w-0 flex-col overflow-x-clip bg-black sm:min-h-[min(100dvh,720px)] lg:min-h-screen">
      <div className="absolute inset-0 z-0 overflow-hidden">
        {reduceMotion ? (
          <img
            src={HERO_VIDEO_POSTER}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={HERO_VIDEO_SRC}
            poster={HERO_VIDEO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            aria-hidden
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/55" />
      </div>

      <div
        className={`relative z-10 flex w-full flex-1 flex-col justify-center pb-16 pt-[4.5rem] text-white sm:pb-20 sm:pt-24 ${SWI_SECTION_SHELL}`}
      >
        <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center lg:gap-5 xl:gap-8">
          <div className="w-full max-w-[min(100%,280px)] shrink-0 sm:max-w-[300px] lg:max-w-[320px] xl:max-w-[360px]">
            <img
              src="/swi-logo-hero.png"
              alt="Severe Weather Intelligence"
              className="h-auto w-full object-contain"
            />
          </div>

          <h1
            className="mt-3 w-full max-w-[22rem] shrink-0 text-center leading-[1.05] tracking-tight text-white sm:mt-4 sm:max-w-[26rem] lg:mt-8 lg:max-w-[30rem] xl:mt-10 xl:max-w-[34rem]"
            style={{ fontSize: "clamp(2rem, 3.6vw, 3.75rem)" }}
          >
            <span className="block font-extralight">{SWI_HERO.titleLightLine1}</span>
            <span className="block font-extralight">{SWI_HERO.titleLightLine2}</span>
            <span className="block whitespace-nowrap font-bold">{SWI_HERO.titleBoldLine}</span>
          </h1>
        </div>

        <p
          className={`mx-auto mt-8 max-w-3xl text-center text-white sm:mt-10 lg:mt-12 ${SITE_HERO_BODY_CLASS}`}
        >
          {SWI_HERO.subtitle}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <Link
            href={SWI_HERO.primaryCta.href}
            className="inline-flex min-w-[10.5rem] items-center justify-center rounded-md bg-[#0047AB] px-7 py-2.5 text-[11px] font-bold transition-colors hover:bg-[#003580] sm:min-w-[11.5rem] sm:px-8 sm:py-3 sm:text-sm md:text-base"
          >
            {SWI_HERO.primaryCta.label}
          </Link>
          <Link
            href={SWI_HERO.secondaryCta.href}
            className="inline-flex min-w-[10.5rem] items-center justify-center rounded-md border-2 border-white bg-black/25 px-7 py-2.5 text-[11px] font-bold text-white transition-colors hover:border-[#0047AB] hover:bg-[#0047AB] sm:min-w-[11.5rem] sm:px-8 sm:py-3 sm:text-sm md:text-base"
          >
            {SWI_HERO.secondaryCta.label}
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        className="absolute bottom-5 left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/50 bg-black/20 text-white/80 transition-colors hover:bg-white/10 sm:bottom-8"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    </header>
  );
}
