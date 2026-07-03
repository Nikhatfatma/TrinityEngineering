"use client";

import { EDUCATION_COURSES, EDUCATION_SECTION_SHELL, EDUCATION_CONTENT_WIDTH } from "./educationContent";
import { SITE_BODY_CLASS, SITE_SECTION_HEADING_CLASS, SITE_TAB_SECTION_PY } from "@/components/home/HomeContent";

export default function EducationCoursesSection() {
  // Exact layout text inset selectors copied from Research & Testing page
  const textInsetLeft = "px-4 sm:px-6 md:px-8 lg:pl-[calc(2rem+max(0px,(min(100vw,1440px)-4rem-64rem)/2))]";
  const twoColTextRight = `${textInsetLeft} lg:pr-10 xl:pr-12`;

  const textInsetRight = "px-4 sm:px-6 md:px-8 lg:pr-[calc(2rem+max(0px,(min(100vw,1440px)-4rem-64rem)/2))]";
  const twoColTextLeft = `${textInsetRight} lg:pl-10 xl:pl-12`;

  const imageBleedClass = "w-full max-lg:mb-10 lg:w-full";

  return (
    <>
      {EDUCATION_COURSES.map((course, idx) => {
        const bgClass = course.number === "1" ? "bg-white" : (idx % 2 === 0 ? "bg-[#F4F7FA]" : "bg-white");
        const borderClass = idx > 0 && idx !== 1 ? "border-t border-gray-200/80" : "";

        // Course 1: Advanced Property Claims Training (Copy of Section 1 Research)
        if (course.number === "1") {
          return (
            <section
              key={course.number}
              className={`overflow-x-clip ${bgClass} ${borderClass} ${SITE_TAB_SECTION_PY}`}
            >
              <div className={EDUCATION_SECTION_SHELL}>
                <div className={EDUCATION_CONTENT_WIDTH}>
                  {/* Title as main Heading */}
                  <h2
                    className={`mb-6 break-words text-left text-[#1A1A1A] md:mb-8 ${SITE_SECTION_HEADING_CLASS}`}
                  >
                    {course.title}
                  </h2>

                  {/* Description body paragraphs */}
                  <div className="space-y-4 text-left text-[15px] leading-relaxed font-medium text-[#333333]">
                    <p>{course.description}</p>
                  </div>
                </div>
              </div>

              {/* Image below text - full bleed (no rounded corners, no padding!) */}
              <div className="mt-10 w-full md:mt-14">
                <img
                  src={course.imageSrc}
                  alt={course.imageAlt}
                  className="block h-auto max-h-[360px] w-full object-cover sm:max-h-[480px] lg:max-h-[600px] xl:max-h-[680px]"
                />
              </div>
            </section>
          );
        }

        // Course 4: Centered Stacked Layout (Title -> Image -> Subtext/Instructor -> Description)
        if (course.number === "4") {
          return (
            <section
              key={course.number}
              className={`overflow-x-clip ${bgClass} ${borderClass} ${SITE_TAB_SECTION_PY}`}
            >
              <div className={EDUCATION_SECTION_SHELL}>
                <div className={`${EDUCATION_CONTENT_WIDTH} space-y-6 text-center max-w-3xl mx-auto w-full`}>
                  <h2 className={`text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS} leading-tight text-center`}>
                    {course.title}
                  </h2>

                  {/* Centered Globe Graphic */}
                  <div className="flex justify-center py-4">
                    <div className="w-full max-w-[280px] md:max-w-[340px] transition-transform duration-500 hover:scale-102">
                      <img
                        src={course.imageSrc}
                        alt={course.imageAlt}
                        className="h-auto w-full object-contain mx-auto"
                      />
                    </div>
                  </div>

                  {course.instructor && (
                    <h3 className="block text-[14px] font-extrabold text-[#2563EB] mt-1 mb-6 uppercase tracking-[0.15em] text-center">
                      Instructor: {course.instructor}
                    </h3>
                  )}

                  <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed font-medium pt-1 text-center">
                    {course.description}
                  </p>
                </div>
              </div>
            </section>
          );
        }

        // Course 2, 6: Text on Left (order-1), sticky full-bleed Image on Right (order-2)
        // Copy of Section 2 Impact layout
        const isTextLeft = course.number === "2" || course.number === "6";

        if (isTextLeft) {
          return (
            <section
              key={course.number}
              className={`overflow-x-clip ${bgClass} ${borderClass} pt-6 pb-10 md:pt-8 md:pb-12`}
            >
              <div className="relative z-10">
                {/* Heading */}
                <div className={`${EDUCATION_SECTION_SHELL} mb-4 md:mb-6`}>
                  <div className={EDUCATION_CONTENT_WIDTH}>
                    <h2 className={`w-full break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS} text-left`}>
                      {course.title}
                    </h2>
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-0">
                  {/* Left Column: Text Block Card */}
                  <div className={`flex flex-col justify-start pb-6 pt-2 sm:pb-8 sm:pt-3 md:pb-10 md:pt-4 lg:order-1 lg:pb-12 lg:pt-4 ${twoColTextRight}`}>
                    <div className="w-full min-w-0">
                      <div className="group w-full rounded-xl border border-gray-100 bg-[#F8FAFC] p-6 shadow-sm transition-all duration-500 hover:border-blue-100 hover:shadow-xl max-lg:rounded-2xl max-lg:p-5 md:p-8">

                        {course.instructor && (
                          <h3 className="block text-[14px] font-extrabold text-[#2563EB] mt-1 mb-6 uppercase tracking-[0.15em]">
                            Instructor: {course.instructor}
                          </h3>
                        )}

                        <div className="space-y-4 text-[15px] leading-relaxed text-[#333333] mt-3 font-medium opacity-85 group-hover:opacity-100 transition-opacity duration-350">
                          <p>{course.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Image (full bleed, no rounded corners!) */}
                  <div className={`${imageBleedClass} lg:order-2 self-start lg:sticky lg:top-24 lg:pt-4 lg:mb-12`}>
                    <img
                      src={course.imageSrc}
                      alt={course.imageAlt}
                      className="block w-full h-auto max-h-[360px] object-cover sm:max-h-[480px] lg:max-h-none lg:object-contain object-center shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // Course 3, 5: sticky full-bleed Image on Left (order-1), Text on Right (order-2)
        // Copy of Section 3 Desaturation layout
        return (
          <section
            key={course.number}
            className={`overflow-x-clip ${bgClass} ${borderClass} pt-6 pb-10 md:pt-8 md:pb-12`}
          >
            <div className="relative z-10">
              {/* Heading */}
              <div className={`${EDUCATION_SECTION_SHELL} mb-4 md:mb-6`}>
                <div className={EDUCATION_CONTENT_WIDTH}>
                  <h2 className={`w-full break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS} text-left`}>
                    {course.title}
                  </h2>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-0">
                {/* Left Column: Image (full bleed, no rounded corners!) */}
                <div className={`${imageBleedClass} lg:order-1 self-start lg:sticky lg:top-24 lg:pt-4 lg:mb-12`}>
                  <img
                    src={course.imageSrc}
                    alt={course.imageAlt}
                    className="block w-full h-auto max-h-[360px] object-cover sm:max-h-[480px] lg:max-h-none lg:object-contain object-center shadow-sm"
                  />
                </div>

                {/* Right Column: Text Block Card */}
                <div className={`flex flex-col justify-start pb-6 pt-2 sm:pb-8 sm:pt-3 md:pb-10 md:pt-4 lg:order-2 lg:pb-12 lg:pt-4 ${twoColTextLeft}`}>
                  <div className="w-full min-w-0">
                    <div className="group w-full rounded-xl border border-gray-100 bg-[#F8FAFC] p-6 shadow-sm transition-all duration-500 hover:border-blue-100 hover:shadow-xl max-lg:rounded-2xl max-lg:p-5 md:p-8">

                      {course.instructor && (
                        <h3 className="block text-[14px] font-extrabold text-[#2563EB] mt-1 mb-6 uppercase tracking-[0.15em]">
                          Instructor: {course.instructor}
                        </h3>
                      )}

                      <div className="space-y-4 text-[15px] leading-relaxed text-[#333333] mt-3 font-medium opacity-85 group-hover:opacity-100 transition-opacity duration-350">
                        <p>{course.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
