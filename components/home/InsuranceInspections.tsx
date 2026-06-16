"use client";

import SectionDivider from "./SectionDivider";
import {
  HOME_CONTENT_CLASS,
  HOME_IMAGE_BLEED_LEFT,
  HOME_SECTION_CLASS,
  HOME_STACKED_IMAGE_CLASS,
  HOME_STICKY_IMAGE_CLASS,
  HOME_TEXT_WIDTH,
  SITE_SECTION_HEADING_CLASS,
} from "./HomeContent";

export default function InsuranceInspections() {
  const points = [
    {
      title: "INDUSTRY-LEADING EXPERIENCE",
      desc: "We have set the standard for forensic inspection and documentation of wind, hail, flood, tornado, hurricane, and structural losses. Now, our team offers nearly all inspections services, including mechanical, electrical, components, and small fire."
    },
    {
      title: "HIGHEST LEVEL ACCURACY DIRECT INSPECTIONS",
      desc: "Our engineers directly inspect all components of every inspection without third-party assistance."
    },
    {
      title: "INDUSTRY-LEADING TURNAROUND",
      desc: "Our systems enable each engineer to perform more inspections, with a faster turn-around, without ever compromising on accuracy or customer service."
    },
    {
      title: "MULTI-DISCIPLINE EXPERTISE",
      desc: "Not only do our engineers come from diverse backgrounds, we cross-train to ensure we have a full understanding of all engineering aspects for every loss. When additional experts are needed for a particular aspect of an evaluation, our team has the resources to provide whatever is needed."
    },
    {
      title: "TOTAL TRANSPARENCY UP FRONT",
      desc: "We are committed to 100% transparency. While we cannot disclose findings to a non-client prior to our initial report, we will gladly discuss the engineering principles behind every evaluation. Nothing is hidden."
    },
    {
      title: "NATURAL AND MANIPULATED DAMAGES EXPERTS",
      desc: "Unfortunately, some losses are caused intentionally. Our engineers have been called on for the last 12 years not only to determine when damages cannot be caused naturally, but also to provide the most advanced training for claims adjusters and attorneys throughout the industry to differentiate intentional damages."
    }
  ];

  return (
    <section className={`${HOME_SECTION_CLASS} max-lg:py-6 py-10 md:py-12 bg-[#F8FAFC]`}>
      {/* Background patterns contained separately to allow sticky logic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#001F3F 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <div className={`${HOME_CONTENT_CLASS} pt-2 relative z-10`}>
        <div className={HOME_TEXT_WIDTH}>
        <div className="w-full min-w-0 grid grid-cols-1 lg:grid-cols-[48%_minmax(0,1fr)] xl:grid-cols-[44%_minmax(0,1fr)] max-lg:gap-y-4 gap-6 md:gap-8 xl:gap-12 items-start">
          <div className="col-span-full text-center max-lg:mb-1 mb-8">
            <SectionDivider viaClass="via-[#001F3F]" />
            <div className="inline-block bg-[#001F3F] text-white text-[9px] md:text-[10px] font-bold px-4 md:px-5 py-1.5 mb-4 uppercase tracking-[0.3em] rounded-full shadow-sm">
              INSURANCE CLAIM INSPECTIONS
            </div>
            <h2 className={`mx-auto w-full break-words text-center text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}>
              <span className="block">Get Clear, Definitive Answers On Damage And Repairability For You And</span>
              <span className="block">Your Clients - Fast</span>
            </h2>
          </div>

          <div
            className={`w-full min-w-0 max-lg:col-span-full ${HOME_IMAGE_BLEED_LEFT} ${HOME_STICKY_IMAGE_CLASS}`}
          >
            <img
              src="/insurance-inspections.png"
              alt="Engineering Inspection"
              className={`${HOME_STACKED_IMAGE_CLASS} lg:min-h-[480px] lg:object-cover lg:object-left xl:min-h-[560px]`}
            />
          </div>

          <div className="max-lg:col-span-full max-lg:space-y-3 space-y-4 md:space-y-6 min-w-0 w-full">
            {points.map((point, index) => (
              <div
                key={index}
                className="group w-full max-lg:p-5 p-6 md:p-8 bg-white max-lg:shadow-sm hover:bg-white rounded-2xl border border-transparent hover:border-blue-100 hover:shadow-xl transition-all duration-500"
              >
                <div className="flex gap-6 w-full">
                  <div className="w-full min-w-0">
                    <h3 className="text-[#0047AB] font-black text-[13px] md:text-[14px] mb-3 uppercase tracking-[0.2em] leading-tight">
                      {point.title}
                    </h3>
                    <p className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                      {point.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
