import { CLAIMS_CONTENT_WIDTH, CLAIMS_SECTION_SHELL, CLAIMS_STATS } from "./claimsContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_SECTION_PY,
} from "@/components/home/HomeContent";

const STATS_LABEL_CLASS =
  "text-[11px] font-medium normal-case leading-snug tracking-normal text-gray-500 md:text-[12px]";

export default function ClaimsStatsSection() {
  return (
    <section className={`border-t border-gray-200 bg-[#F8FAFC] ${SITE_TAB_SECTION_PY}`}>
      <div className={CLAIMS_SECTION_SHELL}>
        <div className={`${CLAIMS_CONTENT_WIDTH} text-center`}>
          <h2 className={`break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}>
            {CLAIMS_STATS.titleLine1} {CLAIMS_STATS.titleLine2}
          </h2>
          <p className={`mt-4 ${SITE_BODY_CLASS}`}>{CLAIMS_STATS.intro}</p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:mt-10 lg:mt-12 lg:grid-cols-4 lg:gap-5">
            {CLAIMS_STATS.items.map((stat) => (
              <div
                key={stat.label}
                className="border border-gray-200 bg-white px-4 py-8 text-center md:px-5 md:py-10"
              >
                <div className="text-4xl font-black leading-none text-[#0047AB] md:text-5xl">{stat.value}</div>
                <p className={`mx-auto mt-4 min-w-0 max-w-full px-1 ${STATS_LABEL_CLASS}`}>{stat.label}</p>
              </div>
            ))}
          </div>

          <blockquote className="mt-8 sm:mt-10 md:mt-12">
            <p className={`${SITE_BODY_CLASS} italic text-gray-600`}>&ldquo;{CLAIMS_STATS.quote}&rdquo;</p>
            <footer className={`mt-3 ${STATS_LABEL_CLASS} text-gray-400`}>{CLAIMS_STATS.citation}</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
