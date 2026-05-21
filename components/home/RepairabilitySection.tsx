"use client";

import { HOME_CONTENT_CLASS, HOME_SECTION_CLASS, HOME_SECTION_HEADING } from "./HomeContent";

export default function RepairabilitySection() {
  return (
    <section className={`${HOME_SECTION_CLASS} bg-gradient-to-br from-[#1E4ED8] to-[#2563EB] overflow-hidden`}>
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[100%] bg-white/10 blur-3xl rounded-full mix-blend-overlay"></div>
        <div className="absolute bottom-[10%] right-[30%] w-[40%] h-[80%] bg-cyan-400/20 blur-3xl rounded-full mix-blend-overlay"></div>
      </div>

      <div className={`${HOME_CONTENT_CLASS} flex flex-col md:flex-row relative z-10`}>
      {/* Left Text Content */}
      <div className="w-full min-w-0 md:w-1/2 flex md:justify-end py-10 md:py-12">
        <div className="w-full max-w-[600px] lg:pr-12 space-y-6 text-white">
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-[72px] sm:w-[100px] md:w-[140px] h-[3px] bg-gradient-to-r from-transparent via-white to-white rounded-full opacity-80 shrink-0" />
            <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] opacity-90">
              HOT TOPICS
            </div>
          </div>

          <h2 className={`text-2xl md:text-4xl lg:text-5xl lg:font-black tracking-tight pb-4 drop-shadow-md leading-[1.2] md:leading-[1.1] ${HOME_SECTION_HEADING}`}>
            Repairability
          </h2>
          
          <div className="space-y-4 md:space-y-6 text-[14px] md:text-[15px] leading-relaxed opacity-95">
            <p className="font-light">
              In the insurance restoration industry, the biggest fight on asphalt shingle roofs is almost always the same question: <span className="font-bold">&ldquo;Is this roof repairable, or does it require full replacement?&rdquo;</span>
            </p>
            <p className="font-light">
              Contractors push for full replacement to avoid wasting resources on low margin jobs, while adjusters write for small localized repairs that rarely extend beyond the direct physical damage, excluding damages that may be caused while attempting a repair — this often becomes contentious, emotional, and subjective argument without a clear, neutral solution.
            </p>
            
            <div className="bg-white/10 border-l-4 border-white p-5 rounded-r-xl shadow-xl backdrop-blur-md mt-6 md:mt-8 transform hover:md:translate-x-2 transition-transform duration-500">
              <p className="font-bold text-base md:text-lg tracking-wide">
                The Trinity Repairability Index Method™ changes this completely.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Floating Image */}
      <div className="w-full min-w-0 md:w-1/2 relative flex items-center justify-center p-4 sm:p-6 md:p-0 md:pr-4 md:py-12 z-10">
        <div className="relative w-full max-w-[800px] max-lg:mx-auto md:translate-x-4 lg:translate-x-6 rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 hover:md:scale-[1.02] transition-transform duration-700 hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] bg-[#9CB4D4]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#001D3D]/60 via-transparent to-transparent pointer-events-none z-10"></div>
          <img 
            src="/repairability-main.png" 
            alt="Trinity Repairability Index" 
            className="w-full h-auto block relative z-0"
          />
        </div>
      </div>
      </div>
    </section>
  );
}
