"use client";

import { useState, useEffect, useRef } from "react";

function Counter({ value, label }: { value: string, label: string }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  
  // Parse target number and suffix
  const numericValue = parseInt(value.replace(/,/g, ""));
  const suffix = value.includes("+") ? "+" : "";
  const isYear = value === "2014";

  useEffect(() => {
    let start = 0;
    const end = numericValue;
    const duration = 2000; // 2 seconds
    let startTime: number | null = null;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (countRef.current) observer.observe(countRef.current);

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smoother finish
      const easeOutQuad = (t: number) => t * (2 - t);
      const currentCount = Math.floor(easeOutQuad(progress) * end);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    return () => observer.disconnect();
  }, [numericValue]);

  return (
    <div ref={countRef} className="group max-lg:bg-[#E8F1FC] max-lg:border-[#0047AB]/10 bg-white/40 backdrop-blur-md p-5 md:p-8 rounded-2xl md:rounded-3xl border border-white/50 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] max-lg:hover:-translate-y-0 hover:-translate-y-2 transition-all duration-500">
      <div className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-4 tracking-tighter group-hover:text-[#0047AB] transition-colors">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="w-10 h-[2px] bg-blue-500/30 mx-auto mb-4 group-hover:w-20 transition-all"></div>
      <div className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-[0.25em] leading-snug">
        {label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const stats = [
    { value: "20,000+", label: "INSPECTIONS EXPERIENCE" },
    { value: "12", label: "AVG DAYS TO COMPLETION" },
    { value: "16", label: "STATES COVERED" },
    { value: "2014", label: "ESTABLISHED RECORD" }
  ];

  return (
    <>
      <div className="bg-white py-4 px-6 w-full flex justify-center">
        <div className="flex items-center justify-center gap-4">
          <div className="w-[60px] md:w-[150px] h-[3px] bg-gradient-to-r from-transparent to-[#1a1a1a] rounded-l-full"></div>
          <div className="w-2.5 h-2.5 rotate-45 bg-[#1a1a1a]"></div>
          <div className="w-[60px] md:w-[150px] h-[3px] bg-gradient-to-l from-transparent to-[#1a1a1a] rounded-r-full"></div>
        </div>
      </div>
      <section className="py-10 max-lg:py-12 bg-[#F8FAFC] relative overflow-hidden px-4 sm:px-6">
        {/* Background Drawing Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
           <img 
             src="/stats-bg.png" 
             className="w-full max-w-[1400px] object-contain opacity-[0.4] grayscale mix-blend-multiply" 
             alt="Stats Background"
           />
        </div>

        {/* Subtle Tech Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1a1a1a 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <h2
            className="mx-auto w-full font-semibold text-[#1A1A1A] text-center tracking-tight leading-[1.2] lg:whitespace-nowrap mb-8"
            style={{ fontSize: "clamp(0.8125rem, 2.19vw, 2.625rem)" }}
          >
            Industry-Recognized Insurance Claims Expertise
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-lg:gap-5 max-lg:max-w-sm max-lg:mx-auto">
            {stats.map((stat, index) => (
              <Counter key={index} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
