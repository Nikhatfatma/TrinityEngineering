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
