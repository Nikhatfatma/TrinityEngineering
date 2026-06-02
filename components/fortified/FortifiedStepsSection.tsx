import Link from "next/link";
import {
  FORTIFIED_CONTENT_WIDTH,
  FORTIFIED_SECTION_SHELL,
  FORTIFIED_STEPS,
  type FortifiedStepParagraph,
} from "./fortifiedContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_SECTION_HEADING_STYLE,
} from "@/components/home/HomeContent";

const STEP_EYEBROW_CLASS =
  "text-[11px] font-medium normal-case text-[#2563EB] md:text-[12px]";

const STEP_HEADING_CLASS =
  "mt-2 text-[15px] font-bold normal-case leading-snug text-[#1A1A1A] md:text-[16px]";

function StepTags({ tags }: { tags: readonly string[] }) {
  if (tags.length === 0) return null;

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

function StepParagraph({ paragraph }: { paragraph: FortifiedStepParagraph }) {
  const bodyClass = `mt-3 first:mt-3 ${SITE_BODY_CLASS}`;

  if (paragraph.kind === "bold") {
    return <p className={`${bodyClass} font-bold text-gray-700`}>{paragraph.text}</p>;
  }

  if (paragraph.kind === "italic") {
    return <p className={`${bodyClass} font-bold italic text-gray-700`}>{paragraph.text}</p>;
  }

  if (paragraph.kind === "link") {
    return (
      <p className={bodyClass}>
        {paragraph.before}
        <Link
          href={paragraph.linkHref}
          className="font-semibold text-[#0047AB] underline hover:text-[#003580]"
        >
          {paragraph.linkLabel}
        </Link>
        {paragraph.after}
      </p>
    );
  }

  return <p className={bodyClass}>{paragraph.text}</p>;
}

export default function FortifiedStepsSection() {
  return (
    <section
      id={FORTIFIED_STEPS.id}
      className="overflow-x-clip border-t border-gray-200 bg-white py-12 md:py-16 lg:py-20"
    >
      <div className={FORTIFIED_SECTION_SHELL}>
        <div className={`${FORTIFIED_CONTENT_WIDTH} text-center`}>
          <h2
            className={`text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
            style={SITE_SECTION_HEADING_STYLE}
          >
            {FORTIFIED_STEPS.title}
          </h2>
          <p className={`mt-3 ${SITE_BODY_CLASS}`}>{FORTIFIED_STEPS.intro}</p>

          <div className="mt-14 text-left md:mt-16 lg:mt-20">
            {FORTIFIED_STEPS.steps.map((step, index) => {
              const isLast = index === FORTIFIED_STEPS.steps.length - 1;

              return (
                <div key={step.number} className="flex items-start gap-4 md:gap-6">
                  <div className="flex w-9 shrink-0 flex-col items-center self-stretch md:w-10">
                    <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center bg-[#0047AB] text-[13px] font-black text-white md:h-10 md:w-10 md:text-[14px]">
                      {step.number}
                    </div>
                    {!isLast && (
                      <div className="w-px flex-1 bg-[#60A5FA]" aria-hidden />
                    )}
                  </div>

                  <div className={`min-w-0 flex-1 ${!isLast ? "pb-8 md:pb-10" : ""}`}>
                    <p className={STEP_EYEBROW_CLASS}>{step.eyebrow}</p>
                    <h3 className={STEP_HEADING_CLASS}>{step.heading}</h3>
                    <div>
                      {step.paragraphs.map((paragraph, paragraphIndex) => (
                        <StepParagraph key={paragraphIndex} paragraph={paragraph} />
                      ))}
                    </div>
                    <StepTags tags={step.tags} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
