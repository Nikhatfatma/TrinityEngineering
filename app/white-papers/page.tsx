"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WhitePapersPage() {
  const papers = [
    {
      title: "Best Practices in Storm Damage Investigation",
      category: "Storm Damage",
      date: "2024",
      pages: "24 pages",
      description: "Comprehensive guide to identifying wind vs. water damage in hurricane-affected properties",
      topics: ["Wind damage patterns", "Water intrusion analysis", "Timeline correlation", "Evidence documentation"],
      icon: "cyclone",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Structural Failure Analysis Methodologies",
      category: "Structural Engineering",
      date: "2024",
      pages: "32 pages",
      description: "Engineering principles and forensic techniques for investigating structural failures",
      topics: ["Load analysis", "Material testing", "Foundation assessment", "Code compliance"],
      icon: "architecture",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "FORTIFIED Home™ Construction Standards",
      category: "FORTIFIED",
      date: "2023",
      pages: "18 pages",
      description: "Technical specifications and certification requirements for FORTIFIED designated homes",
      topics: ["Roof deck sealing", "Opening protection", "Installation standards", "Inspection protocols"],
      icon: "shield",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Water Loss Investigation Guide",
      category: "Water Damage",
      date: "2023",
      pages: "20 pages",
      description: "Systematic approach to determining source and timeline of water intrusion events",
      topics: ["Plumbing systems", "Moisture mapping", "Material analysis", "Timeline determination"],
      icon: "opacity",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      title: "Fire Origin & Cause Determination",
      category: "Fire Investigation",
      date: "2024",
      pages: "28 pages",
      description: "Scientific methods for identifying fire origin points and ignition sources",
      topics: ["Burn pattern analysis", "Electrical systems", "V-patterns", "Evidence preservation"],
      icon: "local_fire_department",
      color: "from-red-500 to-red-600",
    },
    {
      title: "Lightning Damage Assessment",
      category: "Electrical",
      date: "2023",
      pages: "16 pages",
      description: "Engineering analysis of direct and indirect lightning strike effects on structures",
      topics: ["Surge patterns", "Electrical damage", "System testing", "Damage correlation"],
      icon: "bolt",
      color: "from-yellow-500 to-yellow-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-primary-dark to-navy dark:from-background-dark dark:via-section-dark dark:to-background-dark">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full mb-6 border border-white/20">
            <span className="material-symbols-outlined text-white text-base">school</span>
            <span className="text-white font-bold text-sm uppercase tracking-wider">
              Technical Resources
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
            White Papers
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            In-depth technical publications on forensic engineering methodologies and best practices
          </p>
        </div>
      </section>

      {/* White Papers Grid */}
      <section className="py-24 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {papers.map((paper, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-section-dark rounded-3xl border-2 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-accent transition-all hover:shadow-2xl overflow-hidden"
              >
                <div className={`h-3 bg-gradient-to-r ${paper.color}`}></div>
                <div className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${paper.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-white text-3xl">
                      {paper.icon}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {paper.category}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{paper.date}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{paper.pages}</span>
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                    {paper.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {paper.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Key Topics:</p>
                    {paper.topics.map((topic, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary dark:text-accent text-sm">check</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{topic}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white px-6 py-3 rounded-xl font-bold text-sm transition-all">
                    <span className="material-symbols-outlined">download</span>
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark dark:from-accent dark:to-accent-light">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Need Expert Guidance?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Our PE engineers are available for consultations and expert testimony
          </p>
          <a
            href="mailto:claims@trinitypllc.com"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl"
          >
            <span className="material-symbols-outlined">email</span>
            Contact Our Experts
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
