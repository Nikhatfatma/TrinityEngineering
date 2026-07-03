import Link from "next/link";
import { SWI_CONTENT_WIDTH, SWI_CTA, SWI_SECTION_SHELL } from "./swiContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_CTA_SECTION_CLASS,
} from "@/components/home/HomeContent";

const CTA_EYEBROW_CLASS =
  "text-[14px] font-bold normal-case tracking-normal text-white md:text-[15px]";

export default function SwiCtaSection() {
  return (
    <section
      id={SWI_CTA.id}
      className={SITE_TAB_CTA_SECTION_CLASS}
    >
      <div className="hero-media-grid [&::after]:hidden">
        <img
          src={SWI_CTA.backgroundImage}
          alt=""
          className="block h-full w-full min-h-full min-w-full object-cover"
        />
        <div
          className="z-[1] bg-[rgba(14,24,47,0.7)] backdrop-blur-[5px] pointer-events-none"
          aria-hidden
        />
      </div>

      <div className={`relative z-10 text-center ${SWI_SECTION_SHELL}`}>
        <div className={SWI_CONTENT_WIDTH}>
          <p className={CTA_EYEBROW_CLASS}>{SWI_CTA.eyebrow}</p>
          <h2
            className={`mt-4 break-words text-white ${SITE_SECTION_HEADING_CLASS}`}
          >
            <span className="block">{SWI_CTA.titleLine1}</span>
            <span className="block">{SWI_CTA.titleLine2}</span>
          </h2>
          <p className={`mx-auto mt-4 max-w-3xl px-1 text-white/80 ${SITE_BODY_CLASS}`}>{SWI_CTA.subtitle}</p>
          <Link
            href={SWI_CTA.cta.href}
            className="mx-auto mt-6 inline-flex w-fit max-w-[min(100%,16.5rem)] items-center justify-center bg-[#00A859] px-5 py-2 text-[10px] font-bold normal-case leading-snug tracking-normal text-white transition-colors hover:bg-[#008f4c] sm:mt-8 sm:max-w-none sm:min-w-[14rem] sm:px-8 sm:py-3 sm:text-sm md:mt-10 md:text-base"
          >
            {SWI_CTA.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
