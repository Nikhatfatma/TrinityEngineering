"use client";

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
    <section className="py-10 md:py-12 px-4 sm:px-6 bg-[#F8FAFC] relative max-lg:overflow-x-clip">
      {/* Background patterns contained separately to allow sticky logic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#001F3F 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>
      </div>
      
      <div className="w-full max-w-[1920px] mx-auto pt-2 relative z-10">
        <div className="text-center mb-8 px-2 sm:px-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-[60px] md:w-[150px] h-[3px] bg-gradient-to-r from-transparent to-[#001F3F] rounded-l-full"></div>
            <div className="w-2.5 h-2.5 rotate-45 bg-[#001F3F]"></div>
            <div className="w-[60px] md:w-[150px] h-[3px] bg-gradient-to-l from-transparent to-[#001F3F] rounded-r-full"></div>
          </div>
          <div className="inline-block bg-[#001F3F] text-white text-[9px] md:text-[10px] font-bold px-4 md:px-5 py-1.5 mb-4 uppercase tracking-[0.3em] rounded-full shadow-sm">
            INSURANCE CLAIM INSPECTIONS
          </div>
          <h2
            className="mx-auto w-full font-semibold text-[#1A1A1A] text-center tracking-tight leading-[1.2]"
            style={{ fontSize: "clamp(0.8125rem, 2.19vw, 2.625rem)" }}
          >
            <span className="block sm:whitespace-nowrap">
              Get Clear, Definitive Answers On Damage And Repairability For You And
            </span>
            <span className="block sm:whitespace-nowrap">Your Clients - Fast</span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 xl:gap-20 items-start">
          {/* Sticky Image Column */}
          <div className="lg:sticky lg:top-32 order-2 lg:order-1 max-lg:w-full">
            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-500/10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative rounded-xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] border border-white/50">
                <img 
                  src="/insurance-inspections.png" 
                  alt="Engineering Inspection" 
                  className="w-full h-auto transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
          
          {/* Scrollable Points Column */}
          <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
            {points.map((point, index) => (
              <div key={index} className="group max-lg:p-5 p-6 md:p-8 bg-white max-lg:shadow-sm hover:bg-white rounded-2xl border border-transparent hover:border-blue-100 hover:shadow-xl transition-all duration-500">
                <div className="flex gap-6">
                  <div>
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
    </section>
  );
}
