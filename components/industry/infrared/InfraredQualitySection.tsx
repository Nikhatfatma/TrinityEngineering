import {
  IR_CONTENT_WIDTH,
  IR_IMAGE_BLOCK_CLASS,
  IR_QUALITY,
  IR_SECTION_SHELL,
  IR_TAB_TWO_COL_TEXT_IMAGE_RIGHT,
} from "./infraredThermographyContent";
import { InfraredTextBlocks } from "./InfraredTextBlocks";
import {
  HOME_IMAGE_BLEED_MOBILE,
  HOME_SECTION_CLASS,
  HOME_SECTION_PY,
  HOME_STICKY_IMAGE_CLASS,
  SITE_SECTION_HEADING_CLASS,
} from "@/components/home/HomeContent";

export default function InfraredQualitySection() {
  return (
    <section
      id={IR_QUALITY.id}
      className={`${HOME_SECTION_CLASS} border-t border-gray-200/80 bg-[#F4F7FA] ${HOME_SECTION_PY}`}
    >
      <div className={`${IR_SECTION_SHELL} relative z-10 pt-2`}>
        <div className={IR_CONTENT_WIDTH}>
          <div className="grid w-full min-w-0 grid-cols-1 items-start gap-6 max-lg:gap-y-4 md:gap-8 lg:grid-cols-[minmax(0,1fr)_44%] xl:grid-cols-[minmax(0,1fr)_46%] xl:gap-12">
            <div className="col-span-full mb-0 text-left md:mb-1 lg:mb-2">
              <h2 className={`w-full break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}>
                {IR_QUALITY.title}
              </h2>
            </div>

            <div className="max-lg:col-span-full min-w-0 w-full">
              <InfraredTextBlocks blocks={IR_QUALITY.blocks} />
            </div>

            <div
              className={`w-full min-w-0 max-lg:col-span-full ${HOME_IMAGE_BLEED_MOBILE} lg:-mr-[calc(max(2rem,50vw-32rem))] lg:w-[calc(100%+max(2rem,50vw-32rem))] ${HOME_STICKY_IMAGE_CLASS}`}
            >
              <img
                src={IR_QUALITY.trainingImageSrc}
                alt={IR_QUALITY.trainingImageAlt}
                className="block w-full max-h-[480px] lg:max-h-[540px] object-contain object-right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
