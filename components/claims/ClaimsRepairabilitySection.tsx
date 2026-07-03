import {
  CLAIMS_CONTENT_WIDTH,
  CLAIMS_SECTION_SHELL,
  CLAIMS_REPAIRABILITY_SECTION,
} from "./claimsContent";
import {
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_SECTION_PY,
  HOME_POINT_BODY_CLASS,
  HOME_POINT_TITLE_CLASS
} from "@/components/home/HomeContent";

export default function ClaimsRepairabilitySection() {
  const textInsetLeft =
    "px-4 sm:px-6 md:px-8 lg:pl-[calc(2rem+max(0px,(min(100vw,1440px)-4rem-64rem)/2))]";
  const twoColTextRight = `${textInsetLeft} lg:pr-10 xl:pr-12`;
  const imageBleedClass = "w-full max-lg:mb-10 lg:w-full";

  return (
    <section id="repairability" className={`overflow-x-clip border-t border-gray-200 bg-[#F4F7FA] ${SITE_TAB_SECTION_PY}`}>
      <div className="relative z-10">
        {/* Section Heading */}
        <div className={`${CLAIMS_SECTION_SHELL} mb-5`}>
          <div className={CLAIMS_CONTENT_WIDTH}>
            <h2 className={`break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}>
              {CLAIMS_REPAIRABILITY_SECTION.title}
            </h2>
          </div>
        </div>

        {/* Full Bleed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-0 mt-8 md:mt-10 lg:mt-12">
          {/* Left Column: Text Blocks */}
          <div className={`flex flex-col justify-start pb-6 pt-2 sm:pb-8 sm:pt-3 md:pb-10 md:pt-4 lg:order-1 lg:pb-12 lg:pt-4 ${twoColTextRight}`}>
            <div className="w-full min-w-0 space-y-6 md:space-y-8">
              {CLAIMS_REPAIRABILITY_SECTION.blocks.map((block, bIdx) => (
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

                  {"listItems" in block && block.listItems && (
                    <ul className={`mt-4 space-y-2 ${HOME_POINT_BODY_CLASS}`}>
                      {block.listItems.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-center gap-2 opacity-85 group-hover:opacity-100 transition-opacity duration-350">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Image */}
          <div className={`${imageBleedClass} lg:order-2 self-start lg:sticky lg:top-24 lg:pt-4 lg:mb-12`}>
            <img
              src={CLAIMS_REPAIRABILITY_SECTION.imageSrc}
              alt={CLAIMS_REPAIRABILITY_SECTION.imageAlt}
              className="block w-full h-auto max-h-[360px] object-cover sm:max-h-[480px] lg:max-h-none lg:object-contain object-center shadow-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
