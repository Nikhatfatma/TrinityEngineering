"use client";

import { useState } from "react";
import Link from "next/link";

export default function Services() {
  const [selectedService, setSelectedService] = useState<any>(null);

  const services = [
    {
      id: 1,
      slug: "structural",
      title: "Structural Analysis",
      icon: "architecture",
      description: "Foundation settlement, framing failures, and load-bearing analysis with PE-certified engineers",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
      stats: { cases: "2,500+", time: "48 hrs", rate: "99%" },
    },
    {
      id: 2,
      slug: "storm-damage",
      title: "Storm Damage",
      icon: "cyclone",
      description: "Hurricane, wind, hail, and severe weather damage assessment nationwide",
      image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&q=80",
      stats: { cases: "5,000+", time: "24 hrs", rate: "98%" },
    },
    {
      id: 3,
      slug: "fortified",
      title: "FORTIFIED Roof",
      icon: "roofing",
      description: "Official FORTIFIED certification and high-wind roof system evaluation",
      image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&q=80",
      stats: { cases: "1,200+", time: "72 hrs", rate: "100%" },
    },
    {
      id: 4,
      slug: "large-loss",
      title: "Large Loss",
      icon: "warning",
      description: "Complex multi-discipline investigations for catastrophic property failures",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
      stats: { cases: "850+", time: "96 hrs", rate: "97%" },
    },
    {
      id: 5,
      slug: "water-loss",
      title: "Water Loss",
      icon: "opacity",
      description: "Advanced plumbing failure and intrusion source identification analysis",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
      stats: { cases: "3,800+", time: "36 hrs", rate: "96%" },
    },
    {
      id: 6,
      slug: "lightning-damage",
      title: "Lightning Damage",
      icon: "bolt",
      description: "Direct and indirect lightning strike analysis and electrical surge evaluation",
      image: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=800&q=80",
      stats: { cases: "950+", time: "48 hrs", rate: "95%" },
    },
    {
      id: 7,
      slug: "vandalism-fraud",
      title: "Fraud Investigation",
      icon: "gavel",
      description: "Forensic analysis to distinguish intentional damage from accidental loss",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
      stats: { cases: "680+", time: "72 hrs", rate: "94%" },
    },
    {
      id: 8,
      slug: "chimney-collapse",
      title: "Chimney Collapse",
      icon: "home",
      description: "Masonry failure analysis and structural chimney investigation services",
      image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
      stats: { cases: "420+", time: "48 hrs", rate: "97%" },
    },
    {
      id: 9,
      slug: "component-failure",
      title: "Component Failure",
      icon: "build",
      description: "HVAC, appliance, and building system component failure analysis",
      image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80",
      stats: { cases: "2,100+", time: "60 hrs", rate: "96%" },
    },
    {
      id: 10,
      slug: "hvac-electrical",
      title: "HVAC/Electrical",
      icon: "electrical_services",
      description: "Mechanical and electrical system failure investigation services",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
      stats: { cases: "1,900+", time: "48 hrs", rate: "95%" },
    },
    {
      id: 11,
      slug: "small-fire",
      title: "Fire Investigation",
      icon: "local_fire_department",
      description: "Origin and cause determination for residential and commercial fires",
      image: "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?w=800&q=80",
      stats: { cases: "1,400+", time: "72 hrs", rate: "98%" },
    },
    {
      id: 12,
      slug: "plumbing-failure",
      title: "Plumbing Failure",
      icon: "plumbing",
      description: "Water heater failures, pipe breaks, and fixture malfunction analysis",
      image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80",
      stats: { cases: "3,200+", time: "36 hrs", rate: "97%" },
    },
  ];

  const row1 = [...services.slice(0, 4), ...services.slice(0, 4)];
  const row2 = [...services.slice(4, 8), ...services.slice(4, 8)];
  const row3 = [...services.slice(8, 12), ...services.slice(8, 12)];

  return (
    <section className="py-20 bg-gray-50 dark:bg-section-dark" id="services">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Forensic Engineering Services
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Comprehensive investigation services delivered by licensed PE engineers
          </p>
        </div>
      </div>

      <div className="space-y-6 relative">
        {/* Edge Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 dark:from-section-dark to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 dark:from-section-dark to-transparent z-10 pointer-events-none"></div>

        {/* Row 1 */}
        <div className="overflow-hidden">
          <div className="flex gap-4 animate-scroll-left">
            {row1.map((service, index) => (
              <div
                key={`row1-${service.id}-${index}`}
                onClick={() => setSelectedService(service)}
                className="flex-shrink-0 w-[350px] bg-white dark:bg-background-dark rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden cursor-pointer group hover:border-primary dark:hover:border-accent transition-all hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-primary dark:text-accent text-xl">
                      {service.icon}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-sm font-bold text-primary dark:text-accent">{service.stats.cases}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Cases</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-primary dark:text-accent">{service.stats.time}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-primary dark:text-accent">{service.stats.rate}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Success</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="overflow-hidden">
          <div className="flex gap-4 animate-scroll-right">
            {row2.map((service, index) => (
              <div
                key={`row2-${service.id}-${index}`}
                onClick={() => setSelectedService(service)}
                className="flex-shrink-0 w-[350px] bg-white dark:bg-background-dark rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden cursor-pointer group hover:border-primary dark:hover:border-accent transition-all hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-primary dark:text-accent text-xl">
                      {service.icon}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-sm font-bold text-primary dark:text-accent">{service.stats.cases}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Cases</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-primary dark:text-accent">{service.stats.time}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-primary dark:text-accent">{service.stats.rate}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Success</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 */}
        <div className="overflow-hidden">
          <div className="flex gap-4 animate-scroll-left-slow">
            {row3.map((service, index) => (
              <div
                key={`row3-${service.id}-${index}`}
                onClick={() => setSelectedService(service)}
                className="flex-shrink-0 w-[350px] bg-white dark:bg-background-dark rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden cursor-pointer group hover:border-primary dark:hover:border-accent transition-all hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-primary dark:text-accent text-xl">
                      {service.icon}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-sm font-bold text-primary dark:text-accent">{service.stats.cases}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Cases</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-primary dark:text-accent">{service.stats.time}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-primary dark:text-accent">{service.stats.rate}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">Success</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64">
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-900/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                <span className="material-icons text-gray-900 dark:text-white">close</span>
              </button>
              <div className="absolute bottom-6 left-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-primary dark:text-accent text-3xl">
                    {selectedService.icon}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white">
                  {selectedService.title}
                </h3>
              </div>
            </div>

            <div className="p-8">
              <p className="text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {selectedService.description}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-primary dark:text-accent mb-2">
                    {selectedService.stats.cases}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Completed Cases
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-primary dark:text-accent mb-2">
                    {selectedService.stats.time}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Avg Response
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-primary dark:text-accent mb-2">
                    {selectedService.stats.rate}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Success Rate
                  </div>
                </div>
              </div>

               <Link
                 href={`/services/${selectedService.slug}`}
                 className="w-full bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
               >
                 View Full Details & Request Service
                 <span className="material-icons text-lg">arrow_forward</span>
               </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scrollLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scrollLeft 50s linear infinite;
        }
        .animate-scroll-right {
          animation: scrollRight 50s linear infinite;
        }
        .animate-scroll-left-slow {
          animation: scrollLeft 60s linear infinite;
        }
        .animate-scroll-left:hover,
        .animate-scroll-right:hover,
        .animate-scroll-left-slow:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
