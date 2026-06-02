import type { ReactNode } from "react";

/** Inner content width — section backgrounds stay full viewport width */
export const HOME_CONTENT_CLASS =
  "mx-auto w-full max-w-[1440px] min-w-0 px-4 sm:px-6 md:px-8 lg:px-8";

/** Pull left column image to the viewport left edge (desktop only) */
export const HOME_IMAGE_BLEED_LEFT =
  "max-lg:ml-0 max-lg:w-full lg:ml-[calc((100%-100vw)/2)] lg:w-[calc(100%+(100vw-100%)/2)]";

/** Full-width image below lg — matches Weather section (mobile + tablet) */
export const HOME_STACKED_IMAGE_CLASS =
  "block w-full h-auto max-lg:object-contain max-lg:object-center";

/** Section h2 — bold below lg; desktop weight unchanged per section */
export const HOME_SECTION_HEADING = "max-lg:font-bold";

/** Shared typography — match home page across all tabs */
export const SITE_SECTION_HEADING_STYLE = {
  fontSize: "clamp(0.8125rem, 2.19vw, 2.625rem)",
} as const;

export const SITE_SECTION_HEADING_CLASS = `tracking-tight leading-[1.2] lg:font-semibold ${HOME_SECTION_HEADING}`;

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
