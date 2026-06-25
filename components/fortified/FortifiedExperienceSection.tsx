import {
  FORTIFIED_CONTENT_WIDTH,
  FORTIFIED_EXPERIENCE,
  FORTIFIED_SECTION_SHELL,
} from "./fortifiedContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_SECTION_PY,
} from "@/components/home/HomeContent";

const STAT_LABEL_CLASS =
  "text-[11px] font-medium normal-case leading-snug tracking-normal text-gray-500 md:text-[12px]";

export default function FortifiedExperienceSection() {
  return (
    <section className={`border-t border-gray-200 bg-[#F8FAFC] ${SITE_TAB_SECTION_PY}`}>
      <div className={FORTIFIED_SECTION_SHELL}>
        <div className={`${FORTIFIED_CONTENT_WIDTH} text-left`}>
          <h2
            className={`break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
          >
            {FORTIFIED_EXPERIENCE.titleLine1} {FORTIFIED_EXPERIENCE.titleLine2}
          </h2>

          <div className={`mt-4 space-y-4 ${SITE_BODY_CLASS}`}>
            {FORTIFIED_EXPERIENCE.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:mt-12 lg:grid-cols-3 lg:gap-5">
            {FORTIFIED_EXPERIENCE.stats.map((stat, index) => {
              const isLast = index === FORTIFIED_EXPERIENCE.stats.length - 1;

              return (
                <div
                  key={stat.label}
                  className={`border border-gray-200 bg-white px-2 py-5 text-center shadow-sm sm:px-4 sm:py-8 md:px-5 md:py-10 ${
                    isLast ? "col-span-2 w-full lg:col-span-1" : ""
                  }`}
                >
                  <div className="text-3xl font-bold leading-none text-[#0047AB] sm:text-4xl md:text-5xl">
                    {stat.value}
                  </div>
                  <p className={`mx-auto mt-3 min-w-0 max-w-full break-words px-0.5 sm:mt-4 sm:px-1 ${STAT_LABEL_CLASS}`}>
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
