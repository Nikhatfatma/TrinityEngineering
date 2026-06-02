import {
  FORTIFIED_CONTENT_WIDTH,
  FORTIFIED_EXPERIENCE,
  FORTIFIED_SECTION_SHELL,
} from "./fortifiedContent";
import {
  SITE_BODY_CLASS,
  SITE_EYEBROW_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_SECTION_HEADING_STYLE,
} from "@/components/home/HomeContent";

const STAT_LABEL_CLASS =
  "text-[11px] font-medium normal-case leading-snug tracking-normal text-gray-500 md:text-[12px]";

export default function FortifiedExperienceSection() {
  return (
    <section className="border-t border-gray-200 bg-[#F8FAFC] py-12 md:py-16 lg:py-20">
      <div className={FORTIFIED_SECTION_SHELL}>
        <div className={`${FORTIFIED_CONTENT_WIDTH} text-left`}>
          <h2
            className={`text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
            style={SITE_SECTION_HEADING_STYLE}
          >
            <span className="block">{FORTIFIED_EXPERIENCE.titleLine1}</span>
            <span className="block">{FORTIFIED_EXPERIENCE.titleLine2}</span>
          </h2>

          <p className={`mt-4 ${SITE_EYEBROW_CLASS}`}>{FORTIFIED_EXPERIENCE.eyebrow}</p>

          <div className={`mt-4 space-y-4 ${SITE_BODY_CLASS}`}>
            {FORTIFIED_EXPERIENCE.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:mt-12 lg:gap-5">
            {FORTIFIED_EXPERIENCE.stats.map((stat) => (
              <div
                key={stat.label}
                className="border border-gray-200 bg-white px-4 py-8 text-center shadow-sm md:px-5 md:py-10"
              >
                <div className="text-4xl font-black leading-none text-[#0047AB] md:text-5xl">{stat.value}</div>
                <p className={`mx-auto mt-4 min-w-0 max-w-full px-1 ${STAT_LABEL_CLASS}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
