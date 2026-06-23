"use client";

import { useState } from "react";
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
  const [showPopup, setShowPopup] = useState(false);

  return (
    <section
      id={RT_SECTION_4.id}
      className={`${HOME_SECTION_CLASS} bg-[#F4F7FA] pt-2 pb-10 lg:pt-4 lg:pb-16`}
    >
      <div className={`${RT_SECTION_SHELL} relative z-10 pt-2`}>
        <div className={RT_CONTENT_WIDTH}>
          {/* Section Heading */}
          <div className="mb-8 text-left md:mb-10">
            <h2
              className={`w-full break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS} leading-[1.3]`}
            >
              Repairability Evaluation and Repair Research: The{" "}

              {/* TRI Logo with Figma-style hover popup */}
              <span
                className="relative inline-block align-middle mx-1.5 -translate-y-[2px]"
                onMouseEnter={() => setShowPopup(true)}
                onMouseLeave={() => setShowPopup(false)}
              >
                <img
                  src="/industry/tri-logo.png"
                  alt="TRI"
                  className="h-[1em] md:h-[1.1em] w-auto object-contain inline-block cursor-pointer"
                />

                {/* Popup */}
                <span
                  className={`
                    pointer-events-none absolute left-1/2 top-[calc(100%+12px)] z-50
                    w-[380px] max-w-[90vw] -translate-x-1/2
                    rounded-2xl border border-gray-200 bg-white shadow-2xl
                    transition-all duration-200 ease-out
                    ${showPopup ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"}
                  `}
                  style={{ transformOrigin: "top center" }}
                >
                  {/* Popup arrow */}
                  <span className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 rounded-sm border-l border-t border-gray-200 bg-white" />

                  {/* Popup header */}
                  <span className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                    <img
                      src="/industry/tri-logo.png"
                      alt="TRI"
                      className="h-8 w-auto object-contain flex-shrink-0"
                    />
                    <span className="flex flex-col leading-tight">
                      <span className="text-[13px] font-semibold text-[#1A1A1A]">
                        Trinity Repairability Index
                      </span>
                      <span className="text-[11px] text-gray-400 font-normal">
                        Roof Condition Assessment Report
                      </span>
                    </span>
                  </span>

                  {/* Popup image previews */}
                  <span className="flex flex-col gap-0 overflow-hidden rounded-b-2xl max-h-[420px] overflow-y-auto">
                    <img
                      src="/industry/repairability-calculator-page1.png"
                      alt="Trinity Repairability Calculator - Page 1"
                      className="w-full h-auto object-contain"
                    />
                    <img
                      src="/industry/repairability-calculator-page2.png"
                      alt="Trinity Repairability Calculator - Page 2"
                      className="w-full h-auto object-contain border-t border-gray-100"
                    />
                  </span>
                </span>
              </span>

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
