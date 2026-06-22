import SectionDivider from "@/components/home/SectionDivider";
import {
  IR_CONFIRMATION,
  IR_CONTENT_WIDTH,
  IR_SECTION_SHELL,
} from "./infraredThermographyContent";
import { InfraredTextBlocks } from "./InfraredTextBlocks";
import {
  HOME_IMAGE_BLEED_MOBILE,
  HOME_SECTION_CLASS,
  HOME_SECTION_PY,
  HOME_STACKED_IMAGE_CLASS,
  HOME_STICKY_IMAGE_CLASS,
  HOME_STICKY_IMAGE_SIZE_CLASS,
  SITE_SECTION_HEADING_CLASS,
} from "@/components/home/HomeContent";

export default function InfraredConfirmationSection() {
  return (
    <section
      id={IR_CONFIRMATION.id}
      className={`${HOME_SECTION_CLASS} bg-[#F4F5F5] py-[100px]`}
    >
      <div className={`${IR_SECTION_SHELL} relative z-10 pt-2`}>
        <div className={IR_CONTENT_WIDTH}>
          <div className="grid w-full min-w-0 grid-cols-1 items-start gap-6 max-lg:gap-y-4 md:gap-8 lg:grid-cols-[48%_minmax(0,1fr)] xl:grid-cols-[52%_minmax(0,1fr)] xl:gap-12">
            <div className="col-span-full mb-0 text-left md:mb-1 lg:mb-2">
              <h2
                className={`w-full break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
              >
                {IR_CONFIRMATION.title}
              </h2>
            </div>

            <div
              className={`w-full min-w-0 max-lg:col-span-full ${HOME_IMAGE_BLEED_MOBILE} lg:-ml-[calc(max(2rem,50vw-32rem))] lg:w-[calc(100%+max(2rem,50vw-32rem))] ${HOME_STICKY_IMAGE_CLASS}`}
            >
              <img
                src={IR_CONFIRMATION.imageSrc}
                alt={IR_CONFIRMATION.imageAlt}
                className="block w-full h-auto aspect-[4/3] lg:aspect-[16/10] xl:aspect-[16/9] lg:object-cover lg:object-top"
              />
            </div>

            <div className="max-lg:col-span-full min-w-0 w-full">
              <InfraredTextBlocks blocks={IR_CONFIRMATION.blocks} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
