import {
  IR_CONTENT_WIDTH,
  IR_LEVERAGE,
  IR_SECTION_SHELL,
} from "./infraredThermographyContent";
import {
  HOME_CARD_BODY_CLASS,
  HOME_POINT_BODY_CLASS,
  HOME_POINT_TITLE_CLASS,
  HOME_SECTION_PY,
  SITE_SECTION_HEADING_CLASS,
} from "@/components/home/HomeContent";

export default function InfraredLeverageSection() {
  return (
    <section
      id={IR_LEVERAGE.id}
      className={`overflow-x-clip border-t border-gray-200/80 bg-white ${HOME_SECTION_PY}`}
    >
      <div className={IR_SECTION_SHELL}>
        <div className={`${IR_CONTENT_WIDTH} text-left`}>
          <h2 className={`break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}>
            {IR_LEVERAGE.title}
          </h2>
          <p className={`mt-4 ${HOME_POINT_BODY_CLASS}`}>{IR_LEVERAGE.intro}</p>

          <div className="mt-6 space-y-0 md:mt-8">
            {IR_LEVERAGE.applications.map((app, index) => (
              <article
                key={app.title}
                className={`py-6 md:py-8 ${index > 0 ? "border-t border-[#93C5FD]" : ""}`}
              >
                <h3 className={HOME_POINT_TITLE_CLASS}>{app.title}</h3>
                <p className={`mt-3 font-semibold ${HOME_CARD_BODY_CLASS}`}>{app.subtitle}</p>
                <p className={`mt-3 ${HOME_POINT_BODY_CLASS}`}>{app.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
