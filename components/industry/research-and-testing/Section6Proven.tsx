"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import {
  RT_CONTENT_WIDTH,
  RT_SECTION_6,
  RT_SECTION_SHELL,
} from "./researchAndTestingContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_CTA_SECTION_CLASS,
} from "@/components/home/HomeContent";

export default function Section6Proven() {
  return (
    <section
      id={RT_SECTION_6.id}
      className={`${SITE_TAB_CTA_SECTION_CLASS} overflow-hidden border-t border-gray-200/80`}
    >
      {/* Background Image */}
      <img
        src="/industry/team-testing.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[#0F172A]/85" />

      {/* Content */}
      <div className={`relative z-10 text-center text-white ${RT_SECTION_SHELL}`}>
        <div className={RT_CONTENT_WIDTH}>
          <h2 className={`break-words text-white ${SITE_SECTION_HEADING_CLASS}`}>
            {RT_SECTION_6.title}
          </h2>
          
          <div className={`mx-auto mt-6 max-w-3xl space-y-4 text-white/90 ${SITE_BODY_CLASS}`}>
            {RT_SECTION_6.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-sm md:text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
            
            <p className="text-xs md:text-sm text-gray-300 font-medium">
              {RT_SECTION_6.emailLead}{" "}
              <Link
                href={`mailto:${RT_SECTION_6.email}`}
                className="font-bold text-[#60A5FA] underline hover:text-[#93C5FD]"
              >
                {RT_SECTION_6.email}
              </Link>{" "}
              {RT_SECTION_6.emailSuffix}
            </p>
          </div>

          <Link
            href="/submit-inspection"
            className="group mx-auto mt-8 inline-flex w-fit items-center justify-center gap-2 rounded-md border-2 border-white bg-transparent px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-[#0047AB] hover:bg-[#0047AB] sm:mt-10 sm:px-8 sm:py-3.5 sm:text-[12px]"
          >
            <Send className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
            Submit Inspection
          </Link>
        </div>
      </div>
    </section>
  );
}
