"use client";

import { HOME_CONTENT_CLASS, HOME_SECTION_CLASS, SITE_SECTION_HEADING_CLASS, HOME_TEXT_WIDTH } from "./HomeContent";

type LogoSizing = "nspe" | "wide-md" | "badge";

const LOGO_SIZE_CLASS: Record<LogoSizing, string> = {
  // Ultra-wide asset (1400×322): height + scale so width cap does not shrink it
  nspe: "h-[42%] w-auto object-contain origin-center scale-[3.15] sm:scale-[3.4]",
  "wide-md": "h-[62%] w-auto max-w-[94%] object-contain",
  badge: "h-[74%] w-[74%] object-contain",
};

const CREDENTIALS = [
  {
    src: "/logo-nspe.png",
    alt: "NSPE - National Society of Professional Engineers",
    sizing: "nspe" as const,
  },
  {
    src: "/logo-fortified-cert.png",
    alt: "FORTIFIED ROOF Certified",
    sizing: "wide-md" as const,
  },
  {
    src: "/logo-iac2.png",
    alt: "IAC2 Certified - International Association of Certified Indoor Air Consultants",
    sizing: "badge" as const,
  },
  {
    src: "/logo-infrared-thermographer.png",
    alt: "Infrared Training Center Level II Certified Infrared Thermographer",
    sizing: "badge" as const,
  },
  {
    src: "/logo-faa-part107.png",
    alt: "FAA Certified Part 107 UAS Pilot",
    sizing: "badge" as const,
  },
  {
    src: "/logo-bpi.png",
    alt: "BPI - Building Performance Institute",
    sizing: "badge" as const,
  },
] as const;

export default function CredentialsSection() {
  return (
    <section
      className={`${HOME_SECTION_CLASS} py-10 sm:py-12 bg-[#F5F5F5] border-t border-gray-100 overflow-hidden`}
    >
      <div className={`${HOME_CONTENT_CLASS} relative z-10`}>
        <div className={HOME_TEXT_WIDTH}>
        <div className="text-center mb-8 sm:mb-10">
          <h2 className={`mx-auto w-full break-words text-center text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}>
            <span className="block">Professional Certifications & Memberships</span>
          </h2>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-5">
          {CREDENTIALS.map((credential) => (
            <div
              key={credential.src}
              className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white p-2 shadow-[0_2px_12px_rgb(0,0,0,0.06)] sm:p-3"
            >
              <img
                src={credential.src}
                alt={credential.alt}
                className={LOGO_SIZE_CLASS[credential.sizing]}
              />
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
