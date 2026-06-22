"use client";

import {
  RT_CONTENT_WIDTH,
  RT_SECTION_4,
  RT_SECTION_SHELL,
} from "./researchAndTestingContent";
import {
  HOME_POINT_BODY_CLASS,
  HOME_POINT_TITLE_CLASS,
  HOME_SECTION_CLASS,
  HOME_SECTION_PY,
  SITE_SECTION_HEADING_CLASS,
} from "@/components/home/HomeContent";

export default function Section4Repairability() {
  return (
    <section
      id={RT_SECTION_4.id}
      className={`${HOME_SECTION_CLASS} bg-[#F4F7FA] ${HOME_SECTION_PY}`}
    >
      <div className={`${RT_SECTION_SHELL} relative z-10 pt-2`}>
        <div className={RT_CONTENT_WIDTH}>
          {/* Section Heading */}
          <div className="mb-8 text-left md:mb-10">
            <h2
              className={`w-full break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS} flex flex-wrap items-center gap-x-3 gap-y-1`}
            >
              <span>Repairability Evaluation and Repair Research: The</span>
              <img
                src="/industry/tri-logo.png"
                alt="TRI"
                className="h-[1.1em] md:h-[1.2em] w-auto object-contain inline-block"
              />
              <span>Method</span>
            </h2>
          </div>

          {/* Two-Column Grid */}
          <div className="grid w-full min-w-0 grid-cols-1 items-start gap-8 max-lg:gap-y-6 lg:grid-cols-[minmax(0,1fr)_45%] xl:grid-cols-[minmax(0,1fr)_42%] xl:gap-12">
            
            {/* Left Column: Text Blocks */}
            <div className="max-lg:col-span-full min-w-0 w-full space-y-6 md:space-y-8">
              {RT_SECTION_4.blocks.map((block, bIdx) => (
                <div
                  key={bIdx}
                  className="group w-full rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-500 hover:border-blue-100 hover:shadow-xl max-lg:rounded-2xl max-lg:p-5 md:p-8"
                >
                  {"eyebrow" in block && block.eyebrow && (
                    <span className={`${HOME_POINT_TITLE_CLASS} block mb-1 text-[11px] font-bold text-[#2563EB]`}>
                      {block.eyebrow}
                    </span>
                  )}
                  

                  <div className={`space-y-4 ${HOME_POINT_BODY_CLASS} mt-3`}>
                    {block.paragraphs.map((para, pIdx) => (
                      <p key={pIdx} className="opacity-85 group-hover:opacity-100 transition-opacity duration-350">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Sticky Image */}
            <div
              className={`w-full min-w-0 max-lg:col-span-full lg:sticky lg:top-24 self-start space-y-4`}
            >
              <img
                src="/industry/repairability-calculator-page1.png"
                alt="Trinity Repairability Calculator - Page 1"
                className="block w-full h-auto object-contain object-center rounded-lg border border-gray-200 shadow-sm"
              />
              <img
                src="/industry/repairability-calculator-page2.png"
                alt="Trinity Repairability Calculator - Page 2"
                className="block w-full h-auto object-contain object-center rounded-lg border border-gray-200 shadow-sm"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
