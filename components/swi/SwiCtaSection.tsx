import Link from "next/link";
import { SWI_CONTENT_WIDTH, SWI_CTA, SWI_SECTION_SHELL } from "./swiContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_SECTION_HEADING_STYLE,
} from "@/components/home/HomeContent";

const CTA_EYEBROW_CLASS =
  "text-[11px] font-medium normal-case tracking-normal text-[#60A5FA] md:text-[12px]";

export default function SwiCtaSection() {
  return (
    <section
      id={SWI_CTA.id}
      className="relative overflow-hidden bg-[#000B29] py-16 md:py-20 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(59,130,246,0.35) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(37,99,235,0.25) 0%, transparent 40%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className={`relative z-10 text-center ${SWI_SECTION_SHELL}`}>
        <div className={SWI_CONTENT_WIDTH}>
          <p className={CTA_EYEBROW_CLASS}>{SWI_CTA.eyebrow}</p>
          <h2
            className={`mt-4 text-white ${SITE_SECTION_HEADING_CLASS}`}
            style={SITE_SECTION_HEADING_STYLE}
          >
            <span className="block">{SWI_CTA.titleLine1}</span>
            <span className="block">{SWI_CTA.titleLine2}</span>
          </h2>
          <p className={`mt-4 text-white/80 ${SITE_BODY_CLASS}`}>{SWI_CTA.subtitle}</p>
          <Link
            href={SWI_CTA.cta.href}
            className="mt-8 inline-flex min-w-[12rem] items-center justify-center bg-[#00A859] px-8 py-3 text-[11px] font-bold normal-case tracking-normal text-white transition-colors hover:bg-[#008f4c] sm:mt-10 sm:min-w-[14rem] sm:text-sm md:text-base"
          >
            {SWI_CTA.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
