import { Check } from "lucide-react";
import {
  FORTIFIED_STRAIGHTFORWARD,
  FORTIFIED_TAB_TWO_COL_TEXT_IMAGE_RIGHT,
} from "./fortifiedContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_SECTION_PY,
} from "@/components/home/HomeContent";

const STEEP_IMAGE_CLASS =
  "relative min-h-[220px] w-full sm:min-h-[260px] lg:h-[340px] lg:min-h-[340px] xl:h-[380px] xl:min-h-[380px]";

function StraightforwardBullet({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3 text-[13px] font-bold text-[#166534] md:text-[14px]">
      <span
        className="flex h-4 w-4 shrink-0 items-center justify-center bg-[#166534]"
        aria-hidden
      >
        <Check className="h-3 w-3 stroke-[3] text-white" />
      </span>
      {label}
    </li>
  );
}

export default function FortifiedStraightforwardSection() {
  return (
    <section className={`overflow-x-clip border-t border-gray-200 bg-[#F5F5F5] ${SITE_TAB_SECTION_PY}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch lg:gap-0">
        <div
          className={`flex items-start py-6 sm:py-8 md:py-10 lg:order-1 lg:py-12 ${FORTIFIED_TAB_TWO_COL_TEXT_IMAGE_RIGHT}`}
        >
          <div className="w-full min-w-0">
            <h2
              className={`break-words text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}
            >
              {FORTIFIED_STRAIGHTFORWARD.title}
            </h2>
            <div className={`mt-3 space-y-4 ${SITE_BODY_CLASS}`}>
              {FORTIFIED_STRAIGHTFORWARD.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-4 space-y-3">
              {FORTIFIED_STRAIGHTFORWARD.bullets.map((bullet) => (
                <StraightforwardBullet key={bullet} label={bullet} />
              ))}
            </ul>
          </div>
        </div>

        <div
          className={`${STEEP_IMAGE_CLASS} max-lg:left-1/2 max-lg:w-[100dvw] max-lg:max-w-none max-lg:-translate-x-1/2 lg:order-2 lg:w-full`}
        >
          <img
            src={FORTIFIED_STRAIGHTFORWARD.imageSrc}
            alt={FORTIFIED_STRAIGHTFORWARD.imageAlt}
            className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
          />
        </div>
      </div>
    </section>
  );
}
