"use client";

import { HOME_CONTENT_CLASS, HOME_SECTION_CLASS } from "./HomeContent";

export default function BioSection() {
  return (
    <section className={`${HOME_SECTION_CLASS} bg-[#0F172A] z-10`}>
      {/* Background patterns contained separately to allow image overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
      </div>
      
      <div className={`${HOME_CONTENT_CLASS} py-10 md:py-16 relative z-10`}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-10 md:gap-16 lg:gap-20 text-white relative min-w-0">
          
          {/* Profile Image */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-72 md:h-72 flex-shrink-0 relative m-0 z-20 group">
            {/* Enhanced glowing effect */}
            <div className="absolute inset-0 bg-[#2563EB] rounded-full blur-2xl md:blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
            <div className="absolute inset-0 border-2 border-white/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-700 pointer-events-none"></div>
            
            <img 
              src="/scott-bio.png" 
              alt="Scott Beaudry, PE" 
              className="w-full h-full object-cover rounded-full border-4 border-[#0F172A] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {/* Bio Text - Spanning to the right */}
          <div className="flex-1 min-w-0 text-sm sm:text-[15px] md:text-[18px] leading-relaxed opacity-95 relative text-center md:text-left">
            {/* Stylized Quote Icon */}
            <div className="text-4xl md:text-6xl text-blue-500/20 font-serif absolute -top-6 md:-top-10 left-1/2 md:left-[-24px] -translate-x-1/2 md:translate-x-0 pointer-events-none">&ldquo;</div>
            
            <p className="mb-8 md:mb-12 font-light text-gray-300 relative z-10 italic max-w-4xl mx-auto md:mx-0">
              Scott has inspected over 1000 residential and commercial roofs and performed advanced research into the materials, methods, and tools necessary for performing proper repairs. He is a certified trainer, a qualified national and founding researcher in the TRI Method™. Trinity&apos;s own standardized methodology for assessing repairability.
            </p>
            
            <div className="relative pl-0 md:pl-8 border-l-0 md:border-l-4 border-blue-500">
              <div className="font-black text-2xl md:text-3xl text-white tracking-tight group/name relative inline-block">
                Scott Beaudry, PE
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover/name:w-full transition-all duration-500"></div>
              </div>
              <div className="text-xs sm:text-[13px] md:text-[16px] uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] text-[#38BDF8] font-bold mt-3">
                Sr Forensic Engineer (GA, AL, SC Manager)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
