"use client";

import SectionDivider from "./SectionDivider";
import { HOME_CONTENT_CLASS, HOME_SECTION_CLASS, HOME_SECTION_HEADING, HOME_TEXT_WIDTH } from "./HomeContent";

export default function WeatherScrutiny() {
  return (
    <section className={`${HOME_SECTION_CLASS} py-10 md:py-12 bg-[#F8FAFC] overflow-hidden`}>
      {/* Technical Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1a1a1a 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      
      <div className={`${HOME_CONTENT_CLASS} relative z-10`}>
        <div className="text-center mb-8 md:mb-10">
          <div className={HOME_TEXT_WIDTH}>
          <SectionDivider viaClass="via-[#1a1a1a]" />
          <div className="inline-block bg-[#1a1a1a] text-white text-[9px] md:text-[10px] font-bold px-4 md:px-5 py-1.5 mb-4 uppercase tracking-[0.3em] rounded-full shadow-sm">
            HISTORICAL WEATHER ANALYSIS
          </div>
          <h2
            className={`text-center text-xl leading-[1.2] tracking-tight text-[#1A1A1A] sm:text-2xl md:text-3xl lg:font-bold lg:text-5xl ${HOME_SECTION_HEADING}`}
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 3.5rem)" }}
          >
            Weather Reporting Built To <span className="lg:font-bold">Withstand Scrutiny.</span>
          </h2>
          <p
            className="mx-auto mt-5 w-full text-gray-600 text-center tracking-normal font-medium leading-snug text-[15px]"
          >
            <span className="block">
              Forensic-grade hail and severe weather analysis for insurance claims backed by named, reproducible government datasets and
            </span>
            <span className="block">a methodology transparent enough for any deposition.</span>
          </p>
          </div>
        </div>

        <div className={HOME_TEXT_WIDTH}>
        {/* SWI Logo Section */}
        <div className="flex flex-col items-center mb-8 md:mb-10">
          <div className="w-[180px] md:w-[320px]">
             <img 
               src="/swi-logo.png" 
               className="w-full h-auto object-contain" 
               alt="Severe Weather Intelligence Logo"
             />
          </div>
        </div>

        <div className="grid grid-cols-1 min-w-0 max-lg:gap-y-4 lg:grid-cols-3 lg:items-stretch gap-8 md:gap-10 xl:gap-16">
          {/* Left: Weather Map */}
          <div className="w-full min-w-0 max-lg:col-span-full self-start lg:col-span-1 lg:flex lg:items-center lg:justify-center">
            <img
              src="/weather-map.png"
              alt="Historical Weather Map"
              className="block w-full h-auto max-lg:object-contain max-lg:object-center lg:max-h-[32rem] lg:w-auto lg:border lg:border-white/50 lg:object-contain lg:shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            />
          </div>

          {/* Middle: Content */}
          <div className="flex h-full flex-col justify-center space-y-8 py-2 md:space-y-10 md:py-4 lg:col-span-1 lg:justify-start lg:space-y-10 lg:pb-4 xl:space-y-12 -mt-2 sm:-mt-3 lg:-mt-4 xl:-mt-5">
            <div>
              <h3 className="text-[#0047AB] font-black text-[12px] mb-6 uppercase tracking-[0.2em] md:text-[13px]">
                BUILT FOR THE DEPOSITION ROOM
              </h3>
              <p className="text-gray-600 text-[15px] font-medium leading-relaxed">
                Every SWI report is built on named, publicly accessible government datasets with documented methodology. When opposing counsel asks how the number was derived, your expert has an answer.
              </p>
            </div>
            <div>
              <h3 className="text-[#0047AB] font-black text-[12px] mb-6 uppercase tracking-[0.2em] md:text-[13px]">
                5 INDEPENDENT DATA SOURCES
              </h3>
              <p className="text-gray-600 text-[15px] font-medium leading-relaxed">
                Storm Events, NEXRAD radar, ASOS stations, IEM reports, and SPC Discussions are cross-referenced with PE-verified empirical data — no single point of failure.
              </p>
            </div>
            <div>
              <h3 className="text-[#0047AB] font-black text-[12px] mb-6 uppercase tracking-[0.2em] md:text-[13px]">
                EMPIRICAL DATA INTEGRATION
              </h3>
              <p className="text-gray-600 text-[15px] font-medium leading-relaxed">
                SWI reports are produced by Trinity Engineering as part of the forensic process. The weather analysis and engineering findings arrive together from the same source.
              </p>
            </div>
          </div>

          {/* Right: NOAA Station */}
          <div className="w-full min-w-0 max-lg:col-span-full self-start lg:col-span-1 lg:flex lg:items-center lg:justify-center">
            <img
              src="/noaa-station.png"
              alt="NOAA Weather Station"
              className="block w-full h-auto max-lg:object-contain max-lg:object-center lg:max-h-[32rem] lg:w-auto lg:border lg:border-white/50 lg:object-contain lg:shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
