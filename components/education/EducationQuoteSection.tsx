"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import { EDUCATION_QUOTE, EDUCATION_SECTION_SHELL, EDUCATION_CONTENT_WIDTH } from "./educationContent";
import { SITE_BODY_CLASS, SITE_TAB_CTA_SECTION_CLASS, SITE_SECTION_HEADING_CLASS } from "@/components/home/HomeContent";

export default function EducationQuoteSection() {
  return (
    <section className="relative flex min-h-[22rem] items-center overflow-x-clip py-8 sm:min-h-[24rem] sm:py-10 lg:min-h-[26rem] lg:py-12 overflow-hidden">
      {/* Background Media Container */}
      <div className="hero-media-grid [&::after]:hidden">
        <img
          src="/education/quote-bg.png"
          alt=""
          className="block h-full w-full min-h-full min-w-full object-cover object-center"
        />
        <div
          className="z-[1] bg-[rgba(10,18,36,0.85)] backdrop-blur-[6px] pointer-events-none"
          aria-hidden
        />
      </div>

      <div className={`relative z-10 text-center text-white ${EDUCATION_SECTION_SHELL}`}>
        <div className={`${EDUCATION_CONTENT_WIDTH} mx-auto max-w-4xl px-4`}>
          {/* Quote Block */}
          <div className="flex flex-col gap-1">
            <h2
              className={`mx-auto w-full max-w-[1132px] text-white text-center ${SITE_SECTION_HEADING_CLASS}`}
              style={{
                fontFamily: "'Mulish', sans-serif",
                textTransform: "capitalize",
              }}
            >
              <span className="block">&quot;If you can&apos;t explain it simply,</span>
              <span className="block">you don&apos;t understand it well enough&quot;</span>
            </h2>
            <p
              className={`mx-auto w-full max-w-[1132px] text-white text-center ${SITE_SECTION_HEADING_CLASS}`}
              style={{
                fontFamily: "'Mulish', sans-serif",
                textTransform: "capitalize",
              }}
            >
              — {EDUCATION_QUOTE.author}
            </p>
          </div>

          {/* Description Paragraph */}
          <p className={`mx-auto mt-6 max-w-3xl text-white/80 ${SITE_BODY_CLASS} leading-relaxed`}>
            {EDUCATION_QUOTE.description}
          </p>

          {/* CTA Link Button */}
          <Link
            href={EDUCATION_QUOTE.cta.href}
            className="group mt-6 inline-flex min-w-[12rem] items-center justify-center gap-2 rounded-md border border-white bg-transparent px-8 py-3 text-[11px] font-bold normal-case tracking-normal text-white transition-all duration-300 hover:bg-[#0047AB] hover:border-[#0047AB] sm:mt-8 sm:min-w-[14rem] sm:text-sm md:text-base shadow-lg"
          >
            <Send className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            {EDUCATION_QUOTE.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
