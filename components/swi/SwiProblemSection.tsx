import { AlertTriangle } from "lucide-react";
import { SWI_CONTENT_WIDTH, SWI_PROBLEM, SWI_SECTION_SHELL } from "./swiContent";
import {
  SITE_BODY_CLASS,
  SITE_FEATURE_TITLE_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_SECTION_HEADING_STYLE,
} from "@/components/home/HomeContent";

const PROBLEM_EYEBROW_CLASS =
  "text-[11px] font-medium normal-case tracking-normal text-[#DC2626] md:text-[12px]";

const PROBLEM_IMAGE_CLASS =
  "relative min-h-[220px] w-full sm:min-h-[260px] lg:h-[340px] lg:min-h-[340px] xl:h-[380px] xl:min-h-[380px]";

export default function SwiProblemSection() {
  return (
    <section id="the-problem" className="overflow-x-clip border-t border-gray-200 bg-white py-12 md:py-16 lg:py-20">
      <div className={SWI_SECTION_SHELL}>
        <div className={`${SWI_CONTENT_WIDTH} text-center`}>
          <h2
            className={`text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
            style={SITE_SECTION_HEADING_STYLE}
          >
            {SWI_PROBLEM.titleLine1} {SWI_PROBLEM.titleLine2}
          </h2>
          <p className={`mt-4 ${SITE_BODY_CLASS}`}>{SWI_PROBLEM.intro}</p>
        </div>
      </div>

      <div className="mt-10 md:mt-12 lg:mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch lg:gap-0">
          <div className={`${PROBLEM_IMAGE_CLASS} lg:order-1`}>
            <img
              src={SWI_PROBLEM.imageSrc}
              alt={SWI_PROBLEM.imageAlt}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>

          <div className="flex items-start px-4 py-8 sm:px-6 md:px-8 md:py-10 lg:order-2 lg:py-12 lg:pl-10 lg:pr-8 xl:pl-12 xl:pr-10">
            <div className="w-full min-w-0">
              <p className={PROBLEM_EYEBROW_CLASS}>{SWI_PROBLEM.approachLabel}</p>
              <h3 className={`mt-3 ${SITE_FEATURE_TITLE_CLASS}`}>{SWI_PROBLEM.featureTitle}</h3>
              <p className={`mt-5 ${SITE_BODY_CLASS}`}>{SWI_PROBLEM.body}</p>
              <div className="mt-6 flex items-start gap-3 border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 md:mt-8">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#DC2626]" aria-hidden />
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
