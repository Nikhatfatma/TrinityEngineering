import {
  DRONE_CONTENT_WIDTH,
  DRONE_QUALITY,
  DRONE_SECTION_SHELL,
} from "./droneContent";
import {
  HOME_IMAGE_BLEED_MOBILE,
  HOME_POINT_BODY_CLASS,
  HOME_POINT_TITLE_CLASS,
  HOME_SECTION_CLASS,
  HOME_SECTION_PY,
  HOME_STICKY_IMAGE_CLASS,
  SITE_SECTION_HEADING_CLASS,
} from "@/components/home/HomeContent";

function TextBlock({
  eyebrow,
  paragraphs,
}: {
  eyebrow: string;
  paragraphs: readonly string[];
}) {
  return (
    <div className="group w-full rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-500 hover:border-blue-100 hover:shadow-xl max-lg:rounded-2xl max-lg:p-5 md:p-8">
      <h3 className={`mb-6 ${HOME_POINT_TITLE_CLASS}`}>{eyebrow}</h3>
      <div className={`space-y-4 ${HOME_POINT_BODY_CLASS}`}>
        {paragraphs.map((paragraph, index) => {
          const isBullet = paragraph.startsWith("• ");
          return (
            <div
              key={index}
              className={`opacity-80 transition-opacity group-hover:opacity-100 ${isBullet ? "flex gap-2.5" : ""}`}
            >
              {isBullet ? (
                <>
                  <span className="shrink-0">•</span>
                  <p>{paragraph.slice(2)}</p>
                </>
              ) : (
                <p>{paragraph}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DroneQualitySection() {
  return (
    <section
      id={DRONE_QUALITY.id}
      className={`${HOME_SECTION_CLASS} border-t border-gray-200/80 bg-[#F4F5F5] ${HOME_SECTION_PY}`}
    >
      <div className={`${DRONE_SECTION_SHELL} relative z-10 pt-2`}>
        <div className={DRONE_CONTENT_WIDTH}>
          <div className="grid w-full min-w-0 grid-cols-1 items-start gap-6 max-lg:gap-y-4 md:gap-8 lg:grid-cols-[48%_minmax(0,1fr)] xl:grid-cols-[52%_minmax(0,1fr)] xl:gap-12">
            {/* Title spans full width */}
            <div className="col-span-full mb-0 text-left md:mb-1 lg:mb-2">
              <h2 className={`w-full break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}>
                {DRONE_QUALITY.title}
              </h2>
            </div>

            {/* Left: sticky image */}
            <div
              className={`w-full min-w-0 max-lg:col-span-full ${HOME_IMAGE_BLEED_MOBILE} lg:-ml-[calc(max(2rem,50vw-32rem))] lg:w-[calc(100%+max(2rem,50vw-32rem))] ${HOME_STICKY_IMAGE_CLASS}`}
            >
              <img
                src={DRONE_QUALITY.operatorImageSrc}
                alt={DRONE_QUALITY.operatorImageAlt}
                className="block w-full h-auto aspect-[4/3] lg:aspect-[16/10] xl:aspect-[16/9] lg:object-cover lg:object-top"
              />
            </div>

            {/* Right: text blocks */}
            <div className="max-lg:col-span-full min-w-0 w-full">
              <div className="space-y-4 md:space-y-6">
                {DRONE_QUALITY.blocks.map((block) => (
                  <TextBlock
                    key={block.eyebrow}
                    eyebrow={block.eyebrow}
                    paragraphs={block.paragraphs}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
