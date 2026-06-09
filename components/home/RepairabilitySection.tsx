"use client";

import {
  HOME_CONTENT_CLASS,
  HOME_SECTION_CLASS,
  HOME_SECTION_HEADING,
  HOME_STACKED_IMAGE_CLASS,
  HOME_TEXT_WIDTH,
  SITE_SECTION_HEADING_CLASS,
  SITE_TAB_SECTION_PY,
} from "./HomeContent";

export default function RepairabilitySection() {
  return (
    <section
      className={`${HOME_SECTION_CLASS} ${SITE_TAB_SECTION_PY} bg-gradient-to-br from-[#1E4ED8] to-[#2563EB] overflow-x-clip`}
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[100%] bg-white/10 blur-3xl rounded-full mix-blend-overlay"></div>
        <div className="absolute bottom-[10%] right-[30%] w-[40%] h-[80%] bg-cyan-400/20 blur-3xl rounded-full mix-blend-overlay"></div>
      </div>

      <div className={`${HOME_CONTENT_CLASS} relative z-10`}>
        <div
          className={`${HOME_TEXT_WIDTH} flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-10 md:gap-10 lg:gap-12 min-w-0`}
        >
          {/* Left Text Content */}
          <div className="w-full min-w-0 md:flex-[0.92] lg:flex-[0.88] xl:flex-[0.85] space-y-6 text-white text-left">
            <div className="flex flex-nowrap items-center gap-3 mb-2">
              <div className="h-[3px] w-16 shrink-0 rounded-full bg-gradient-to-r from-transparent via-white to-white opacity-80 sm:w-20 md:w-24 sm:h-[4px]" />
              <div className="shrink-0 whitespace-nowrap text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] opacity-90">
                HOT TOPICS
              </div>
            </div>

            <h2
              className={`text-white drop-shadow-md leading-[1.2] md:leading-[1.1] pb-4 ${HOME_SECTION_HEADING} ${SITE_SECTION_HEADING_CLASS}`}
            >
              Repairability
            </h2>

            <div className="space-y-4 md:space-y-6 text-[14px] md:text-[15px] leading-relaxed opacity-95 max-w-xl lg:max-w-none">
              <p className="font-light">
                In the insurance restoration industry, the biggest fight on asphalt shingle roofs is almost always the same question:{" "}
                <span className="font-bold">&ldquo;Is this roof repairable, or does it require full replacement?&rdquo;</span>
              </p>
              <p className="font-light">
                Contractors push for full replacement to avoid wasting resources on low margin jobs, while adjusters write for small localized repairs that rarely extend beyond the direct physical damage, excluding damages that may be caused while attempting a repair — this often becomes contentious, emotional, and subjective argument without a clear, neutral solution.
              </p>

              <div className="w-fit max-w-full bg-white/10 border-l-4 border-white px-4 py-4 sm:px-5 sm:py-5 rounded-r-xl shadow-xl backdrop-blur-md mt-6 md:mt-8 transform hover:md:translate-x-2 transition-transform duration-500">
                <p className="font-bold text-[15px] md:text-base lg:text-lg tracking-wide leading-snug">
                  <span className="block whitespace-nowrap max-sm:whitespace-normal">The Trinity Repairability Index</span>
                  <span className="block whitespace-nowrap max-sm:whitespace-normal">Method™ changes this completely.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Image — wider bleed right, shifted down, taller */}
          <div className="w-full min-w-0 md:flex-[1.08] lg:flex-[1.12] xl:flex-[1.15] flex items-start justify-center md:justify-end md:mt-10 lg:mt-14">
            <div
              className="max-md:relative max-md:left-1/2 max-md:w-[100dvw] max-md:max-w-none max-md:-translate-x-1/2 w-full md:w-[155%] lg:w-[172%] xl:w-[186%] 2xl:w-[198%] md:max-w-none md:translate-x-12 lg:translate-x-20 xl:translate-x-28 2xl:translate-x-36 rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 hover:md:scale-[1.02] transition-transform duration-700 hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] bg-[#9CB4D4]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#001D3D]/60 via-transparent to-transparent pointer-events-none z-10"></div>
              <img
                src="/repairability-main.png"
                alt="Trinity Repairability Index"
                className={`${HOME_STACKED_IMAGE_CLASS} md:h-auto md:object-contain relative z-0`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
