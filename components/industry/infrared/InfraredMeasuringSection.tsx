import SectionDivider from "@/components/home/SectionDivider";
import {
  IR_CONTENT_WIDTH,
  IR_MEASURING,
  IR_SECTION_SHELL,
  IR_TAB_TWO_COL_TEXT_IMAGE_RIGHT,
} from "./infraredThermographyContent";
import { InfraredTextBlocks } from "./InfraredTextBlocks";
import {
  HOME_SECTION_CLASS,
  HOME_SECTION_PY,
  HOME_STICKY_IMAGE_CLASS,
  SITE_SECTION_HEADING_CLASS,
} from "@/components/home/HomeContent";

export default function InfraredMeasuringSection() {
  return (
    <section
      id={IR_MEASURING.id}
      className={`${HOME_SECTION_CLASS} border-t border-gray-200/80 bg-white ${HOME_SECTION_PY}`}
    >
      <div className={`${IR_SECTION_SHELL} relative z-10 pt-2`}>
        <div className={IR_CONTENT_WIDTH}>
          <div className="mb-8 text-left md:mb-10">
            <h2
              className={`w-full break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
            >
              {IR_MEASURING.title}
            </h2>
          </div>

          <div className="grid w-full min-w-0 grid-cols-1 items-start gap-6 max-lg:gap-y-4 md:gap-8 lg:grid-cols-[minmax(0,1fr)_42%] xl:grid-cols-[minmax(0,1fr)_38%] xl:gap-12">
            <div className="max-lg:col-span-full min-w-0 w-full py-6 sm:py-8 md:py-10 lg:py-0">
              <InfraredTextBlocks blocks={IR_MEASURING.blocks} />
            </div>

            <div
              className={`w-full min-w-0 max-lg:col-span-full lg:-mr-[calc(max(2rem,50vw-32rem))] lg:w-[calc(100%+max(2rem,50vw-32rem))] ${HOME_STICKY_IMAGE_CLASS}`}
            >
              <img
                src={IR_MEASURING.diagramImageSrc}
                alt={IR_MEASURING.diagramImageAlt}
                className="block w-full h-auto max-h-[320px] lg:max-h-[400px] xl:max-h-[460px] object-contain object-right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
