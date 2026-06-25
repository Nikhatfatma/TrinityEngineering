"use client";

import { useState, useRef } from "react";
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

const REPAIRABILITY_IMAGES = [
  {
    src: "/industry/repairability-calculator-page1.png",
    alt: "Trinity Repairability Calculator - Page 1",
  },
  {
    src: "/industry/repairability-calculator-page2.png",
    alt: "Trinity Repairability Calculator - Page 2",
  },
];

export default function Section4Repairability() {
  const [showPopup, setShowPopup] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (imgSrc: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredImage(imgSrc);
  };

  const handleThumbnailMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredImage(null);
    }, 600); // Gives user enough time to move mouse to the center popup
  };

  const handlePopupImageMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredImage(null);
    }, 0); // Closes instantly when leaving the enlarged image
  };

  return (
    <>
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

                  {/* Popup Wrapper with padding bridge */}
                  <span
                    className={`
                      absolute left-1/2 top-full pt-[12px] z-50
                      w-[380px] max-w-[90vw] -translate-x-1/2
                      transition-all duration-200 ease-out
                      ${showPopup ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-2 scale-95 pointer-events-none"}
                    `}
                    style={{ transformOrigin: "top center" }}
                  >
                    <span className="block w-full rounded-2xl border border-gray-200 bg-white shadow-2xl relative">
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

              {/* Right Column: Sticky Images — hover to enlarge */}
              <div className="w-full min-w-0 max-lg:col-span-full lg:sticky lg:top-24 self-start space-y-4">
                {REPAIRABILITY_IMAGES.map((img, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => handleMouseEnter(img.src)}
                    onMouseLeave={handleThumbnailMouseLeave}
                    className="group/img relative block w-full cursor-zoom-in"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="block w-full h-auto object-contain object-center border border-gray-200 shadow-sm transition-all duration-300 group-hover/img:border-blue-300 group-hover/img:shadow-xl group-hover/img:shadow-blue-100/40"
                    />
                    {/* Expandable Magnifier Hint */}
                    <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md p-2 text-white shadow-lg ring-1 ring-white/20 transition-all duration-500 ease-out group-hover/img:bg-[#0047AB]/90 group-hover/img:scale-[1.02]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                      <div className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-out group-hover/img:grid-cols-[1fr]">
                        <span className="overflow-hidden text-[10px] font-bold tracking-widest whitespace-nowrap opacity-0 transition-opacity duration-300 delay-100 group-hover/img:opacity-100 group-hover/img:pl-2 group-hover/img:pr-0.5">
                          ENLARGE
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Hover Overlay — rendered outside the section to avoid z-index issues */}
      {hoveredImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[lbFadeIn_150ms_ease-out]" />

          {/* Enlarged image */}
          <div 
            className="relative max-w-4xl w-[92vw] max-h-[88vh] flex items-center justify-center animate-[lbScaleIn_200ms_ease-out]"
          >
            <img
              src={hoveredImage}
              alt="Enlarged view"
              className="max-w-full h-auto max-h-[88vh] object-contain shadow-2xl border border-white/10 bg-white pointer-events-auto"
              onMouseEnter={() => handleMouseEnter(hoveredImage)}
              onMouseLeave={handlePopupImageMouseLeave}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes lbFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes lbScaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
