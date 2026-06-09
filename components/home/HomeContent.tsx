import type { ReactNode } from "react";

import {
  CLAIMS_CONTENT_WIDTH,
  CLAIMS_SECTION_SHELL,
} from "../claims/claimsContent";

/** Shared with SWI / Fortified / Claims tabs — single source for shell + text column */
export const HOME_CONTENT_CLASS = CLAIMS_SECTION_SHELL;
export const HOME_SECTION_SHELL = CLAIMS_SECTION_SHELL;
export const HOME_TEXT_WIDTH = CLAIMS_CONTENT_WIDTH;

/** Full-bleed image on mobile/tablet — matches SWI / Fortified tabs */
export const HOME_IMAGE_BLEED_MOBILE =
  "max-lg:relative max-lg:left-1/2 max-lg:w-[100dvw] max-lg:max-w-none max-lg:-translate-x-1/2";

/** Pull left column image to the viewport left edge (desktop); full bleed below lg */
export const HOME_IMAGE_BLEED_LEFT = [
  HOME_IMAGE_BLEED_MOBILE,
  "lg:left-auto lg:translate-x-0 lg:ml-[calc((100%-100vw)/2)] lg:w-[calc(100%+(100vw-100%)/2)]",
].join(" ");

/** Full-width image below lg — matches Weather section (mobile + tablet) */
export const HOME_STACKED_IMAGE_CLASS =
  "block w-full h-auto max-lg:object-contain max-lg:object-center";

/** Section h2 — bold below lg; desktop weight unchanged per section */
export const HOME_SECTION_HEADING = "max-lg:font-bold";

/** Responsive section h2 font size — see globals.css .site-section-heading */
export const SITE_SECTION_HEADING_SIZE_CLASS = "site-section-heading";

export const SITE_SECTION_HEADING_CLASS = `tracking-tight leading-[1.2] lg:font-semibold ${HOME_SECTION_HEADING} ${SITE_SECTION_HEADING_SIZE_CLASS}`;

/** SWI / Fortified / Claims / Careers — matched section vertical padding */
export const SITE_TAB_SECTION_PY = "py-10 md:py-14 lg:py-16";

/** SWI / Fortified bottom CTA — matched min-height and vertical padding */
export const SITE_TAB_CTA_SECTION_CLASS =
  "relative flex min-h-[22rem] items-center overflow-x-clip py-12 sm:min-h-[24rem] sm:py-14 md:py-16 lg:min-h-[26rem] lg:py-20";

export const SITE_BODY_CLASS =
  "text-gray-600 text-[14px] md:text-[15px] leading-relaxed font-medium";

export const SITE_HERO_BODY_CLASS =
  "font-medium leading-relaxed text-[0.8125rem] sm:text-sm md:text-base lg:text-lg";

export const SITE_CARD_TITLE_CLASS =
  "text-[#0047AB] font-black text-[13px] md:text-[14px] uppercase tracking-[0.2em] leading-tight";

export const SITE_EYEBROW_CLASS =
  "text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#2563EB]";

export const SITE_FEATURE_TITLE_CLASS =
  "font-black text-[13px] md:text-[14px] leading-tight tracking-tight text-[#1A1A1A]";

export const SITE_STEP_TITLE_CLASS =
  "text-[#0047AB] font-black text-[13px] md:text-[14px] uppercase tracking-[0.2em] leading-tight";

export const SITE_TAG_CLASS =
  "text-[11px] md:text-[12px] font-bold uppercase tracking-wide text-[#0047AB]";

export const SITE_STAT_LABEL_CLASS =
  "text-[9px] md:text-[10px] font-bold uppercase leading-snug tracking-wide text-gray-500";

/** Prevent horizontal overflow — clip only below lg so sticky scroll works on desktop */
export const HOME_SECTION_CLASS = "relative w-full min-w-0 max-lg:overflow-x-clip";

/** Sticky left image on desktop (Insurance / Adjuster Training) */
export const HOME_STICKY_IMAGE_CLASS = "lg:sticky lg:top-28 xl:top-32 z-10 self-start";

export default function HomeContent({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${HOME_CONTENT_CLASS} ${className}`}>{children}</div>;
}
