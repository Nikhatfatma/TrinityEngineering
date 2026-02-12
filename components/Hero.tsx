"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: "Licensed PE Engineers",
      headline: ["Fastest", "Turnaround", "in the Industry"],
      accentLine: 2,
      description: "Professional forensic engineering investigations. 24-hour deployment. Nationwide coverage.",
      stat: "24hr",
      statLabel: "Emergency Response Time",
      statIcon: "speed",
      statColor: "green",
    },
    {
      badge: "Certified Forensic Experts",
      headline: ["Engineering", "Truth Through", "Investigation"],
      accentLine: 2,
      description: "Precision investigations with defensible reports. Unmatched technical accuracy for insurance and legal professionals.",
      stat: "98%",
      statLabel: "Report Accuracy Rate",
      statIcon: "trending_up",
      statColor: "primary",
    },
    {
      badge: "Nationwide Coverage",
      headline: ["10,000+ Cases", "Completed", "Successfully"],
      accentLine: 1,
      description: "Industry-leading forensic engineering services across all 50 states. Rapid deployment. Expert testimony available.",
      stat: "100%",
      statLabel: "PE Licensed Engineers",
      statIcon: "workspace_premium",
      statColor: "accent",
    },
  ];

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const currentContent = slides[currentSlide];

  return (
    <header className="relative min-h-screen overflow-hidden bg-black dark:bg-background-dark flex items-center">

      {/* === Background Video === */}
      <div className="absolute inset-0 z-0">
        <iframe
          className="absolute top-1/2 left-1/2 w-[100vw] h-[100vh] min-w-[177.77vh] min-h-[56.25vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          src="https://www.youtube.com/embed/gOCW48t0Hng?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&autohide=1&playlist=gOCW48t0Hng&playsinline=1&enablejsapi=1"
          title="Background Video"
          allow="autoplay; fullscreen"
          style={{
            border: 'none',
          }}
        />
        {/* Dramatic Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
      </div>

      {/* === Main Content Container === */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* ========== LEFT: MAIN CONTENT (8 cols) ========== */}
          <div className="lg:col-span-8 space-y-12">

            {/* Trust Badge - Animated */}
            <div className="inline-flex items-center gap-3 backdrop-blur-md bg-white/10 border border-white/20 px-6 py-3 rounded-full transition-all duration-300">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-white font-bold text-sm uppercase tracking-widest">
                {currentContent.badge}
              </span>
            </div>

            {/* Massive Headline - Animated */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95]">
                {currentContent.headline.map((line, index) => (
                  <span
                    key={index}
                    className={`block transition-all duration-500 ${
                      index === currentContent.accentLine
                        ? "text-primary dark:text-accent"
                        : "text-white"
                    }`}
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.15}s both`,
                    }}
                  >
                    {line}
                  </span>
                ))}
              </h1>
              <p 
                className="text-2xl md:text-3xl text-gray-200 font-light leading-relaxed max-w-2xl transition-all duration-400"
                style={{
                  animation: "fadeInUp 0.5s ease-out 0.45s both",
                }}
              >
                {currentContent.description}
              </p>
            </div>

            {/* CTA Buttons - Large & Prominent */}
            <div 
              className="flex flex-col sm:flex-row gap-5 pt-6"
              style={{
                animation: "fadeInUp 0.5s ease-out 0.6s both",
              }}
            >
              <Link
                href="/submit-inspection"
                className="group relative inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark px-10 py-6 rounded-2xl font-bold text-xl text-white shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105"
              >
                <span className="material-symbols-outlined text-2xl">send</span>
                Submit Inspection
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
                  arrow_forward
                </span>
              </Link>

              <Link
                href="tel:+18559295888"
                className="inline-flex items-center justify-center gap-3 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/30 px-10 py-6 rounded-2xl font-bold text-xl text-white transition-all"
              >
                <span className="material-symbols-outlined text-2xl">phone</span>
                (855) 929-5888
              </Link>
            </div>

            {/* Trust Indicators - Compact */}
            <div className="flex flex-wrap gap-8 pt-8 text-base text-gray-300">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-xl">verified</span>
                <span>10,000+ Cases</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-xl">schedule</span>
                <span>24hr Response</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-xl">public</span>
                <span>50 States</span>
              </div>
            </div>

          </div>

          {/* ========== RIGHT: FLOATING STAT CARDS (4 cols) ========== */}
          <div className="lg:col-span-4 hidden lg:flex flex-col gap-6">

            {/* Animated Stat Card - Changes with content */}
            <div 
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all group"
              style={{
                animation: "fadeInRight 0.5s ease-out 0.3s both",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-16 h-16 ${
                  currentContent.statColor === "green" 
                    ? "bg-green-500/20" 
                    : currentContent.statColor === "accent"
                    ? "bg-accent/20"
                    : "bg-primary/20"
                } rounded-2xl flex items-center justify-center`}>
                  <span className={`material-symbols-outlined ${
                    currentContent.statColor === "green" 
                      ? "text-green-400" 
                      : currentContent.statColor === "accent"
                      ? "text-accent"
                      : "text-primary"
                  } text-3xl`}>
                    {currentContent.statIcon}
                  </span>
                </div>
              </div>
              <div className="text-5xl font-black text-white mb-2 transition-all duration-300">
                {currentContent.stat}
              </div>
              <div className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                {currentContent.statLabel}
              </div>
            </div>

            {/* Static Stat Card 2 */}
            <div 
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all group"
              style={{
                animation: "fadeInRight 0.5s ease-out 0.4s both",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-accent text-3xl">
                    public
                  </span>
                </div>
              </div>
              <div className="text-5xl font-black text-white mb-2">50</div>
              <div className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                States Covered
              </div>
            </div>

            {/* Static Stat Card 3 */}
            <div 
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all group"
              style={{
                animation: "fadeInRight 0.5s ease-out 0.5s both",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    gavel
                  </span>
                </div>
              </div>
              <div className="text-5xl font-black text-white mb-2">Expert</div>
              <div className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Testimony Available
              </div>
            </div>

          </div>
        </div>

        {/* Featured Services Pills - Bottom */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Featured Services:
            </span>
            {[
              { name: "Storm Damage", icon: "cyclone", href: "/services/storm-damage" },
              { name: "Structural", icon: "architecture", href: "/services/structural" },
              { name: "Water Loss", icon: "opacity", href: "/services/water-loss" },
              { name: "FORTIFIED", icon: "shield", href: "/services/fortified" },
              { name: "Large Loss", icon: "warning", href: "/services/large-loss" },
              { name: "Fire Investigation", icon: "local_fire_department", href: "/services/small-fire" },
            ].map((service) => (
              <Link
                key={service.name}
                href={service.href}
                className="group flex items-center gap-2 backdrop-blur-md bg-white/5 hover:bg-white/15 border border-white/20 px-5 py-3 rounded-full transition-all"
              >
                <span className="material-symbols-outlined text-accent group-hover:text-white text-base transition-colors">
                  {service.icon}
                </span>
                <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                  {service.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* === Slide Indicators === */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-200 rounded-full ${
              index === currentSlide
                ? "w-12 h-2 bg-primary"
                : "w-2 h-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* === Scroll Indicator === */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* === CSS Animations === */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Faster transitions for quicker slide changes */
        .transition-all {
          transition-duration: 400ms;
        }
      `}</style>

    </header>
  );
}
