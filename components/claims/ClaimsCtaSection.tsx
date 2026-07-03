import Link from "next/link";
import { Send } from "lucide-react";
import { CLAIMS_CONTENT_WIDTH, CLAIMS_CTA, CLAIMS_SECTION_SHELL } from "./claimsContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_CTA_SECTION_CLASS,
} from "@/components/home/HomeContent";

const CTA_EYEBROW_CLASS =
  "text-[14px] font-bold normal-case tracking-normal text-white md:text-[15px]";

export default function ClaimsCtaSection() {
  return (
    <section className={`${SITE_TAB_CTA_SECTION_CLASS} overflow-hidden`}>
      <div className="hero-media-grid [&::after]:hidden">
        <img
          src="/claims-cta-background.png"
          alt="Forensic Engineering Inspection"
          className="block h-full w-full min-h-full min-w-full object-cover object-[center_30%]"
        />
        <div
          className="z-[1] bg-[rgba(14,24,47,0.7)] backdrop-blur-[5px] pointer-events-none"
          aria-hidden
        />
      </div>

      <div className={`relative z-10 text-center ${CLAIMS_SECTION_SHELL}`}>
        <div className={CLAIMS_CONTENT_WIDTH}>
          <p className={CTA_EYEBROW_CLASS}>{CLAIMS_CTA.eyebrow}</p>
          <h2 className={`mt-4 break-words text-white ${SITE_SECTION_HEADING_CLASS}`}>
            <span className="block">{CLAIMS_CTA.titleLine1}</span>
            <span className="block">{CLAIMS_CTA.titleLine2}</span>
          </h2>
          <p className={`mt-4 text-white/80 ${SITE_BODY_CLASS}`}>{CLAIMS_CTA.subtitle}</p>
          <Link
            href={CLAIMS_CTA.cta.href}
            className="group mt-8 inline-flex min-w-[12rem] items-center justify-center gap-2 rounded-md border border-white bg-transparent px-8 py-3 text-[11px] font-bold normal-case tracking-normal text-white transition-all duration-300 hover:bg-[#0047AB] hover:border-[#0047AB] sm:mt-10 sm:min-w-[14rem] sm:text-sm md:text-base"
          >
            <Send className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            {CLAIMS_CTA.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

