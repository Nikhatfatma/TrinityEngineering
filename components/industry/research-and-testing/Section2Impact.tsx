"use client";

import {
  RT_CONTENT_WIDTH,
  RT_SECTION_2,
  RT_SECTION_SHELL,
} from "./researchAndTestingContent";
import {
  HOME_POINT_BODY_CLASS,
  HOME_POINT_TITLE_CLASS,
  HOME_SECTION_CLASS,
  HOME_SECTION_PY,
  HOME_STICKY_IMAGE_CLASS,
  SITE_SECTION_HEADING_CLASS,
} from "@/components/home/HomeContent";

export default function Section2Impact() {
  const textInsetLeft =
    "px-4 sm:px-6 md:px-8 lg:pl-[calc(2rem+max(0px,(min(100vw,1440px)-4rem-64rem)/2))]";
  const twoColTextRight = `${textInsetLeft} lg:pr-10 xl:pr-12`;
  const imageBleedClass =
    "max-lg:left-1/2 max-lg:w-[100dvw] max-lg:max-w-none max-lg:-translate-x-1/2 lg:w-full";
  const imageBlockClass = `relative min-h-[200px] w-full sm:min-h-[260px] lg:h-[340px] lg:min-h-[340px] xl:h-[380px] xl:min-h-[380px] ${imageBleedClass}`;

  return (
    <section
      id={RT_SECTION_2.id}
      className={`overflow-x-clip ${HOME_SECTION_CLASS} bg-white pt-6 pb-10 md:pt-8 md:pb-12`}
    >
      <div className="relative z-10">
        {/* Section Heading - Centered normally */}
        <div className={`${RT_SECTION_SHELL} mb-2`}>
          <div className={RT_CONTENT_WIDTH}>
            <h2 className={`w-full break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS} text-left`}>
              {RT_SECTION_2.sectionTitle}
            </h2>
          </div>
        </div>

        {/* Full Bleed Grid - Matches SWI Solution Section width but keeps natural aspect ratio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-0">
          {/* Left Column: Text Blocks */}
          <div className={`flex flex-col justify-start pb-6 pt-2 sm:pb-8 sm:pt-3 md:pb-10 md:pt-4 lg:order-1 lg:pb-12 lg:pt-4 ${twoColTextRight}`}>
            <div className="w-full min-w-0 space-y-6 md:space-y-8">
              {RT_SECTION_2.blocks.map((block, bIdx) => (
                <div
                  key={bIdx}
                  className="group w-full rounded-xl border border-gray-100 bg-[#F8FAFC] p-6 shadow-sm transition-all duration-500 hover:border-blue-100 hover:shadow-xl max-lg:rounded-2xl max-lg:p-5 md:p-8"
                >
                  {"eyebrow" in block && block.eyebrow && (
                    <span className={`${HOME_POINT_TITLE_CLASS} block mb-1 text-[11px] font-bold text-[#2563EB]`}>
                      {block.eyebrow}
                    </span>
                  )}
                  
                  {"title" in block && block.title && (
                    <h3 className={`${HOME_POINT_TITLE_CLASS} block text-[11px] font-bold text-[#2563EB] mt-1 mb-4 uppercase`}>
                      {block.title}
                    </h3>
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
          </div>

          {/* Right Column: Image */}
          <div className={`${imageBleedClass} lg:order-2 self-start lg:sticky lg:top-24 lg:pt-4 lg:mb-12`}>
            <img
              src={RT_SECTION_2.imageSrc}
              alt={RT_SECTION_2.imageAlt}
              className="block w-full h-auto object-contain object-center shadow-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
