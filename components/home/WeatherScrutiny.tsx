"use client";

export default function WeatherScrutiny() {
  return (
    <section className="py-10 md:py-12 px-4 sm:px-6 bg-[#F8FAFC] relative overflow-hidden max-lg:overflow-x-clip">
      {/* Technical Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1a1a1a 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="w-full max-w-[1920px] mx-auto relative z-10 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex flex-col items-center w-full text-center gap-5 mb-8 md:mb-10">
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="w-[60px] md:w-[150px] h-[3px] bg-gradient-to-r from-transparent to-[#1a1a1a] rounded-l-full"></div>
            <div className="w-2.5 h-2.5 rotate-45 bg-[#1a1a1a]"></div>
            <div className="w-[60px] md:w-[150px] h-[3px] bg-gradient-to-l from-transparent to-[#1a1a1a] rounded-r-full"></div>
          </div>
          <div className="inline-block bg-[#1a1a1a] text-white text-[9px] md:text-[10px] font-bold px-4 md:px-5 py-1.5 uppercase tracking-[0.3em]">
            HISTORICAL WEATHER ANALYSIS
          </div>
          <h2
            className="font-serif font-normal text-[#1A1A1A] text-center tracking-tight leading-[1.2] max-lg:text-xl max-lg:px-2 lg:whitespace-nowrap"
            style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}
          >
            Weather Reporting Built To <span className="font-bold">Withstand Scrutiny.</span>
          </h2>
          <p
            className="mx-auto w-full max-w-7xl px-4 sm:px-6 text-gray-600 text-center tracking-normal font-medium leading-snug"
            style={{ fontSize: "clamp(0.75rem, 1.05vw, 0.875rem)" }}
          >
            <span className="block lg:whitespace-nowrap">
              Forensic-grade hail and severe weather analysis for insurance claims backed by named, reproducible government datasets and
            </span>
            <span className="block lg:whitespace-nowrap">a methodology transparent enough for any deposition.</span>
          </p>
        </div>

        {/* SWI Logo Section */}
        <div className="flex flex-col items-center mb-8 md:mb-10">
          <div className="w-[180px] md:w-[320px] relative group">
             <div className="absolute -inset-4 bg-blue-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <img 
               src="/swi-logo.png" 
               className="w-full h-auto object-contain relative z-10" 
               alt="Severe Weather Intelligence Logo"
             />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12 xl:gap-16 items-stretch">
          {/* Left: Weather Map */}
          <div className="lg:col-span-1">
             <div className="relative group rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50 bg-white h-auto aspect-[4/3] md:aspect-auto md:h-full">
               <img 
                 src="/weather-map.png" 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                 alt="Historical Weather Map"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
             </div>
          </div>

          {/* Middle: Content */}
          <div className="lg:col-span-1 space-y-8 md:space-y-10 py-4">
            <div className="group">
              <h3 className="text-[#0047AB] font-black text-[13px] mb-3 uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform duration-300">BUILT FOR THE DEPOSITION ROOM</h3>
              <p className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed font-medium">
                Every SWI report is built on named, publicly accessible government datasets with documented methodology. When opposing counsel asks how the number was derived, your expert has an answer.
              </p>
            </div>
            <div className="group">
              <h3 className="text-[#0047AB] font-black text-[13px] mb-3 uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform duration-300">5 INDEPENDENT DATA SOURCES</h3>
              <p className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed font-medium">
                Storm Events, NEXRAD radar, ASOS stations, IEM reports, and SPC Discussions are cross-referenced with PE-verified empirical data — no single point of failure.
              </p>
            </div>
            <div className="group">
              <h3 className="text-[#0047AB] font-black text-[13px] mb-3 uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform duration-300">EMPIRICAL DATA INTEGRATION</h3>
              <p className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed font-medium">
                SWI reports are produced by Trinity Engineering as part of the forensic process. The weather analysis and engineering findings arrive together from the same source.
              </p>
            </div>
          </div>

          {/* Right: NOAA Station */}
          <div className="lg:col-span-1">
             <div className="relative group rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50 bg-white h-auto aspect-[4/3] md:aspect-auto md:h-full">
               <img 
                 src="/noaa-station.png" 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                 alt="NOAA Weather Station"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
