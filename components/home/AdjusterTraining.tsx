"use client";

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
    <section className="py-8 md:py-12 px-6 bg-[#F4F7FA] relative">
      {/* Background patterns contained separately to allow sticky logic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0047AB 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      </div>
      
      <div className="w-full max-w-[1920px] mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-10 px-2 sm:px-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-[60px] md:w-[200px] h-[3px] bg-gradient-to-r from-transparent to-[#0047AB] rounded-l-full"></div>
            <div className="w-2.5 h-2.5 rotate-45 bg-[#0047AB]"></div>
            <div className="w-[60px] md:w-[200px] h-[3px] bg-gradient-to-l from-transparent to-[#0047AB] rounded-r-full"></div>
          </div>
          <div className="inline-block bg-[#0047AB] text-white text-[9px] md:text-[10px] font-bold px-4 md:px-5 py-1.5 mb-4 uppercase tracking-[0.3em] rounded-full shadow-sm">
            ADJUSTER TEAM TRAININGS
          </div>
          <h2
            className="mx-auto w-full font-semibold text-[#1A1A1A] text-center tracking-tight leading-[1.2]"
            style={{ fontSize: "clamp(0.8125rem, 2.19vw, 2.625rem)" }}
          >
            <span className="block sm:whitespace-nowrap">Get Your Adjusters The Training They Need</span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-40">
            <div className="group relative">
              <div className="absolute -inset-4 bg-blue-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <img 
                src="/training-main.png" 
                alt="Adjuster Training Session" 
                className="w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50 relative z-10"
              />
              <div className="absolute inset-0 bg-blue-900/5 rounded-2xl z-20 pointer-events-none group-hover:opacity-0 transition-opacity duration-500"></div>
            </div>
          </div>
          
          <div className="lg:col-span-7 space-y-4 md:space-y-6">
            {points.map((point, index) => (
              <div key={index} className="group bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500 hover:md:-translate-x-2">
                <div className="flex items-start gap-5">
                  <div>
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
    </section>
  );
}
