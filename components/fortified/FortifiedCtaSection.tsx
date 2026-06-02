import Link from "next/link";
import {
  FORTIFIED_CONTENT_WIDTH,
  FORTIFIED_CTA,
  FORTIFIED_SECTION_SHELL,
} from "./fortifiedContent";
import {
  SITE_BODY_CLASS,
  SITE_SECTION_HEADING_CLASS,
  SITE_SECTION_HEADING_STYLE,
} from "@/components/home/HomeContent";

export default function FortifiedCtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-gray-200 py-16 md:py-20 lg:py-24">
      <img
        src={FORTIFIED_CTA.backgroundImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[#0f192d]/85" />

      <div className={`relative z-10 text-center text-white ${FORTIFIED_SECTION_SHELL}`}>
        <div className={FORTIFIED_CONTENT_WIDTH}>
          <h2
            className={`text-white ${SITE_SECTION_HEADING_CLASS}`}
            style={SITE_SECTION_HEADING_STYLE}
          >
            {FORTIFIED_CTA.title}
          </h2>
          <p className={`mt-4 min-w-0 break-words text-white/90 ${SITE_BODY_CLASS}`}>{FORTIFIED_CTA.body}</p>
          <p className={`mt-4 min-w-0 break-words text-white/90 ${SITE_BODY_CLASS}`}>
            {FORTIFIED_CTA.emailLead}{" "}
            <Link
              href={`mailto:${FORTIFIED_CTA.email}`}
              className="break-all font-semibold text-white underline hover:text-white/90 sm:break-words"
            >
              {FORTIFIED_CTA.email}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
