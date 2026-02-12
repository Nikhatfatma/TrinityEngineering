"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CaseStudiesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const caseStudies = [
    {
      title: "Hurricane Wind Damage vs. Water Intrusion",
      category: "storm",
      image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&q=80",
      summary: "Determining primary cause of loss in coastal property damage",
      outcome: "$2.5M claim successfully resolved through scientific analysis",
      icon: "cyclone",
    },
    {
      title: "Foundation Settlement Investigation",
      category: "structural",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
      summary: "Multi-million dollar commercial building structural failure analysis",
      outcome: "Identified soil expansion as root cause, secured full coverage",
      icon: "architecture",
    },
    {
      title: "Plumbing Failure - Supply Line Break",
      category: "water",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
      summary: "Sudden water loss event in residential property investigation",
      outcome: "Manufacturing defect proven, $450K claim approved",
      icon: "opacity",
    },
    {
      title: "Fire Origin & Cause Determination",
      category: "fire",
      image: "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?w=800&q=80",
      summary: "Complex commercial fire investigation with multiple potential causes",
      outcome: "Electrical fault conclusively identified, litigation resolved",
      icon: "local_fire_department",
    },
    {
      title: "FORTIFIED Roof Certification",
      category: "fortified",
      image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&q=80",
      summary: "New construction FORTIFIED Gold certification process",
      outcome: "Homeowner achieved 45% insurance discount, enhanced protection",
      icon: "shield",
    },
    {
      title: "Lightning Strike Damage Assessment",
      category: "storm",
      image: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=800&q=80",
      summary: "Electrical system failure following severe thunderstorm",
      outcome: "$180K claim validated through surge pattern analysis",
      icon: "bolt",
    },
  ];

  const categories = [
    { value: "all", label: "All Cases" },
    { value: "storm", label: "Storm Damage" },
    { value: "structural", label: "Structural" },
    { value: "water", label: "Water Loss" },
    { value: "fire", label: "Fire" },
    { value: "fortified", label: "FORTIFIED" },
  ];

  const filtered = selectedCategory === "all" 
    ? caseStudies 
    : caseStudies.filter(c => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-primary-dark to-navy dark:from-background-dark dark:via-section-dark dark:to-background-dark">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full mb-6 border border-white/20">
            <span className="material-symbols-outlined text-white text-base">description</span>
            <span className="text-white font-bold text-sm uppercase tracking-wider">
              Real Investigations
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
            Case Studies
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Real-world forensic engineering investigations showcasing our expertise and successful outcomes
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-12 bg-gray-50 dark:bg-section-dark border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  selectedCategory === cat.value
                    ? "bg-primary dark:bg-accent text-white shadow-lg"
                    : "bg-white dark:bg-background-dark text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-24 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((study, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-section-dark rounded-3xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-accent transition-all hover:shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 dark:bg-black/60 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <span className="material-symbols-outlined text-primary dark:text-accent text-2xl">
                      {study.icon}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {study.summary}
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-green-500 text-xl flex-shrink-0">check_circle</span>
                      <p className="text-sm font-semibold text-green-700 dark:text-green-400">{study.outcome}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
