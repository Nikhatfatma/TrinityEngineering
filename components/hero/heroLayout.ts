/** Fixed hero shell — keeps content and CTAs inside the hero on all tabs */
export const HERO_HEADER_CLASS =
  "relative flex h-[min(82dvh,580px)] w-full min-w-0 flex-col overflow-hidden bg-black sm:h-[min(84dvh,620px)] lg:h-[88dvh] xl:h-[90dvh]";

export const HERO_CONTENT_LAYER_CLASS =
  "relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden pb-8 pt-[4.5rem] sm:pb-10 sm:pt-[5.5rem]";

export const HERO_CONTENT_LAYER_CENTERED_CLASS = `${HERO_CONTENT_LAYER_CLASS} items-center justify-center`;

/** Centered hero title — sized to fit logo + copy + CTAs inside the hero */
export const HERO_CENTERED_TITLE_SIZE = "clamp(1.5rem, 2.9vw, 2.875rem)";

/** Home / Careers split-line hero title */
export const HERO_STACKED_TITLE_CLASS =
  "text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem]";

/** SWI hero logo image */
export const HERO_SWI_LOGO_WRAP_CLASS =
  "w-full max-w-[min(100%,220px)] shrink-0 sm:max-w-[235px] lg:max-w-[250px] xl:max-w-[265px]";

/** Fortified hero logo image */
export const HERO_FORTIFIED_LOGO_WRAP_CLASS =
  "mx-auto mb-3 w-[min(100%,130px)] sm:mb-4 sm:w-[min(100%,155px)] md:w-[180px]";
