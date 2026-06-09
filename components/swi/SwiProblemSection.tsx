import { SWI_CONTENT_WIDTH, SWI_PROBLEM, SWI_IMAGE_BLOCK_CLASS, SWI_SECTION_SHELL, SWI_TAB_TWO_COL_TEXT_IMAGE_LEFT } from "./swiContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_SECTION_PY,
} from "@/components/home/HomeContent";

function WarningIcon() {
  return (
    <svg
      width="48"
      height="43"
      viewBox="0 0 48 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 h-[43px] w-[48px] shrink-0"
      aria-hidden
    >
      <g clipPath="url(#clip0_swi_warning)">
        <path
          d="M20.5878 1.99123L0.537893 37.0258C0.190967 37.631 0.00812645 38.3177 0.0078129 39.0168C0.00749936 39.7158 0.189716 40.4027 0.5361 41.0082C0.882483 41.6136 1.3808 42.1164 1.98095 42.4658C2.5811 42.8152 3.26186 42.9989 3.95475 42.9985H44.0545C44.7474 42.9989 45.4282 42.8152 46.0283 42.4658C46.6285 42.1164 47.1269 41.6136 47.4733 41.0082C47.8196 40.4027 48.0018 39.7158 48.0015 39.0168C48.0012 38.3177 47.8184 37.631 47.4715 37.0258L27.4215 1.99123C27.0754 1.38587 26.5774 0.883118 25.9776 0.533572C25.3778 0.184025 24.6974 0 24.0047 0C23.312 0 22.6315 0.184025 22.0317 0.533572C21.4319 0.883118 20.9339 1.38587 20.5878 1.99123Z"
          fill="#D82327"
        />
        <path d="M25.4221 28.0634H22.571L21.9453 11.7812H26.0478L25.4221 28.0634Z" fill="white" />
        <path
          d="M24 36.4499C25.3463 36.4499 26.4376 35.3488 26.4376 33.9906C26.4376 32.6323 25.3463 31.5312 24 31.5312C22.6538 31.5312 21.5625 32.6323 21.5625 33.9906C21.5625 35.3488 22.6538 36.4499 24 36.4499Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_swi_warning">
          <rect width="48" height="43" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default function SwiProblemSection() {
  return (
    <section id="the-problem" className={`overflow-x-clip border-t border-gray-200 bg-white ${SITE_TAB_SECTION_PY}`}>
      <div className={SWI_SECTION_SHELL}>
        <div className={`${SWI_CONTENT_WIDTH} text-left`}>
          <h2
            className={`break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
          >
            {SWI_PROBLEM.titleLine1} {SWI_PROBLEM.titleLine2}
          </h2>
          <p className={`mt-4 ${SITE_BODY_CLASS}`}>{SWI_PROBLEM.intro}</p>
        </div>
      </div>

      <div className="mt-8 md:mt-12 lg:mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch lg:gap-0">
          <div className={`${SWI_IMAGE_BLOCK_CLASS} lg:order-1`}>
            <img
              src={SWI_PROBLEM.imageSrc}
              alt={SWI_PROBLEM.imageAlt}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>

          <div className={`flex items-start py-6 sm:py-8 md:py-10 lg:order-2 lg:py-12 ${SWI_TAB_TWO_COL_TEXT_IMAGE_LEFT}`}>
            <div className="w-full min-w-0">
              <p className="text-[14px] font-semibold leading-tight tracking-tight !text-[#DC2626] md:text-[15px]">
                {SWI_PROBLEM.approachLabel}
              </p>
              <h2
                className={`mt-3 break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
              >
                {SWI_PROBLEM.featureTitle}
              </h2>
              <p className={`mt-5 ${SITE_BODY_CLASS}`}>{SWI_PROBLEM.body}</p>
              <div className="mt-6 flex items-start gap-3 border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 md:mt-8">
                <WarningIcon />
                <p className="text-[13px] font-medium leading-relaxed text-[#991B1B] md:text-[14px]">
                  {SWI_PROBLEM.warning}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
