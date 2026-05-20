"use client";

export default function LeadingIndustry() {
  const cards = [
    {
      title: "Leveraging Drone Technology",
      desc: "High-resolution aerial imaging and data capture provide safe, efficient access to difficult-to-reach structures and large-scale properties. Trinity Engineering utilizes FAA-certified drone operations to document storm damage, roof conditions, façade distress, and site-wide impacts with precision and repeatability.",
      image: "/industry-drone.png"
    },
    {
      title: "Infrared Thermography",
      desc: "Advanced infrared thermography helps identify hidden moisture intrusion, thermal anomalies, air leaks, and building envelope deficiencies without destructive testing. Our forensic approach combines thermal imaging with building science principles to support accurate diagnostics and defensible findings.",
      image: "/industry-infrared.png"
    },
    {
      title: "Research and Testing",
      desc: "Empirical testing and technical analysis support objective forensic evaluations and repairability assessments. Trinity Engineering leverages field data, material testing, and engineering-based methodologies to investigate failure mechanisms, storm impacts, and long-term performance concerns.",
      image: "/industry-testing.png"
    }
  ];

  return (
    <section className="py-10 px-6 bg-[#FAFCFF]">
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="text-center mb-8 px-2 sm:px-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-[100px] md:w-[250px] h-[3px] bg-gradient-to-r from-transparent to-[#0047AB] rounded-l-full"></div>
            <div className="w-2.5 h-2.5 rotate-45 bg-[#0047AB]"></div>
            <div className="w-[100px] md:w-[250px] h-[3px] bg-gradient-to-l from-transparent to-[#0047AB] rounded-r-full"></div>
          </div>
          <h2
            className="mx-auto w-full font-semibold text-[#1A1A1A] text-center tracking-tight leading-[1.2]"
            style={{ fontSize: "clamp(0.8125rem, 2.19vw, 2.625rem)" }}
          >
            <span className="block sm:whitespace-nowrap">Leading The Industry</span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 lg:gap-10">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,71,171,0.12)] hover:-translate-y-2 transition-all duration-500 relative"
            >
              {/* Image & Badge Wrapper */}
              <div className="relative">
                {/* Image Section (with overflow hidden for hover scale) */}
                <div className="relative overflow-hidden rounded-t-xl bg-gray-50">
                  {/* Subtle dark overlay that fades on hover */}
                  <div className="absolute inset-0 bg-[#001D3D]/10 mix-blend-multiply group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-full h-auto block object-contain group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Floating Title Badge */}
                <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center translate-y-1/2 px-4 pointer-events-none">
                  <div className="bg-gradient-to-r from-[#001D3D] to-[#0047AB] text-white text-center py-3 px-6 rounded-md shadow-lg group-hover:shadow-blue-500/30 transition-all duration-500 w-full max-w-[90%]">
                    <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.15em]">
                      {card.title}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="flex-1 flex flex-col text-center px-6 md:px-8 pt-16 pb-10">
                <p className="text-[#555] text-[13px] md:text-[14px] leading-relaxed font-medium relative z-10">
                  {card.desc}
                </p>
                
                {/* Decorative Accent */}
                <div className="mt-auto pt-8">
                  <div className="w-12 h-1 bg-gray-200 mx-auto rounded-full group-hover:bg-[#0047AB] transition-colors duration-500"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
