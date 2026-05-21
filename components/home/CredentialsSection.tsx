"use client";

import SectionDivider from "./SectionDivider";
import { HOME_CONTENT_CLASS, HOME_SECTION_CLASS, HOME_SECTION_HEADING } from "./HomeContent";

export default function CredentialsSection() {
  return (
    <section className={`${HOME_SECTION_CLASS} py-10 bg-gradient-to-b from-[#F8F9FA] to-white border-t border-gray-100 overflow-hidden`}>
      <div className={`${HOME_CONTENT_CLASS} relative z-10`}>
        <div className="text-center mb-8 px-2 sm:px-4">
          <SectionDivider viaClass="via-[#1A1A1A]" />
          <h2
            className={`mx-auto w-full text-[#1A1A1A] text-center tracking-tight leading-[1.2] lg:font-semibold ${HOME_SECTION_HEADING}`}
            style={{ fontSize: "clamp(0.8125rem, 2.19vw, 2.625rem)" }}
          >
            <span className="block">Professional Certifications & Memberships</span>
          </h2>
        </div>

        <div className="w-full min-w-0 flex flex-row justify-center items-stretch gap-3 sm:items-center sm:gap-10 md:gap-16">
          {/* NSPE Container */}
          <div className="group relative flex-1 min-h-[7rem] min-w-0 aspect-[16/9] flex items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,71,171,0.08)] sm:min-h-0 sm:p-0 sm:mx-0 sm:max-w-[380px] sm:flex-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0047AB]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src="/logo-nspe.png" 
              alt="NSPE - National Society of Professional Engineers" 
              className="w-full h-full object-contain scale-[1.8] relative z-10 group-hover:scale-[1.85] transition-transform duration-700"
            />
          </div>

          {/* FORTIFIED Container */}
          <div className="group relative flex-1 min-h-[7rem] min-w-0 aspect-[16/9] flex items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,168,89,0.08)] sm:min-h-0 sm:p-0 sm:mx-0 sm:max-w-[380px] sm:flex-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00A859]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src="/logo-fortified-cert.png" 
              alt="FORTIFIED ROOF Certified" 
              className="w-full h-full object-contain scale-[0.55] relative z-10 group-hover:scale-[0.58] transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
