import {
  DRONE_CONTENT_WIDTH,
  DRONE_PROBLEM,
  DRONE_SECTION_SHELL,
} from "./droneContent";
import {
  HOME_CARD_BODY_CLASS,
  HOME_IMAGE_BLEED_MOBILE,
  HOME_SECTION_CLASS,
  HOME_SECTION_PY,
  HOME_STICKY_IMAGE_CLASS,
  HOME_POINT_TITLE_CLASS,
  SITE_SECTION_HEADING_CLASS,
} from "@/components/home/HomeContent";

export default function DroneProblemSection() {
  return (
    <section
      id={DRONE_PROBLEM.id}
      className={`${HOME_SECTION_CLASS} overflow-x-clip bg-[#F4F7FA] ${HOME_SECTION_PY}`}
    >
      <div className={DRONE_SECTION_SHELL}>
        <div className={`${DRONE_CONTENT_WIDTH} text-left`}>
          <h2 className={`break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}>
            {DRONE_PROBLEM.eyebrow}
          </h2>
          <div className={`mt-6 space-y-4 md:mt-8 ${HOME_CARD_BODY_CLASS}`}>
            {DRONE_PROBLEM.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-10 w-full">
        <img
          src={DRONE_PROBLEM.aerialImageSrc}
          alt={DRONE_PROBLEM.aerialImageAlt}
          className="block h-auto w-full object-cover max-h-[480px] lg:max-h-[560px]"
        />
      </div>
    </section>
  );
}
