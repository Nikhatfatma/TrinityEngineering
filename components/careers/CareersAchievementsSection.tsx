"use client";

import { useEffect, useRef, useState } from "react";
import { CAREERS_ACHIEVEMENTS, CAREERS_SECTION_SHELL } from "./careersContent";
import { SITE_CARD_TITLE_CLASS, SITE_TAB_SECTION_PY } from "@/components/home/HomeContent";

function AchievementBadge({
  imageSrc,
  imageAlt,
  delayMs,
}: {
  imageSrc: string;
  imageAlt: string;
  delayMs: number;
}) {
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
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className="mx-auto h-auto w-full max-w-[320px] object-contain transition-transform duration-300 group-hover:scale-[1.02] sm:max-w-[360px]"
      />
    </div>
  );
}

export default function CareersAchievementsSection() {
  return (
    <section className={`bg-[#F5F5F5] ${SITE_TAB_SECTION_PY}`}>
      <div className={CAREERS_SECTION_SHELL}>
        <p className={`text-center ${SITE_CARD_TITLE_CLASS}`}>
          {CAREERS_ACHIEVEMENTS.eyebrow}
        </p>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-10 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:gap-12">
          {CAREERS_ACHIEVEMENTS.items.map((item, index) => (
            <AchievementBadge
              key={item.rank}
              imageSrc={item.imageSrc}
              imageAlt={item.imageAlt}
              delayMs={index * 120}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
