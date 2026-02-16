"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const slides = [
    {
      badge: "Most Requested Service",
      headline: ["Storm Damage", "Investigation", "Services"],
      accentLine: 0,
      description: "Hurricane, wind, hail, and severe weather damage assessment with 24-hour deployment nationwide.",
      stat: "5,000+",
      statLabel: "Storm Cases Completed",
      statIcon: "cyclone",
      statColor: "primary",
      serviceIcon: "cyclone",
      serviceLink: "/services/storm-damage",
    },
    {
      badge: "Critical Infrastructure",
      headline: ["Structural", "Engineering", "Analysis"],
      accentLine: 0,
      description: "Foundation settlement, framing failures, and load-bearing analysis with PE-certified engineers.",
      stat: "2,500+",
      statLabel: "Structural Investigations",
      statIcon: "architecture",
      statColor: "accent",
      serviceIcon: "architecture",
      serviceLink: "/services/structural",
    },
    {
      badge: "Advanced Detection",
      headline: ["Water Loss", "Source", "Identification"],
      accentLine: 0,
      description: "Advanced plumbing failure and intrusion source identification with thermal imaging and moisture mapping.",
      stat: "3,800+",
      statLabel: "Water Loss Cases",
      statIcon: "opacity",
      statColor: "primary",
      serviceIcon: "opacity",
      serviceLink: "/services/water-loss",
    },
    {
      badge: "Premium Certification",
      headline: ["FORTIFIED", "Roof", "Evaluation"],
      accentLine: 0,
      description: "Official FORTIFIED certification and high-wind roof system evaluation by certified inspectors.",
      stat: "1,200+",
      statLabel: "FORTIFIED Inspections",
      statIcon: "shield",
      statColor: "green",
      serviceIcon: "shield",
      serviceLink: "/services/fortified",
    },
    {
      badge: "Complex Cases",
      headline: ["Large Loss", "Multi-Discipline", "Investigations"],
      accentLine: 0,
      description: "Comprehensive investigations for catastrophic property failures requiring multiple engineering disciplines.",
      stat: "850+",
      statLabel: "Large Loss Cases",
      statIcon: "warning",
      statColor: "accent",
      serviceIcon: "warning",
      serviceLink: "/services/large-loss",
    },
    {
      badge: "Origin & Cause",
      headline: ["Fire", "Investigation", "Services"],
      accentLine: 0,
      description: "Origin and cause determination for residential and commercial fires with expert testimony available.",
      stat: "1,400+",
      statLabel: "Fire Investigations",
      statIcon: "local_fire_department",
      statColor: "primary",
      serviceIcon: "local_fire_department",
      serviceLink: "/services/small-fire",
    },
  ];

  // Auto-rotate slides - FASTER
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setSlideDirection("right");
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change every 3 seconds (faster!)

    return () => clearInterval(timer);
  }, [slides.length, isAutoPlaying]);

  const currentContent = slides[currentSlide];

  // Navigation functions
  const goToSlide = (index: number) => {
    if (index > currentSlide) {
      setSlideDirection("right");
    } else {
      setSlideDirection("left");
    }
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setSlideDirection("right");
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setSlideDirection("left");
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      prevSlide();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <header 
      className="relative min-h-screen overflow-hidden bg-black dark:bg-background-dark flex items-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >

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

      {/* === Carousel Navigation Arrows === */}
      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 group"
        aria-label="Previous slide"
      >
        <div className="relative w-14 h-14 md:w-16 md:h-16 backdrop-blur-xl bg-white/10 hover:bg-primary/90 border-2 border-white/30 hover:border-primary rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-2xl">
          <span className="material-symbols-outlined text-white text-3xl group-hover:-translate-x-1 transition-transform">
            chevron_left
          </span>
          {/* Keyboard hint */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white/60 text-xs font-bold">←</span>
          </div>
        </div>
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 group"
        aria-label="Next slide"
      >
        <div className="relative w-14 h-14 md:w-16 md:h-16 backdrop-blur-xl bg-white/10 hover:bg-primary/90 border-2 border-white/30 hover:border-primary rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-2xl">
          <span className="material-symbols-outlined text-white text-3xl group-hover:translate-x-1 transition-transform">
            chevron_right
          </span>
          {/* Keyboard hint */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white/60 text-xs font-bold">→</span>
          </div>
        </div>
      </button>

      {/* Carousel Label - Top Center */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 px-6 py-3 rounded-full shadow-xl">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-accent text-lg animate-pulse">
              view_carousel
            </span>
            <span className="text-white text-sm font-bold uppercase tracking-wider">
              Service Showcase
            </span>
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
            <span className="text-white/80 text-xs font-semibold">
              Swipe or use arrows
            </span>
          </div>
        </div>
      </div>

      {/* === Main Content Container === */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* ========== LEFT: MAIN CONTENT (8 cols) ========== */}
          <div className="lg:col-span-8 space-y-12">

            {/* Trust Badge - Animated */}
            <div 
              key={`badge-${currentSlide}`}
              className="inline-flex items-center gap-3 backdrop-blur-md bg-white/10 border border-white/20 px-6 py-3 rounded-full transition-all duration-300"
              style={{
                animation: "fadeInUp 0.3s ease-out both",
              }}
            >
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-white font-bold text-sm uppercase tracking-widest">
                {currentContent.badge}
              </span>
            </div>

            {/* Massive Headline - Animated with faster transitions */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95]">
                {currentContent.headline.map((line, index) => (
                  <span
                    key={`${currentSlide}-${index}`}
                    className={`block transition-all duration-300 ${
                      index === currentContent.accentLine
                        ? "text-primary dark:text-accent"
                        : "text-white"
                    }`}
                    style={{
                      animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    {line}
                  </span>
                ))}
              </h1>
              <p 
                key={`desc-${currentSlide}`}
                className="text-2xl md:text-3xl text-gray-200 font-light leading-relaxed max-w-2xl transition-all duration-300"
                style={{
                  animation: "fadeInUp 0.4s ease-out 0.3s both",
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

            {/* Animated Stat Card - Changes with content - FASTER */}
            <div 
              key={`stat-${currentSlide}`}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all group"
              style={{
                animation: "fadeInRight 0.4s ease-out 0.2s both",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-16 h-16 ${
                  currentContent.statColor === "green" 
                    ? "bg-green-500/20" 
                    : currentContent.statColor === "accent"
                    ? "bg-accent/20"
                    : "bg-primary/20"
                } rounded-2xl flex items-center justify-center transition-all duration-300`}>
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

        {/* All Services Pills - Bottom */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              All Services:
            </span>
            {[
              { name: "Storm Damage", icon: "cyclone", href: "/services/storm-damage" },
              { name: "Structural", icon: "architecture", href: "/services/structural" },
              { name: "Water Loss", icon: "opacity", href: "/services/water-loss" },
              { name: "FORTIFIED", icon: "shield", href: "/services/fortified" },
              { name: "Large Loss", icon: "warning", href: "/services/large-loss" },
              { name: "Fire Investigation", icon: "local_fire_department", href: "/services/small-fire" },
              { name: "Plumbing Failure", icon: "plumbing", href: "/services/plumbing-failure" },
              { name: "HVAC/Electrical", icon: "electrical_services", href: "/services/hvac-electrical" },
              { name: "Component Failure", icon: "build", href: "/services/component-failure" },
              { name: "Lightning Damage", icon: "bolt", href: "/services/lightning-damage" },
              { name: "Chimney Collapse", icon: "home", href: "/services/chimney-collapse" },
              { name: "Fraud Investigation", icon: "gavel", href: "/services/vandalism-fraud" },
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

      {/* === Carousel Indicators - Enhanced === */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-full px-6 py-4 shadow-2xl">
          <div className="flex items-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`group relative transition-all duration-300 ${
                  index === currentSlide
                    ? "w-14"
                    : "w-10"
                }`}
                aria-label={`Go to slide ${index + 1}: ${slide.badge}`}
              >
                {/* Progress bar for active slide - FASTER */}
                {index === currentSlide && isAutoPlaying && (
                  <div className="absolute inset-0 bg-primary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent"
                      style={{
                        animation: "progress 3s linear",
                        transformOrigin: "left"
                      }}
                    />
                  </div>
                )}
                
                {/* Indicator dot/bar */}
                <div className={`relative h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-primary shadow-lg shadow-primary/50"
                    : "bg-white/40 group-hover:bg-white/60"
                }`} />
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl">
                    {slide.badge}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white/95"></div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Slide counter */}
          <div className="text-center mt-3">
            <span className="text-white/80 text-xs font-bold">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </div>
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

      {/* === Auto-play indicator === */}
      <div className="absolute top-8 right-8 z-20 backdrop-blur-xl bg-white/10 border border-white/20 px-4 py-2 rounded-full shadow-xl">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className="material-symbols-outlined text-accent text-sm animate-pulse">
              play_circle
            </span>
            <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping"></div>
          </div>
          <span className="text-white text-xs font-bold uppercase tracking-wider">
            Auto-Playing
          </span>
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

        @keyframes progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Faster, smoother transitions */
        .transition-all {
          transition-duration: 300ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Smooth content transitions */
        header * {
          transition-property: opacity, transform;
          transition-duration: 500ms;
          transition-timing-function: ease-in-out;
        }

        /* Custom scrollbar for carousel area */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>

    </header>
  );
}
