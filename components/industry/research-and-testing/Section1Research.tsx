"use client";

import {
  RT_CONTENT_WIDTH,
  RT_SECTION_1,
  RT_SECTION_SHELL,
} from "./researchAndTestingContent";
import {
  SITE_BODY_CLASS,
  SITE_TAB_SECTION_PY,
  SITE_SECTION_HEADING_CLASS,
} from "@/components/home/HomeContent";

export default function Section1Research() {
  return (
    <section
      id={RT_SECTION_1.id}
      className={`overflow-x-clip bg-white ${SITE_TAB_SECTION_PY}`}
    >
      <div className={RT_SECTION_SHELL}>
        <div className={RT_CONTENT_WIDTH}>
          {/* Main Section Heading */}
          <h2
            className={`mb-6 break-words text-left text-[#1A1A1A] md:mb-8 ${SITE_SECTION_HEADING_CLASS}`}
          >
            {RT_SECTION_1.eyebrow}
          </h2>

          {/* Blue subheading */}
          <h3 className="mb-5 text-left text-[17px] font-semibold leading-snug text-[#0047AB] sm:text-[18px] md:mb-6 md:text-[19px] lg:text-[20px]">
            {RT_SECTION_1.title}
          </h3>

          {/* Body paragraphs stacked */}
          <div className={`space-y-4 text-left ${SITE_BODY_CLASS} text-[#333333]`}>
            {RT_SECTION_1.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Full-width Image below Section 1 Text */}
      <div className="mt-10 w-full md:mt-14">
        <img
          src={RT_SECTION_1.imageSrc}
          alt={RT_SECTION_1.imageAlt}
          className="block h-auto max-h-[360px] w-full object-cover sm:max-h-[480px] lg:max-h-[600px] xl:max-h-[680px]"
        />
      </div>
    </section>
  );
}
