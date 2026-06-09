import { SWI_CONTENT_WIDTH, SWI_METHODOLOGY, SWI_SECTION_SHELL } from "./swiContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_SECTION_PY,
} from "@/components/home/HomeContent";

const STEP_EYEBROW_CLASS =
  "text-[11px] font-medium normal-case tracking-normal text-[#2563EB] md:text-[12px]";

const STEP_TITLE_CLASS =
  "text-[15px] font-bold normal-case leading-snug text-[#1A1A1A] md:text-[16px]";

function MethodologyTags({ tags }: { tags: readonly string[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-[11px] font-medium normal-case tracking-normal text-[#2563EB] md:text-[12px]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default function SwiMethodologySection() {
  return (
    <section
      id={SWI_METHODOLOGY.id}
      className={`border-t border-gray-200 bg-white ${SITE_TAB_SECTION_PY}`}
    >
      <div className={SWI_SECTION_SHELL}>
        <div className={`${SWI_CONTENT_WIDTH} text-left`}>
          <h2
            className={`break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
          >
            {SWI_METHODOLOGY.title}
          </h2>
          <p className={`mt-4 ${SITE_BODY_CLASS}`}>{SWI_METHODOLOGY.intro}</p>

          <div className="relative mt-10 text-left sm:mt-12 md:mt-14 lg:mt-20">
            {SWI_METHODOLOGY.steps.map((step, index) => (
              <div key={step.number} className="flex items-start gap-3 sm:gap-4 md:gap-6">
                <div className="flex w-8 shrink-0 flex-col items-center self-stretch sm:w-9 md:w-10">
                  {index > 0 && (
                    <div className="h-4 w-[1.5px] shrink-0 bg-[#2563EB] sm:h-6 md:h-8" aria-hidden />
                  )}
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center bg-[#0047AB] text-[12px] font-black text-white sm:h-9 sm:w-9 sm:text-[13px] md:h-10 md:w-10 md:text-[14px]">
                    {step.number}
                  </div>
                  {index < SWI_METHODOLOGY.steps.length - 1 && (
                    <div className="w-[1.5px] flex-1 bg-[#2563EB]" aria-hidden />
                  )}
                </div>
                <div
                  className={`min-w-0 flex-1 pb-6 sm:pb-8 md:pb-10 ${
                    index > 0 ? "pt-4 sm:pt-6 md:pt-8" : ""
                  } ${index < SWI_METHODOLOGY.steps.length - 1 ? "border-b border-[#93C5FD]" : ""}`}
                >
                  <p className={`break-words ${STEP_EYEBROW_CLASS}`}>{step.eyebrow}</p>
                  <h3 className={`mt-2 break-words ${STEP_TITLE_CLASS}`}>{step.title}</h3>
                  <p className={`mt-3 ${SITE_BODY_CLASS}`}>{step.description}</p>
                  <MethodologyTags tags={step.tags} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
