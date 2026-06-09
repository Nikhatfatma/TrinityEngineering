import {
  CAREERS_BRAND,
  CAREERS_CONTENT_WIDTH,
  CAREERS_SECTION_SHELL,
} from "./careersContent";
import { SITE_SECTION_HEADING_CLASS, SITE_TAB_SECTION_PY } from "@/components/home/HomeContent";

export default function CareersBrandSection() {
  return (
    <section className={`bg-white ${SITE_TAB_SECTION_PY}`}>
      <div className={CAREERS_SECTION_SHELL}>
        <div className={`${CAREERS_CONTENT_WIDTH} flex flex-col items-center text-center`}>
          <img
            src={CAREERS_BRAND.logoSrc}
            alt={CAREERS_BRAND.logoAlt}
            className="h-44 w-44 object-contain mix-blend-multiply sm:h-52 sm:w-52 md:h-56 md:w-56"
          />

          <h2 className={`mt-8 max-w-4xl break-words text-[#1A1A1A] sm:mt-10 ${SITE_SECTION_HEADING_CLASS}`}>
            {CAREERS_BRAND.title}
          </h2>

          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#2563EB] sm:text-[11px] md:tracking-[0.28em]">
            {CAREERS_BRAND.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
