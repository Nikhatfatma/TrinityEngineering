import { SWI_CONTENT_WIDTH, SWI_SECTION_SHELL, SWI_SOURCES } from "./swiContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_SECTION_HEADING_STYLE,
} from "@/components/home/HomeContent";

const SOURCE_NAME_CLASS =
  "text-[13px] font-bold normal-case leading-snug text-[#0047AB] md:text-[14px]";

export default function SwiSourcesSection() {
  return (
    <section className="max-lg:overflow-x-clip border-t border-gray-200 bg-[#F8FAFC] py-12 md:py-16 lg:py-20">
      <div className={SWI_SECTION_SHELL}>
        <div className={`${SWI_CONTENT_WIDTH} text-center`}>
          <h2
            className={`text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
            style={SITE_SECTION_HEADING_STYLE}
          >
            {SWI_SOURCES.title}
          </h2>
          <p className={`mt-4 ${SITE_BODY_CLASS}`}>{SWI_SOURCES.intro}</p>

          <div className="mt-10 text-left md:mt-12">
            {SWI_SOURCES.items.map((source, index) => (
              <div key={source.name}>
                <div className="grid min-w-0 grid-cols-1 items-start gap-4 py-6 md:grid-cols-[minmax(0,11rem)_1fr] md:items-center md:gap-8 md:py-8">
                  <span className={`min-w-0 break-words ${SOURCE_NAME_CLASS}`}>{source.name}</span>
                  <p className={`min-w-0 break-words ${SITE_BODY_CLASS}`}>{source.description}</p>
                </div>
                {index < SWI_SOURCES.items.length - 1 && <div className="h-px w-full bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
