import { SWI_IMAGE_BLOCK_CLASS, SWI_SOLUTION, SWI_TAB_TWO_COL_TEXT_IMAGE_RIGHT } from "./swiContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_SECTION_PY,
} from "@/components/home/HomeContent";

function ComplianceCheckIcon() {
  return (
    <svg
      width="38"
      height="39"
      viewBox="0 0 38 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 h-[38px] w-[38px] shrink-0"
      aria-hidden
    >
      <rect y="0.328125" width="38" height="38" fill="#057342" />
      <path
        d="M28.3606 12.8672L16.0344 25.1934L9.80469 18.9637"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SwiSolutionSection() {
  return (
    <section className={`overflow-x-clip border-t border-gray-200 bg-[#F8FAFC] ${SITE_TAB_SECTION_PY}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch lg:gap-0">
        <div
          className={`flex items-start py-6 sm:py-8 md:py-10 lg:order-1 lg:py-12 ${SWI_TAB_TWO_COL_TEXT_IMAGE_RIGHT}`}
        >
          <div className="w-full min-w-0">
            <p className="text-[14px] font-semibold leading-tight tracking-tight !text-[#00A859] md:text-[15px]">
              {SWI_SOLUTION.eyebrow}
            </p>
            <h2
              className={`mt-3 break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
            >
              {SWI_SOLUTION.titleLine1} {SWI_SOLUTION.titleLine2}
            </h2>
            <div className={`mt-5 space-y-4 ${SITE_BODY_CLASS}`}>
              {SWI_SOLUTION.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 flex items-start gap-3 border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 md:mt-8">
              <ComplianceCheckIcon />
              <p className="text-[13px] font-normal leading-tight tracking-tight !text-[#00A859] md:text-[14px]">
                {SWI_SOLUTION.compliance}
              </p>
            </div>
          </div>
        </div>

        <div className={`${SWI_IMAGE_BLOCK_CLASS} lg:order-2`}>
          <img
            src={SWI_SOLUTION.imageSrc}
            alt={SWI_SOLUTION.imageAlt}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
