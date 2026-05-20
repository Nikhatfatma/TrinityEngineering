"use client";

export default function CredentialsSection() {
  return (
    <section className="py-10 px-6 bg-gradient-to-b from-[#F8F9FA] to-white border-t border-gray-100 overflow-hidden relative">
      <div className="w-full max-w-[1920px] mx-auto relative z-10">
        <div className="text-center mb-8 px-2 sm:px-4">
          {/* Diamond Divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-[80px] md:w-[200px] h-[3px] bg-gradient-to-r from-transparent to-[#1A1A1A] rounded-l-full"></div>
            <div className="w-2.5 h-2.5 rotate-45 bg-[#1A1A1A]"></div>
            <div className="w-[80px] md:w-[200px] h-[3px] bg-gradient-to-l from-transparent to-[#1A1A1A] rounded-r-full"></div>
          </div>
          <h2
            className="mx-auto w-full font-semibold text-[#1A1A1A] text-center tracking-tight leading-[1.2]"
            style={{ fontSize: "clamp(0.8125rem, 2.19vw, 2.625rem)" }}
          >
            <span className="block sm:whitespace-nowrap">Professional Certifications & Memberships</span>
          </h2>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-center items-center gap-10 md:gap-16">
          {/* NSPE Container */}
          <div className="group bg-white w-full max-w-[380px] aspect-[16/9] flex items-center justify-center p-0 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,71,171,0.08)] hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0047AB]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src="/logo-nspe.png" 
              alt="NSPE - National Society of Professional Engineers" 
              className="w-full h-full object-contain scale-[1.8] relative z-10 group-hover:scale-[1.85] transition-transform duration-700"
            />
          </div>

          {/* FORTIFIED Container */}
          <div className="group bg-white w-full max-w-[380px] aspect-[16/9] flex items-center justify-center p-0 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,168,89,0.08)] hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
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
