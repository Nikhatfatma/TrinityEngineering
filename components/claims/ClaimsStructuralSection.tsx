import {
  CLAIMS_CONTENT_WIDTH,
  CLAIMS_SECTION_SHELL,
  CLAIMS_STRUCTURAL_SECTION,
} from "./claimsContent";
import {
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_SECTION_PY,
  HOME_POINT_BODY_CLASS,
  HOME_POINT_TITLE_CLASS
} from "@/components/home/HomeContent";

export default function ClaimsStructuralSection() {
  const textInsetRight =
    "px-4 sm:px-6 md:px-8 lg:pr-[calc(2rem+max(0px,(min(100vw,1440px)-4rem-64rem)/2))]";
  const twoColTextLeft = `${textInsetRight} lg:pl-10 xl:pl-12`;
  const imageBleedClass =
    "w-full max-lg:mb-10 lg:w-full";

  return (
    <section id="structural-support" className={`overflow-x-clip border-t border-gray-200 bg-white ${SITE_TAB_SECTION_PY}`}>
      <div className="relative z-10">
        {/* Section Heading */}
        <div className={`${CLAIMS_SECTION_SHELL} mb-5`}>
          <div className={CLAIMS_CONTENT_WIDTH}>
            <h2 className={`break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}>
              {CLAIMS_STRUCTURAL_SECTION.title}
            </h2>
            {"tags" in CLAIMS_STRUCTURAL_SECTION && CLAIMS_STRUCTURAL_SECTION.tags && (
              <div className="mt-8 flex flex-wrap gap-2">
                {CLAIMS_STRUCTURAL_SECTION.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 text-blue-600 text-[11px] font-medium rounded-sm whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Full Bleed Grid — image LEFT, text RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-0 mt-8 md:mt-10 lg:mt-12">
          {/* Left Column: Image */}
          <div className={`${imageBleedClass} lg:order-1 self-start lg:sticky lg:top-24 lg:pt-4 lg:mb-12`}>
            <img
              src={CLAIMS_STRUCTURAL_SECTION.imageSrc}
              alt={CLAIMS_STRUCTURAL_SECTION.imageAlt}
              className="block w-full h-auto max-h-[360px] object-cover sm:max-h-[480px] lg:max-h-none lg:object-contain object-center shadow-sm"
            />
          </div>

          {/* Right Column: Text Blocks */}
          <div className={`flex flex-col justify-start pb-6 pt-2 sm:pb-8 sm:pt-3 md:pb-10 md:pt-4 lg:order-2 lg:pb-12 lg:pt-4 ${twoColTextLeft}`}>
            <div className="w-full min-w-0 space-y-6 md:space-y-8">
              {CLAIMS_STRUCTURAL_SECTION.blocks.map((block, bIdx) => (
                <div
                  key={bIdx}
                  className="group w-full rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-500 hover:border-blue-100 hover:shadow-xl max-lg:rounded-2xl max-lg:p-5 md:p-8"
                >
                  {"title" in block && block.title && (
                    <h3 className={`${HOME_POINT_TITLE_CLASS} block text-[11px] font-extrabold text-[#2563EB] mb-6 uppercase tracking-[0.15em]`}>
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
        </div>
      </div>
    </section>
  );
}
