"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import SectionDivider from "./SectionDivider";
import { HOME_CONTENT_CLASS, HOME_SECTION_CLASS } from "./HomeContent";

const FORTIFIED_ITEMS = [
  "Rooftop Decks",
  "Rooftop Knee-Walls",
  "Solar Electric Panels",
  "Solar Hot Water Panels",
  "Walkable Flat Roof",
  "Timber Rafters",
  "Round Roof",
];

const FORTIFIED_SLIDES = [
  { image: "/fortified-beach.png", alt: "FORTIFIED Roof program coastal community" },
  { image: "/fortified-deck.png", alt: "Rooftop deck eligibility solution" },
  { image: "/fortified-knee-wall.png", alt: "Knee wall on roof eligibility solution" },
  { image: "/fortified-mounted.png", alt: "Rooftop mounted equipment eligibility solution" },
  { image: "/fortified-handrail.png", alt: "Handrail through flat roof eligibility solution" },
  { image: "/fortified-walkable.png", alt: "Walkable flat roof eligibility solution" },
  { image: "/fortified-timber.png", alt: "Timber rafters eligibility solution" },
  { image: "/fortified-round.png", alt: "Round roof eligibility solution" },
] as const;

export default function FortifiedSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % FORTIFIED_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % FORTIFIED_SLIDES.length);
  const goToSlide = (index: number) => setCurrentSlide(index);

  return (
    <>
      <section className={`${HOME_SECTION_CLASS} bg-white py-6 sm:py-8 text-center`}>
        <div className={HOME_CONTENT_CLASS}>
          <SectionDivider viaClass="via-[#00A859]" className="mb-6 sm:mb-8" />
          <div className="inline-block max-w-[95vw] bg-[#00A859] text-white text-[9px] sm:text-[10px] md:text-[11px] font-bold px-4 sm:px-6 py-2 uppercase tracking-[0.2em] sm:tracking-[0.3em] rounded-full shadow-sm">
            FORTIFIED ELIGIBILITY SOLUTIONS
          </div>
        </div>
      </section>

      <section className={`${HOME_SECTION_CLASS} bg-white`}>
        <div className="w-full bg-[#001D3D] pb-[6.5rem] pt-8 text-white max-lg:text-left lg:text-center sm:pb-[8rem] sm:pt-10 md:pb-[11.5rem] md:pt-12 lg:pb-[15rem] lg:pt-14">
          <div className={`${HOME_CONTENT_CLASS} relative z-10`}>
            <div className="mx-auto w-full max-w-6xl min-w-0">
              <div className="w-full min-w-0 lg:hidden md:w-[68%] md:max-w-[36rem]">
                <p className="text-left text-sm font-bold leading-snug md:text-lg">Whether You Have:</p>
                <ul className="mt-4 space-y-2.5 md:mt-5 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-3 md:space-y-0">
                  {FORTIFIED_ITEMS.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-left text-xs font-bold leading-snug md:gap-3 md:text-base"
                    >
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 stroke-[3] md:h-4 md:w-4" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 text-left text-sm font-bold leading-snug md:mt-10 md:text-[17px]">
                  <span className="block">
                    We are <span className="text-blue-400">The only engineering firm</span>
                  </span>
                  <span className="mt-2 block max-md:whitespace-normal md:whitespace-nowrap">
                    providing eligibility solutions for the{" "}
                    <span className="font-bold">FORTIFIED ROOF™ Program</span>
                  </span>
                </div>
              </div>

              <h2 className="hidden px-1 text-lg font-light leading-snug tracking-tight lg:block lg:text-2xl">
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
        </div>

        <div className="relative z-10 -mt-[clamp(2.5rem,10vw,4rem)] overflow-x-clip overflow-y-visible pb-8 sm:-mt-[clamp(3rem,12vw,5.5rem)] sm:pb-10 md:-mt-[clamp(4rem,14vw,7rem)] md:pb-14 lg:-mt-[8.5rem]">
          <div className={`${HOME_CONTENT_CLASS} min-w-0`}>
            <div className="relative mx-auto w-full max-w-5xl min-w-0">
              <div className="relative flex w-full justify-center overflow-hidden">
                <div className="relative w-fit max-w-full">
                  <img
                    src={FORTIFIED_SLIDES[currentSlide].image}
                    alt={FORTIFIED_SLIDES[currentSlide].alt}
                    className="block h-auto w-auto max-h-[16rem] max-w-full object-contain object-center transition-opacity duration-700 sm:max-h-[18rem] md:max-h-[20rem] lg:max-h-[22rem]"
                  />
                </div>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#00A859] text-white shadow-md transition-transform hover:scale-105 sm:right-4 sm:h-10 sm:w-10 md:h-11 md:w-11"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" strokeWidth={3} />
                </button>
              </div>

              <div className="mt-3 flex w-full justify-center gap-1.5">
                {FORTIFIED_SLIDES.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    type="button"
                    onClick={() => goToSlide(dotIndex)}
                    className={`rounded-full ${
                      dotIndex === currentSlide ? "h-2 w-5 bg-[#001D3D]" : "h-2 w-2 bg-[#001D3D]/35"
                    }`}
                    aria-label={`Go to slide ${dotIndex + 1}`}
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
