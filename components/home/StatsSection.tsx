"use client";

import { useState, useEffect, useRef } from "react";
import SectionDivider from "./SectionDivider";
import { HOME_CONTENT_CLASS, HOME_SECTION_CLASS, HOME_SECTION_HEADING } from "./HomeContent";

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
      className="group max-lg:bg-[#E8F1FC]/82 max-lg:backdrop-blur-[1px] max-lg:border-[#0047AB]/15 bg-white/40 backdrop-blur-md p-5 md:p-8 rounded-2xl md:rounded-3xl border border-white/50 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] max-lg:hover:-translate-y-0 hover:-translate-y-2 transition-all duration-500"
    >
      <div className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-4 tracking-tighter group-hover:text-[#0047AB] transition-colors">
        {displayValue}
      </div>
      <div className="w-10 h-[2px] bg-blue-500/30 mx-auto mb-4 group-hover:w-20 transition-all" />
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
    <>
      <div className={`${HOME_CONTENT_CLASS} flex w-full justify-center max-lg:py-1 py-4`}>
        <SectionDivider viaClass="via-[#1a1a1a]" className="mb-0" />
      </div>
      <section className={`${HOME_SECTION_CLASS} overflow-hidden bg-[#E8F1FC] py-10 max-lg:min-h-0 max-lg:pb-8 max-lg:pt-3`}>
        {/* Mobile / tablet — house watermark (Figma: bottom center) */}
        <img
          src="/stats-bg.png"
          alt=""
          className="pointer-events-none absolute bottom-0 left-1/2 z-[1] h-auto w-[min(100%,30rem)] max-h-[min(48vh,22rem)] max-w-none -translate-x-1/2 object-contain object-bottom opacity-100 sm:w-[min(100%,38rem)] sm:max-h-[min(52vh,26rem)] md:w-[min(100%,46rem)] md:max-h-[min(58vh,32rem)] lg:hidden"
          aria-hidden
        />
        {/* Desktop — subtle multiply blend */}
        <div className="pointer-events-none absolute inset-0 z-0 hidden items-center justify-center lg:flex">
          <img
            src="/stats-bg.png"
            className="h-auto w-full max-w-4xl object-contain opacity-[0.4] grayscale mix-blend-multiply"
            alt=""
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.02] max-lg:hidden"
          style={{
            backgroundImage: "radial-gradient(#1a1a1a 0.5px, transparent 0.5px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className={`${HOME_CONTENT_CLASS} relative z-10 text-center`}>
          <h2
            className={`mx-auto w-full text-[#1A1A1A] text-center tracking-tight leading-[1.2] max-lg:mb-5 mb-8 px-2 lg:font-semibold ${HOME_SECTION_HEADING}`}
            style={{ fontSize: "clamp(0.8125rem, 2.19vw, 2.625rem)" }}
          >
            Industry-Recognized Insurance Claims Expertise
          </h2>

          <div className="relative z-10 mx-auto grid w-full max-w-sm min-w-0 grid-cols-1 gap-4 max-lg:gap-5 sm:max-w-none sm:grid-cols-2 lg:grid-cols-4">
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
      </section>
    </>
  );
}
