"use client";

import { useRef } from "react";

export default function Services() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const services = [
    {
      title: "Storm Damage",
      icon: "cyclone",
      description:
        "Expert evaluation of hurricane, wind, and hail impact on critical infrastructures.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDndLEphQFjS10Y5M0AgzaDi4oBYeLjOWH9EN4rZLc8rZ8gkVuczB_SChrw1jXDj8WICEz2cdfhR0HIK6GeJ4f1cGTRRKF55541KMV-m2cSZWPlsC3VHqDueGUR3vNMKxAJK2fLoqYGmYHFOM5vfCkFTbG3y85rqp-TxYDrDmi8UyYTMZJLQkeJN3XpHLfVLULA3MTZV8-b8dJpwpdR3LurDV7Ju47B8LJlIJUFW7jCJsx1ecIjXJQNw17sAG-qspTo9uL4z0uEocq7",
    },
    {
      title: "Water Loss",
      icon: "opacity",
      description:
        "High-precision source identification for complex plumbing and intrusion failures.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBQSOk4WRhDd7Zhd8F3A8pAvZ0MkQAdUKAKSWWLVMvGNzQeATWn5eYirG3gbCtlJVuJ2pKNhszteSVPVJKpjtr7Qzf1glcoK_iNkikcA1oCD-d-av83HtKa_0LtOJ_G3X7thbvUWxPoTDv-S4ZfznWUinajr758Gq6yMouK0PyR_Dxy-sTgK5qj3WTyijEpofGcy22kd5SD1IlFOzWNOoS_1HO9Q_wYcDj2z5xXqp6Gdggi9Nfo3NHeu36862sE2qApObCse-hiIowJ",
    },
    {
      title: "Structural",
      icon: "architecture",
      description:
        "Comprehensive structural analysis and foundation settlement diagnostics for complex failures.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAfyGfjCtL1uPhfEdnQGLJrJatZtnYibFKEUwrb2N5-hH9jl7nN7RygnqvIOENRMYawBre8sC4WcC5uzkhfZ0UoyJWaQ1_y6Pvx33e3k6QQDHUgjaSbhvP0JRAvA1XAc79JjW2jGliAlIg0Iav-BAEeC_ylWlwpLH24GogAHOlwfda7iykexjQ4K32GATRiekob-3BHR5z8vfhbo0QII3Ke7EXENp47Q-qYnL-ptAtqVr3EU1UNbseQhRmPa_abAWa7vCZHISwTDhUl",
    },
    {
      title: "Fortified",
      icon: "shield",
      description:
        "Advanced fortification assessments and resilience certification for enhanced structural protection.",
      image:
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
    },
    {
      title: "Chimney Collapse",
      icon: "report_problem",
      description:
        "Specialized investigation of masonry failures and chimney structural integrity analysis.",
      image:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    },
    {
      title: "Large Loss",
      icon: "domain_disabled",
      description:
        "Comprehensive forensic analysis for catastrophic property damage and multi-structure failures.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDkf418FwUNopsb3yD0_D0zU-metnvMbn0Gbsl7Kg1BJ3TZmyCRjSsLIz5H6piWOGrypB1KrOm2CSpYe86c4GwQ0Z3BfMaevZwuSgHv8PzRquqWCUIVVJqpTXvTWbQj_VHSCtc1F4CYzOL5T4RTkYHwqu5vW88RDzLsuKFJaIKaqDNYYd3tKgQ1la7SdnbNwBuSswxW7k5GI8s3p38uMWazjEHwdkaaqUkR-y-58OTUti41CviApw-4kLYCKeSszzja5tGH3EA83V2G",
    },
    {
      title: "Component Failure",
      icon: "construction",
      description:
        "Detailed evaluation of building component defects and material performance failures.",
      image:
        "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80",
    },
    {
      title: "HVAC/Electrical",
      icon: "electrical_services",
      description:
        "Technical forensic analysis of mechanical and electrical system failures and malfunctions.",
      image:
        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-gray-50 to-white dark:from-background-dark dark:to-background-dark overflow-hidden transition-colors duration-300" id="services">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent uppercase tracking-[0.4em] mb-6">
              Service Portfolio
            </h2>
            <h3 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-white bg-clip-text text-transparent leading-tight tracking-tight">
              Deep analysis of <br />
              structural failure.
            </h3>
          </div>
          <div className="max-w-md pb-2">
            <p className="text-gray-700 dark:text-gray-400 text-lg leading-relaxed border-l-4 border-primary/30 pl-8 font-medium">
              Our engineers use elite diagnostic tools and forensic methodologies
              to deliver definitive results in the most challenging environments.
            </p>
          </div>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-14 h-14 bg-white dark:bg-section-dark border-2 border-gray-200 dark:border-white/10 rounded-full items-center justify-center text-primary hover:bg-gradient-to-br hover:from-primary hover:to-cyan-400 hover:text-white dark:hover:bg-primary dark:hover:text-background-dark transition-all shadow-lg hover:shadow-xl hover:shadow-primary/30"
            aria-label="Scroll left"
          >
            <span className="material-icons">chevron_left</span>
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-14 h-14 bg-white dark:bg-section-dark border-2 border-gray-200 dark:border-white/10 rounded-full items-center justify-center text-primary hover:bg-gradient-to-br hover:from-primary hover:to-cyan-400 hover:text-white dark:hover:bg-primary dark:hover:text-background-dark transition-all shadow-lg hover:shadow-xl hover:shadow-primary/30"
            aria-label="Scroll right"
          >
            <span className="material-icons">chevron_right</span>
          </button>

          {/* Services Container */}
          <div className="relative">
            {/* Left Fade */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 via-gray-50 dark:from-background-dark dark:via-background-dark to-transparent z-[5] pointer-events-none hidden md:block"></div>
            {/* Right Fade */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 via-gray-50 dark:from-background-dark dark:via-background-dark to-transparent z-[5] pointer-events-none hidden md:block"></div>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-6 px-1 scrollbar-hide scroll-smooth snap-x snap-mandatory"
            >
              {services.map((service, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-2xl h-[500px] min-w-[320px] md:min-w-[380px] border-2 border-gray-200 dark:border-white/5 snap-center flex-shrink-0 hover:border-primary/50 dark:hover:border-primary/30 transition-all shadow-lg hover:shadow-2xl hover:shadow-primary/20"
                >
                  <img
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    src={service.image}
                  />
                  <div className="absolute inset-0 service-card-overlay flex flex-col justify-end p-8 transition-colors group-hover:bg-black/40">
                    <span className="material-symbols-outlined text-4xl text-primary mb-6 neon-icon">
                      {service.icon}
                    </span>
                    <h4 className="text-3xl font-bold mb-4 text-white">
                      {service.title}
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {service.description}
                    </p>
                    <a
                      className="text-primary font-bold text-xs flex items-center gap-2 group/link tracking-widest"
                      href="#"
                    >
                      EXPLORE SERVICE{" "}
                      <span className="material-icons text-sm group-hover/link:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-8 md:hidden">
          <p className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <span className="material-icons text-sm">swipe</span>
            Swipe to explore all services
          </p>
        </div>
      </div>
    </section>
  );
}
