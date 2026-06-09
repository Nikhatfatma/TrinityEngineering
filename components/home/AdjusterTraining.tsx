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

export default function AdjusterTraining() {
  const points = [
    {
      title: "DEVELOP YOUR TEAM'S EXPERTISE",
      desc: "We are available for regional meetings, Zoom webinars, or individual training sessions to advance your team's knowledge base around construction and property loss claims sources and investigations."
    },
    {
      title: "REPAIRABILITY",
      desc: "Social media videos abound of independent and field adjusters being confronted to determine whether asphalt shingles or other materials are \"repairable\" on site."
    },
    {
      title: "INTERPRETING INFRARED REPORTS",
      desc: "Experts, third-party inspections, and policyholder representatives often include IR photos in their reports to indicate \"wet\" walls and hidden damages. These photos can end up creating more questions than answers. We teach you to interpret these photos correctly, in context, and give you the right questions to ask, so you can get the answers you need."
    },
    {
      title: "PROPER USE OF DRONE TECHNOLOGY",
      desc: "Drones are an excellent tool, and AI technology allows for highlighting potential damages, but all too frequently, AI highlighted images noted as hail damage, are given to adjusters to say hail or wind damage has occurred without proper substantiation. On the claims inspections side, often drones are touted as the way to fully inspect without needing to physically access the roof and upper collateral items. Drone tech must be used properly, with added substantiation for the information to be relevant to adjust a loss."
    },
    {
      title: "INTENTIONAL MECHANICAL DAMAGES",
      desc: "US property insurance claims adjusting losses and expenses exceeds $600B annually. Any industry moving that much money will have some fraud involved. The most common instances in the roof claims sphere are intentionally damaging shingles to simulate wind or hail damages. Teach your adjusters to recognize the physical characteristics to red flag damages that cannot have occurred naturally."
    }
  ];

  return (
    <section className={`${HOME_SECTION_CLASS} py-8 md:py-12 bg-[#F4F7FA]`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0047AB 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      </div>

      <div className={`${HOME_CONTENT_CLASS} relative z-10`}>
        <div className={HOME_TEXT_WIDTH}>
        <div className="w-full min-w-0 grid grid-cols-1 lg:grid-cols-[48%_minmax(0,1fr)] xl:grid-cols-[44%_minmax(0,1fr)] max-lg:gap-y-4 gap-6 md:gap-8 xl:gap-12 items-start">
          <div className="col-span-full text-center max-lg:mb-1 mb-8 md:mb-10">
            <SectionDivider viaClass="via-[#0047AB]" />
            <div className="inline-block bg-[#0047AB] text-white text-[9px] md:text-[10px] font-bold px-4 md:px-5 py-1.5 mb-4 uppercase tracking-[0.3em] rounded-full shadow-sm">
              ADJUSTER TEAM TRAININGS
            </div>
            <h2 className={`mx-auto w-full break-words text-center text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}>
              <span className="block">Get Your Adjusters The Training They Need</span>
            </h2>
          </div>

          <div
            className={`w-full min-w-0 max-lg:col-span-full ${HOME_IMAGE_BLEED_LEFT} ${HOME_STICKY_IMAGE_CLASS}`}
          >
            <img
              src="/training-main.png"
              alt="Adjuster Training Session"
              className={`${HOME_STACKED_IMAGE_CLASS} lg:min-h-[480px] lg:object-cover lg:object-left xl:min-h-[560px]`}
            />
          </div>

          <div className="max-lg:col-span-full space-y-4 md:space-y-6 min-w-0 w-full">
              {points.map((point, index) => (
                <div
                  key={index}
                  className="group w-full bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500 hover:md:-translate-x-2"
                >
                  <div className="flex items-start gap-5 w-full">
                    <div className="w-full min-w-0">
                      <h3 className="text-[#0047AB] font-black text-[13px] md:text-[14px] mb-3 uppercase tracking-wider transition-colors">
                        {point.title}
                      </h3>
                      <p className="text-gray-500 text-[13px] md:text-[14px] leading-relaxed">
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
