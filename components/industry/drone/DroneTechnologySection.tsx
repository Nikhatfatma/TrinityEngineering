import {
  DRONE_CONTENT_WIDTH,
  DRONE_SECTION_SHELL,
  DRONE_TECHNOLOGY,
} from "./droneContent";
import {
  HOME_CARD_BODY_CLASS,
  HOME_POINT_BODY_CLASS,
  HOME_POINT_TITLE_CLASS,
  HOME_SECTION_CLASS,
  HOME_SECTION_PY,
  HOME_STICKY_IMAGE_CLASS,
  HOME_IMAGE_BLEED_MOBILE,
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
      <h3 className={`mb-3 ${HOME_POINT_TITLE_CLASS}`}>{eyebrow}</h3>
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

export default function DroneTechnologySection() {
  return (
    <section
      id={DRONE_TECHNOLOGY.id}
      className={`${HOME_SECTION_CLASS} border-t border-gray-200/80 bg-white ${HOME_SECTION_PY}`}
    >
      <div className={`${DRONE_SECTION_SHELL} relative z-10 pt-2`}>
        <div className={DRONE_CONTENT_WIDTH}>
          {/* Header */}
          <div className="mb-8 text-left md:mb-10">
            <h2 className={`w-full break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}>
              {DRONE_TECHNOLOGY.title}
            </h2>
          </div>

          {/* Two-col: text blocks + sticky image */}
          <div className="grid w-full min-w-0 grid-cols-1 items-start gap-6 max-lg:gap-y-4 md:gap-8 lg:grid-cols-[minmax(0,1fr)_42%] xl:grid-cols-[minmax(0,1fr)_38%] xl:gap-12">
            <div className="max-lg:col-span-full min-w-0 w-full py-6 sm:py-8 md:py-10 lg:py-0">
              <div className="space-y-4 md:space-y-6">
                {DRONE_TECHNOLOGY.blocks.map((block) => (
                  <TextBlock
                    key={block.eyebrow}
                    eyebrow={block.eyebrow}
                    paragraphs={block.paragraphs}
                  />
                ))}
              </div>
            </div>

            <div
              className={`w-full min-w-0 max-lg:col-span-full lg:-mr-[calc(max(2rem,50vw-32rem))] lg:w-[calc(100%+max(2rem,50vw-32rem))] ${HOME_STICKY_IMAGE_CLASS}`}
            >
              <img
                src={DRONE_TECHNOLOGY.diagramImageSrc}
                alt={DRONE_TECHNOLOGY.diagramImageAlt}
                className="block w-full h-auto max-h-[360px] lg:max-h-[500px] xl:max-h-[580px] object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
