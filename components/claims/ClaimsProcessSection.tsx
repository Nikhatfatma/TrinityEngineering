import { CLAIMS_CONTENT_WIDTH, CLAIMS_PROCESS, CLAIMS_SECTION_SHELL } from "./claimsContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_SECTION_HEADING_STYLE,
} from "@/components/home/HomeContent";

const PROCESS_EYEBROW_CLASS =
  "text-[11px] font-medium normal-case tracking-normal text-[#2563EB] md:text-[12px]";

const PROCESS_STEP_TITLE_CLASS =
  "text-[15px] font-bold normal-case leading-snug text-[#0047AB] md:text-[16px]";

function ProcessTags({ tags }: { tags: readonly string[] }) {
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

export default function ClaimsProcessSection() {
  return (
    <section className="border-t border-gray-200 bg-white py-12 md:py-16 lg:py-20">
      <div className={CLAIMS_SECTION_SHELL}>
        <div className={`${CLAIMS_CONTENT_WIDTH} text-center`}>
          <h2
            className={`text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
            style={SITE_SECTION_HEADING_STYLE}
          >
            {CLAIMS_PROCESS.title}
          </h2>
          {CLAIMS_PROCESS.intro && (
            <p className={`mt-3 ${SITE_BODY_CLASS}`}>{CLAIMS_PROCESS.intro}</p>
          )}

          <div className="mt-14 text-left md:mt-16 lg:mt-20">
            {CLAIMS_PROCESS.steps.map((step, index) => (
              <div key={step.number} className="flex items-start gap-4 md:gap-6">
                <div className="flex w-9 shrink-0 flex-col items-center self-stretch md:w-10">
                  <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center bg-[#0047AB] text-[13px] font-black text-white md:h-10 md:w-10 md:text-[14px]">
                    {step.number}
                  </div>
                  {index < CLAIMS_PROCESS.steps.length - 1 && (
                    <div className="hidden w-px flex-1 bg-[#60A5FA] md:block" aria-hidden />
                  )}
                </div>
                <div className="min-w-0 flex-1 pb-8 md:pb-10">
                  {step.eyebrow && <p className={PROCESS_EYEBROW_CLASS}>{step.eyebrow}</p>}
                  <h3 className={`${step.eyebrow ? "mt-2" : ""} ${PROCESS_STEP_TITLE_CLASS}`}>{step.title}</h3>
                  {step.description && <p className={`mt-3 ${SITE_BODY_CLASS}`}>{step.description}</p>}
                  <ProcessTags tags={step.tags} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
