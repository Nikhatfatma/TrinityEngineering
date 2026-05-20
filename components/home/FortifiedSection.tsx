"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FortifiedSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { 
      image: "/fortified-beach.png", 
      tag: null,
      showLogo: true 
    },
    { 
      image: "/fortified-deck.png", 
      tag: "/tag-rooftop-deck.png" 
    },
    { 
      image: "/fortified-knee-wall.png", 
      tag: "/tag-knee-wall.png" 
    },
    { 
      image: "/fortified-mounted.png", 
      tag: "/tag-rooftop-mounted.png" 
    },
    { 
      image: "/fortified-handrail.png", 
      tag: "/tag-handrail.png" 
    },
    { 
      image: "/fortified-walkable.png", 
      tag: "/tag-walkable-roof.png" 
    },
    { 
      image: "/fortified-timber.png", 
      tag: "/tag-timber-rafters.png" 
    },
    { 
      image: "/fortified-round.png", 
      tag: "/tag-round-roof.png" 
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <>
    <section className="bg-white py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-[60px] md:w-[150px] h-[3px] bg-gradient-to-r from-transparent to-[#00A859] rounded-l-full"></div>
          <div className="w-2.5 h-2.5 rotate-45 bg-[#00A859]"></div>
          <div className="w-[60px] md:w-[150px] h-[3px] bg-gradient-to-l from-transparent to-[#00A859] rounded-r-full"></div>
        </div>
        <div className="inline-block bg-[#00A859] text-white text-[10px] md:text-[11px] font-bold px-5 md:px-6 py-2 uppercase tracking-[0.3em] rounded-full shadow-sm">
          FORTIFIED ELIGIBILITY SOLUTIONS
        </div>
      </section>
      <section className="bg-white">
        {/* Top text block with solid dark blue background */}
        <div className="bg-[#001D3D] pt-10 pb-8 px-4 sm:px-6 text-white text-center relative overflow-x-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-lg md:text-xl lg:text-2xl font-light leading-snug mx-auto tracking-tight px-2">
              <span className="block">
                Whether you have a rooftop deck, knee-wall, or equipment such as solar electric or hot water panels,
              </span>
              <span className="block">
                or a walkable flat roof, timber rafters, or round roof, we are{" "}
                <span className="font-bold text-blue-400">The only engineering firm</span>
              </span>
              <span className="block">
                providing eligibility solutions for the <span className="font-bold">FORTIFIED ROOF™ Program</span>
              </span>
            </h2>
          </div>
        </div>
 
        {/* Overlapping Carousel Area */}
        <div className="relative px-6 pb-10 bg-white">
          {/* Blue background bridge */}
          <div className="absolute top-0 left-0 right-0 h-[80px] bg-[#001D3D]"></div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="relative group max-w-3xl mx-auto">
              
              {/* Carousel Container - Sleeker & Smaller */}
              <div className="relative aspect-[4/3] md:aspect-[2.4/1] overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-[#001D3D]">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <img 
                      src={slide.image} 
                      alt={`Slide ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Tag Overlay */}
                    {slide.tag && (
                      <div className="absolute top-6 left-6 z-20">
                        <img src={slide.tag} alt="Tag" className="h-8 md:h-12 w-auto drop-shadow-lg" />
                      </div>
                    )}

                    {/* Logo Overlay on first slide */}
                    {slide.showLogo && (
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <img 
                          src="/fortified-logo.png" 
                          alt="Fortified Roof Logo" 
                          className="w-48 md:w-80 h-auto drop-shadow-2xl"
                        />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-10"></div>
              </div>

              {/* Navigation Buttons - Clean & Professional */}
              <button 
                onClick={prevSlide}
                className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-30 bg-white text-[#001D3D] w-10 h-10 md:w-14 md:h-14 rounded-full shadow-xl flex items-center justify-center hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={28} />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-30 bg-white text-[#001D3D] w-10 h-10 md:w-14 md:h-14 rounded-full shadow-xl flex items-center justify-center hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={28} />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? "bg-white w-6" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
