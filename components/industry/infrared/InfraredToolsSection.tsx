import {
  IR_CONTENT_WIDTH,
  IR_SECTION_SHELL,
  IR_TOOLS,
} from "./infraredThermographyContent";
import {
  HOME_CARD_BODY_CLASS,
  HOME_POINT_TITLE_CLASS,
  HOME_SECTION_PY,
  SITE_SECTION_HEADING_CLASS,
} from "@/components/home/HomeContent";

export default function InfraredToolsSection() {
  return (
    <section
      id={IR_TOOLS.id}
      className={`overflow-x-clip bg-[#F4F7FA] ${HOME_SECTION_PY}`}
    >
      <div className={IR_SECTION_SHELL}>
        <div className={`${IR_CONTENT_WIDTH} text-left`}>
          <h2 className={`break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}>
            {IR_TOOLS.eyebrow}
          </h2>
          <p className={`mt-6 md:mt-8 ${HOME_POINT_TITLE_CLASS}`}>{IR_TOOLS.title}</p>
          <div className={`mt-4 space-y-4 ${HOME_CARD_BODY_CLASS}`}>
            {IR_TOOLS.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-10 w-full">
        <img
          src={IR_TOOLS.comparisonImageSrc}
          alt={IR_TOOLS.comparisonImageAlt}
          className="block h-auto w-full object-cover"
        />
      </div>
    </section>
  );
}
