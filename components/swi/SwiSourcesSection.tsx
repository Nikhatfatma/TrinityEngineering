import { SWI_CONTENT_WIDTH, SWI_SECTION_SHELL, SWI_SOURCES } from "./swiContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_SECTION_PY,
} from "@/components/home/HomeContent";

const SOURCE_NAME_CLASS =
  "text-[13px] font-bold normal-case leading-snug text-[#0047AB] md:text-[14px]";

export default function SwiSourcesSection() {
  return (
    <section className={`overflow-x-clip border-t border-gray-200 bg-[#F8FAFC] ${SITE_TAB_SECTION_PY}`}>
      <div className={SWI_SECTION_SHELL}>
        <div className={`${SWI_CONTENT_WIDTH} text-left`}>
          <h2
            className={`break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
          >
            {SWI_SOURCES.title}
          </h2>
          <p className={`mt-4 ${SITE_BODY_CLASS}`}>{SWI_SOURCES.intro}</p>

          <div className="mt-6 divide-y divide-[#93C5FD] text-left md:mt-8">
            {SWI_SOURCES.items.map((source, index) => (
              <div key={source.name}>
                <div
                  className={`grid min-w-0 grid-cols-1 items-start gap-3 sm:gap-4 md:grid-cols-[minmax(0,10rem)_1fr] md:items-center md:gap-6 lg:grid-cols-[minmax(0,11rem)_1fr] lg:gap-8 ${
                    index === 0 ? "pb-4 pt-0 md:pb-5" : "py-4 md:py-5"
                  }`}
                >
                  <span className={`min-w-0 break-words ${SOURCE_NAME_CLASS}`}>{source.name}</span>
                  <p className={`min-w-0 break-words ${SITE_BODY_CLASS}`}>{source.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
