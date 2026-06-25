"use client";

import { useState, useEffect, useRef } from "react";
import { HOME_CONTENT_CLASS, HOME_SECTION_CLASS, SITE_SECTION_HEADING_CLASS, HOME_TEXT_WIDTH } from "./HomeContent";

function Counter({
  value,
  label,
  animate = false,
}: {
  value: string;
  label: string;
  animate?: boolean;
}) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);

  const numericValue = parseInt(value.replace(/,/g, ""), 10);
  const suffix = value.includes("+") ? "+" : "";

  useEffect(() => {
    if (!animate) return;

    const duration = 2000;
    let startTime: number | null = null;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(animateCount);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (countRef.current) observer.observe(countRef.current);

    function animateCount(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuad = (t: number) => t * (2 - t);
      const currentCount = Math.floor(easeOutQuad(progress) * numericValue);
      setCount(currentCount);
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    }

    return () => observer.disconnect();
  }, [animate, numericValue]);

  const displayValue = animate ? `${count.toLocaleString()}${suffix}` : value;

  return (
    <div
      ref={countRef}
      className="group bg-transparent border-0 p-5 shadow-none sm:p-6 md:p-7"
    >
      <div className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-4 tracking-tighter group-hover:text-[#0047AB] transition-colors">
        {displayValue}
      </div>
      <div className="mx-auto mb-4 h-[3px] w-20 bg-blue-500/35 transition-all group-hover:w-32 sm:w-24 sm:group-hover:w-40 md:w-28 md:group-hover:w-48" />
      <div className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-[0.25em] leading-snug">
        {label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const stats = [
    { value: "20,000+", label: "INSPECTIONS EXPERIENCE", animate: true },
    { value: "12", label: "AVG DAYS TO COMPLETION", animate: false },
    { value: "16", label: "STATES COVERED", animate: true },
    { value: "2014", label: "ESTABLISHED RECORD", animate: false },
  ];

  return (
    <section
      className={`${HOME_SECTION_CLASS} min-h-[16rem] overflow-hidden bg-[#E8F1FC] py-8 sm:min-h-[18rem] sm:py-10 md:min-h-[20rem] md:py-12 lg:min-h-[22rem] lg:py-12`}
    >
        {/* House watermark — bottom center, high visibility */}
        <img
          src="/stats-bg.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 z-[1] h-auto w-[min(105%,34rem)] max-h-[min(62vh,26rem)] max-w-none -translate-x-1/2 object-contain object-bottom opacity-[0.88] sm:w-[min(100%,42rem)] sm:max-h-[min(68vh,30rem)] sm:opacity-90 md:w-[min(100%,50rem)] md:max-h-[min(72vh,34rem)] lg:w-[min(100%,56rem)] lg:max-h-[min(78vh,38rem)] lg:opacity-85"
        />

        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.02] max-lg:hidden"
          style={{
            backgroundImage: "radial-gradient(#1a1a1a 0.5px, transparent 0.5px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className={`${HOME_CONTENT_CLASS} relative z-10 flex min-h-[inherit] flex-col justify-center py-2 text-center sm:py-4`}>
          <div className={HOME_TEXT_WIDTH}>
          <h2 className={`mx-auto mb-4 w-full break-words text-center text-[#1A1A1A] sm:mb-5 md:mb-6 ${SITE_SECTION_HEADING_CLASS}`}>
            Industry-Recognized Insurance Claims Expertise
          </h2>

          <div className="relative z-10 grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {stats.map((stat, index) => (
              <Counter
                key={index}
                value={stat.value}
                label={stat.label}
                animate={stat.animate}
              />
            ))}
          </div>
          </div>
        </div>
      </section>
  );
}
