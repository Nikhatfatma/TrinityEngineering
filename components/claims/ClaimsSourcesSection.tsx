import { CLAIMS_CONTENT_WIDTH, CLAIMS_SECTION_SHELL, CLAIMS_SOURCES } from "./claimsContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_SECTION_PY,
} from "@/components/home/HomeContent";

const SOURCE_NAME_CLASS =
  "text-[13px] font-bold normal-case leading-snug text-[#0047AB] md:text-[14px]";

const ACTIVE_BADGE_CLASS =
  "inline-flex h-8 min-w-[5.25rem] shrink-0 items-center justify-center bg-[#00A859] px-4 text-[11px] font-bold normal-case tracking-normal text-white md:h-9 md:min-w-[5.75rem] md:text-xs";

export default function ClaimsSourcesSection() {
  return (
    <section className={`max-lg:overflow-x-clip border-t border-gray-200 bg-white ${SITE_TAB_SECTION_PY}`}>
      <div className={CLAIMS_SECTION_SHELL}>
        <div className={`${CLAIMS_CONTENT_WIDTH} text-center`}>
          <h2 className={`break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}>
            {CLAIMS_SOURCES.title}
          </h2>
          <p className={`mt-4 ${SITE_BODY_CLASS}`}>{CLAIMS_SOURCES.intro}</p>

          <div className="mt-10 text-left md:mt-12">
            {CLAIMS_SOURCES.items.map((source, index) => (
              <div key={source.name}>
                <div className="grid min-w-0 grid-cols-1 items-start gap-4 py-6 md:grid-cols-[minmax(0,11rem)_1fr_5.75rem] md:items-center md:gap-8 md:py-8">
                  <span className={`min-w-0 break-words ${SOURCE_NAME_CLASS}`}>{source.name}</span>
                  <p className={`min-w-0 break-words ${SITE_BODY_CLASS}`}>{source.description}</p>
                  <span className={`${ACTIVE_BADGE_CLASS} md:justify-self-end`}>
                    {source.status}
                  </span>
                </div>
                {index < CLAIMS_SOURCES.items.length - 1 && <div className="h-px w-full bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
