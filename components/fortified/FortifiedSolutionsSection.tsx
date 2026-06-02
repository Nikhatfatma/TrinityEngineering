import {
  FORTIFIED_CONTENT_WIDTH,
  FORTIFIED_SECTION_SHELL,
  FORTIFIED_SOLUTIONS,
  FORTIFIED_STANDARD,
  FORTIFIED_TAB_TWO_COL_TEXT_IMAGE_LEFT,
} from "./fortifiedContent";
import {
  SITE_BODY_CLASS,
  SITE_FEATURE_TITLE_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_SECTION_HEADING_STYLE,
} from "@/components/home/HomeContent";

const ITEM_CLASS =
  "flex items-start gap-3 text-[11px] font-extrabold uppercase leading-snug tracking-wide text-[#166534] md:text-[12px]";

const BULLET_CLASS = "mt-[0.4em] h-2 w-2 shrink-0 rounded-full bg-[#166534]";

const STEEP_IMAGE_CLASS =
  "relative min-h-[220px] w-full sm:min-h-[260px] lg:h-[340px] lg:min-h-[340px] xl:h-[380px] xl:min-h-[380px]";

function SolutionColumn({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3 md:space-y-4">
      {items.map((item) => (
        <li key={item} className={ITEM_CLASS}>
          <span className={BULLET_CLASS} aria-hidden />
          <span className="min-w-0 break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function FortifiedSolutionsSection() {
  return (
    <section id="fortified-solutions" className="overflow-x-clip border-t border-gray-200 bg-white py-12 md:py-16 lg:py-20">
      <div className={FORTIFIED_SECTION_SHELL}>
        <div className={`${FORTIFIED_CONTENT_WIDTH} text-center`}>
          <h2
            className={`text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
            style={SITE_SECTION_HEADING_STYLE}
          >
            {FORTIFIED_SOLUTIONS.title}
          </h2>
          <p className={`mt-4 ${SITE_BODY_CLASS}`}>{FORTIFIED_SOLUTIONS.subtitle}</p>

          <div className="mt-10 grid grid-cols-1 gap-8 text-left md:mt-12 md:grid-cols-2 md:gap-12 lg:gap-16">
            <SolutionColumn items={FORTIFIED_SOLUTIONS.columnLeft} />
            <SolutionColumn items={FORTIFIED_SOLUTIONS.columnRight} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:mt-5 lg:mt-6 lg:grid-cols-2 lg:items-stretch lg:gap-0">
        <div
          className={`${STEEP_IMAGE_CLASS} max-lg:left-1/2 max-lg:w-[100dvw] max-lg:max-w-none max-lg:-translate-x-1/2 lg:order-1 lg:w-full`}
        >
          <img
            src={FORTIFIED_STANDARD.imageSrc}
            alt={FORTIFIED_STANDARD.imageAlt}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>

        <div
          className={`flex items-start pb-8 pt-2 md:pb-10 md:pt-3 lg:order-2 lg:pb-12 lg:pt-4 ${FORTIFIED_TAB_TWO_COL_TEXT_IMAGE_LEFT}`}
        >
          <div className="w-full min-w-0">
            <h3 className={SITE_FEATURE_TITLE_CLASS}>{FORTIFIED_STANDARD.title}</h3>
            <div className={`mt-4 space-y-4 ${SITE_BODY_CLASS}`}>
              {FORTIFIED_STANDARD.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
