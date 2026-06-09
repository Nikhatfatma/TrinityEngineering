"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  CAREERS_CONTENT_WIDTH,
  CAREERS_INTRO,
  CAREERS_SECTION_SHELL,
} from "./careersContent";
import {
  SITE_BODY_CLASS,
  SITE_CARD_TITLE_CLASS,
  HOME_IMAGE_BLEED_LEFT,
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_SECTION_PY,
} from "@/components/home/HomeContent";

function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const { ref, visible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

export default function CareersIntroSection() {
  return (
    <section className={`max-lg:overflow-x-clip bg-[#F5F5F5] ${SITE_TAB_SECTION_PY}`}>
      <div className={CAREERS_SECTION_SHELL}>
        <ScrollReveal className={CAREERS_CONTENT_WIDTH}>
          <h2 className={`break-words text-left text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}>
            {CAREERS_INTRO.title}
          </h2>
        </ScrollReveal>

        <div className="mt-10 grid min-w-0 grid-cols-1 gap-10 lg:mt-12 lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-14">
          <div
            className={`min-w-0 lg:sticky lg:top-28 lg:self-start ${HOME_IMAGE_BLEED_LEFT}`}
          >
            <img
              src={CAREERS_INTRO.imageSrc}
              alt={CAREERS_INTRO.imageAlt}
              className="block aspect-[4/3] h-auto w-full object-cover lg:aspect-auto lg:min-h-[460px] lg:object-cover xl:min-h-[500px]"
            />
          </div>

          <div className="min-w-0 space-y-5 md:space-y-6">
            {CAREERS_INTRO.blocks.map((block, index) => (
              <ScrollReveal key={block.heading} delayMs={index * 90}>
                <div className="group -mx-2 rounded-lg border border-transparent px-2 py-3 transition-all duration-300 hover:border-[#0047AB]/15 hover:bg-[#F8FAFC] hover:shadow-sm sm:-mx-3 sm:px-4 sm:py-4">
                  <h3 className={`${SITE_CARD_TITLE_CLASS} transition-colors duration-300 group-hover:text-[#003580]`}>
                    {block.heading}
                  </h3>
                  <div
                    className={`mt-3 space-y-3 ${SITE_BODY_CLASS} transition-colors duration-300 group-hover:text-gray-700`}
                  >
                    {block.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {block.bullets.length > 0 && (
                    <ul className={`mt-3 space-y-2.5 ${SITE_BODY_CLASS}`}>
                      {block.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-2.5 transition-transform duration-300 group-hover:translate-x-1"
                        >
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB] transition-all duration-300 group-hover:scale-125 group-hover:bg-[#0047AB]"
                            aria-hidden
                          />
                          <span className="transition-colors duration-300 group-hover:text-gray-800">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </ScrollReveal>
            ))}

            <ScrollReveal delayMs={CAREERS_INTRO.blocks.length * 90}>
              <div className="flex justify-start pt-1">
                <Link
                  href={CAREERS_INTRO.footerLink.href}
                  className="group inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2.5 text-[11px] font-semibold text-[#2563EB] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0047AB] hover:bg-[#0047AB]/5 hover:text-[#0047AB] hover:shadow-sm"
                >
                  {CAREERS_INTRO.footerLink.label}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
