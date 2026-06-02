import { SWI_CONTENT_WIDTH, SWI_SECTION_SHELL, SWI_STATS } from "./swiContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_SECTION_HEADING_STYLE,
} from "@/components/home/HomeContent";

const STATS_LABEL_CLASS =
  "text-[11px] font-medium normal-case leading-snug tracking-normal text-gray-500 md:text-[12px]";

export default function SwiStatsSection() {
  return (
    <section className="border-t border-gray-200 bg-[#F8FAFC] py-12 md:py-16 lg:py-20">
      <div className={SWI_SECTION_SHELL}>
        <div className={`${SWI_CONTENT_WIDTH} text-center`}>
          <h2
            className={`text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
            style={SITE_SECTION_HEADING_STYLE}
          >
            <span className="block">{SWI_STATS.titleLine1}</span>
            <span className="block">{SWI_STATS.titleLine2}</span>
          </h2>
          <p className={`mt-4 ${SITE_BODY_CLASS}`}>{SWI_STATS.intro}</p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5">
            {SWI_STATS.items.map((stat) => (
              <div
                key={stat.label}
                className="border border-gray-200 bg-white px-4 py-8 text-center md:px-5 md:py-10"
              >
                <div className="text-4xl font-black leading-none text-[#0047AB] md:text-5xl">{stat.value}</div>
                <p className={`mx-auto mt-4 min-w-0 max-w-full px-1 ${STATS_LABEL_CLASS}`}>{stat.label}</p>
              </div>
            ))}
          </div>

          <blockquote className="mt-10 md:mt-12">
            <p className={`${SITE_BODY_CLASS} italic text-gray-600`}>&ldquo;{SWI_STATS.quote}&rdquo;</p>
            <footer className={`mt-3 ${STATS_LABEL_CLASS} text-gray-400`}>{SWI_STATS.citation}</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
