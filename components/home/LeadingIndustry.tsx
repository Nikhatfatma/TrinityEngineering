"use client";

import Link from "next/link";
import { HOME_CONTENT_CLASS, HOME_SECTION_CLASS, SITE_SECTION_HEADING_CLASS, HOME_TEXT_WIDTH } from "./HomeContent";

export default function LeadingIndustry() {
  const cards = [
    {
      title: "Leveraging Drone Technology",
      desc: "High-resolution aerial imaging and data capture provide safe, efficient access to difficult-to-reach structures and large-scale properties. Trinity Engineering utilizes FAA-certified drone operations to document storm damage, roof conditions, façade distress, and site-wide impacts with precision and repeatability.",
      image: "/industry-drone.png",
      href: "/industry/drone-technology",
    },
    {
      title: "Infrared Thermography",
      desc: "Advanced infrared thermography helps identify hidden moisture intrusion, thermal anomalies, air leakage pathways, and building envelope deficiencies without destructive testing. Our forensic approach combines thermal imaging with building science principles to support accurate diagnostics and defensible conclusions.",
      image: "/industry-infrared.png",
      href: "/industry/infrared-thermography",
    },
    {
      title: "Research and Testing",
      desc: "Empirical testing and technical analysis support objective forensic evaluations and repairability assessments. Trinity Engineering leverages field data, material testing, and engineering-based methodologies to investigate failure mechanisms, storm impacts, and long-term performance concerns.",
      image: "/industry-testing.png",
      href: "/industry/research-and-testing",
    }
  ];

  return (
    <section className={`${HOME_SECTION_CLASS} py-10 md:py-12 bg-[#F4F7FA]`}>
      <div className={HOME_CONTENT_CLASS}>
        <div className={HOME_TEXT_WIDTH}>
        <div className="text-center mb-8 md:mb-10">
          <h2 className={`mx-auto w-full break-words text-center text-[#1A1A1A] ${SITE_SECTION_HEADING_CLASS}`}>
            <span className="block">Leading The Industry</span>
          </h2>
        </div>

        <div className="w-full min-w-0 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3 lg:gap-10">
          {cards.map((card, index) => (
            <article
              key={index}
              className="flex flex-col bg-white overflow-hidden border border-gray-200/80"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-auto block object-cover"
              />

              <div className="flex flex-1 flex-col bg-white px-4 sm:px-5 md:px-6 pt-4 pb-5 md:pt-5 md:pb-6">
                <h3 className="mx-auto w-full max-w-full bg-[#E6F0FF] text-[#0056B3] text-center font-bold text-[13px] md:text-[15px] leading-snug py-2.5 md:py-3 px-3 md:px-4 rounded-none">
                  {card.title}
                </h3>
                <p className="mt-4 flex-1 text-[#333333] text-[13px] md:text-[14px] leading-relaxed font-normal text-left">
                  {card.desc}
                </p>
                <div className="mt-5 flex justify-center">
                  <Link
                    href={card.href}
                    className="group inline-flex items-center gap-1.5 rounded border border-[#0047AB] bg-white px-5 py-2 text-[12px] font-semibold text-[#0047AB] transition-colors duration-200 hover:bg-[#0047AB] hover:text-white active:bg-[#003580] active:border-[#003580]"
                  >
                    Learn More
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
