import { CheckCircle2 } from "lucide-react";
import { SWI_SOLUTION } from "./swiContent";
import {
  SITE_BODY_CLASS,
  SITE_FEATURE_TITLE_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_SECTION_HEADING_STYLE,
} from "@/components/home/HomeContent";

const SOLUTION_EYEBROW_CLASS =
  "text-[11px] font-medium normal-case tracking-normal text-[#00A859] md:text-[12px]";

const SOLUTION_IMAGE_CLASS =
  "relative min-h-[220px] w-full sm:min-h-[260px] lg:h-[340px] lg:min-h-[340px] xl:h-[380px] xl:min-h-[380px]";

export default function SwiSolutionSection() {
  return (
    <section className="overflow-x-clip border-t border-gray-200 bg-[#F8FAFC] py-12 md:py-16 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch lg:gap-0">
        <div className="flex items-start px-4 py-8 sm:px-6 md:px-8 md:py-10 lg:order-1 lg:py-12 lg:pl-8 lg:pr-10 xl:pl-10 xl:pr-12">
          <div className="w-full min-w-0">
            <h2
              className={`text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
              style={SITE_SECTION_HEADING_STYLE}
            >
              {SWI_SOLUTION.titleLine1} {SWI_SOLUTION.titleLine2}
            </h2>
            <p className={`mt-4 ${SOLUTION_EYEBROW_CLASS}`}>{SWI_SOLUTION.eyebrow}</p>
            <div className={`mt-5 space-y-4 ${SITE_BODY_CLASS}`}>
              {SWI_SOLUTION.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 flex items-start gap-3 border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 md:mt-8">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00A859]" aria-hidden />
              <p className={`${SITE_FEATURE_TITLE_CLASS} text-[#166534]`}>{SWI_SOLUTION.compliance}</p>
            </div>
          </div>
        </div>

        <div className={`${SOLUTION_IMAGE_CLASS} lg:order-2`}>
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
