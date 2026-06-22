import Link from "next/link";
import { Send } from "lucide-react";
import {
  IR_CONTENT_WIDTH,
  IR_CTA,
  IR_SECTION_SHELL,
} from "./infraredThermographyContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_CTA_SECTION_CLASS,
} from "@/components/home/HomeContent";

export default function InfraredCtaSection() {
  return (
    <section
      id={IR_CTA.id}
      className={`${SITE_TAB_CTA_SECTION_CLASS} overflow-hidden border-t border-gray-200/80`}
    >
      <img
        src={IR_CTA.backgroundImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[#0F172A]/85" />

      <div className={`relative z-10 text-center text-white ${IR_SECTION_SHELL}`}>
        <div className={IR_CONTENT_WIDTH}>
          <h2 className={`break-words text-white ${SITE_SECTION_HEADING_CLASS}`}>
            {IR_CTA.title}
          </h2>
          <div className={`mx-auto mt-4 max-w-3xl space-y-4 text-white/90 ${SITE_BODY_CLASS}`}>
            {IR_CTA.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
            <p>
              {IR_CTA.emailLead}{" "}
              <Link
                href={`mailto:${IR_CTA.email}`}
                className="break-all font-semibold text-white underline hover:text-white/90 sm:break-words"
              >
                {IR_CTA.email}
              </Link>{" "}
              {IR_CTA.emailSuffix}
            </p>
          </div>
          <Link
            href={IR_CTA.cta.href}
            className="group mx-auto mt-6 inline-flex w-fit max-w-[220px] items-center justify-center gap-1.5 rounded-md border-2 border-white bg-transparent px-3.5 py-1.5 text-[10px] font-bold normal-case leading-snug tracking-normal text-white transition-all duration-300 hover:border-[#0047AB] hover:bg-[#0047AB] sm:mt-8 sm:w-auto sm:max-w-none sm:gap-2.5 sm:px-7 sm:py-3 sm:text-sm md:text-base"
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            {IR_CTA.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
