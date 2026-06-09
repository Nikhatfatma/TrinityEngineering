import {
  CLAIMS_CONTENT_WIDTH,
  CLAIMS_SECTION_SHELL,
  CLAIMS_STEEP_SECTION,
} from "./claimsContent";
import {
  SITE_BODY_CLASS,
  SITE_EYEBROW_CLASS,
  SITE_FEATURE_TITLE_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_SECTION_PY,
} from "@/components/home/HomeContent";

const STEEP_IMAGE_CLASS =
  "relative min-h-[220px] w-full sm:min-h-[260px] lg:h-[340px] lg:min-h-[340px] xl:h-[380px] xl:min-h-[380px]";

const STEEP_TEXT_INNER = "w-full min-w-0";

type RowProps = (typeof CLAIMS_STEEP_SECTION.rows)[number];

const STEEP_SECTION_TEXT_LEFT =
  "px-4 sm:px-6 md:px-8 lg:pl-[calc(2rem+max(0px,(min(100vw,1440px)-4rem-64rem)/2))]";

function FeatureRow({ eyebrow, title, paragraphs, imageSrc, imageAlt, imageLeft }: RowProps) {
  const textPad = imageLeft
    ? "px-4 sm:px-6 md:px-8 lg:pl-10 lg:pr-8 xl:pl-12 xl:pr-10"
    : `${STEEP_SECTION_TEXT_LEFT} lg:pr-10 xl:pr-12`;

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 lg:items-stretch lg:gap-0 ${
        !imageLeft ? "mt-10 md:mt-12 lg:mt-16" : ""
      }`}
    >
      <div
        className={`flex items-start py-6 sm:py-8 md:py-10 lg:py-12 ${textPad} ${imageLeft ? "lg:order-2" : "lg:order-1"}`}
      >
        <div className={STEEP_TEXT_INNER}>
          <p className={SITE_EYEBROW_CLASS}>{eyebrow}</p>
          <h3 className={`mt-3 ${SITE_FEATURE_TITLE_CLASS}`}>{title}</h3>
          <div className={`mt-5 space-y-4 ${SITE_BODY_CLASS}`}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`${STEEP_IMAGE_CLASS} max-lg:left-1/2 max-lg:w-[100dvw] max-lg:max-w-none max-lg:-translate-x-1/2 lg:w-full ${
          imageLeft ? "lg:order-1" : "lg:order-2"
        }`}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`absolute inset-0 h-full w-full object-cover ${
            imageLeft ? "object-center" : "object-[center_30%]"
          }`}
        />
      </div>
    </div>
  );
}

export default function ClaimsSteepHighSection() {
  return (
    <section id="steep-and-high-reports" className={`overflow-x-clip border-t border-gray-200 bg-white ${SITE_TAB_SECTION_PY}`}>
      <div className={CLAIMS_SECTION_SHELL}>
        <div className={CLAIMS_CONTENT_WIDTH}>
          <h2 className={`break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}>
            {CLAIMS_STEEP_SECTION.title}
          </h2>
          <p className={`mt-4 ${SITE_BODY_CLASS}`}>
            {CLAIMS_STEEP_SECTION.intro.split(CLAIMS_STEEP_SECTION.introBoldPhrase).map((part, index, parts) => (
              <span key={index}>
                {part}
                {index < parts.length - 1 && (
                  <strong className="font-bold text-[#1A1A1A]">{CLAIMS_STEEP_SECTION.introBoldPhrase}</strong>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="mt-10 md:mt-12 lg:mt-14">
        {CLAIMS_STEEP_SECTION.rows.map((row) => (
          <FeatureRow key={row.id} {...row} />
        ))}
      </div>
    </section>
  );
}
