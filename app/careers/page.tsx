"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function CareersPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const positions = [
    {
      title: "Senior Forensic Engineer",
      category: "engineering",
      location: "Remote / Hybrid",
      type: "Full-time",
      salary: "$90K - $130K",
      description: "Lead complex forensic investigations and provide expert testimony",
      requirements: ["PE License Required", "10+ years experience", "Expert testimony experience"],
      icon: "engineering",
    },
    {
      title: "Structural Engineer",
      category: "engineering",
      location: "Multiple Locations",
      type: "Full-time",
      salary: "$70K - $100K",
      description: "Conduct structural failure analysis and building assessments",
      requirements: ["PE License or EIT", "5+ years experience", "Strong analytical skills"],
      icon: "architecture",
    },
    {
      title: "Field Inspector",
      category: "operations",
      location: "Nationwide",
      type: "Full-time",
      salary: "$50K - $70K",
      description: "Perform on-site investigations and document evidence",
      requirements: ["Valid driver's license", "Willingness to travel", "Attention to detail"],
      icon: "search",
    },
    {
      title: "Client Services Coordinator",
      category: "administrative",
      location: "Remote",
      type: "Full-time",
      salary: "$45K - $60K",
      description: "Manage client communications and case coordination",
      requirements: ["Strong communication", "Organizational skills", "Customer service experience"],
      icon: "support_agent",
    },
    {
      title: "Technical Report Writer",
      category: "technical",
      location: "Remote",
      type: "Full-time / Contract",
      salary: "$55K - $75K",
      description: "Prepare detailed engineering reports and documentation",
      requirements: ["Technical writing experience", "Engineering background", "Attention to detail"],
      icon: "description",
    },
    {
      title: "Marketing Specialist",
      category: "administrative",
      location: "Remote / Hybrid",
      type: "Full-time",
      salary: "$50K - $70K",
      description: "Develop marketing strategies and manage digital presence",
      requirements: ["Marketing experience", "Digital marketing skills", "Creative mindset"],
      icon: "campaign",
    },
  ];

  const benefits = [
    { icon: "health_and_safety", title: "Health Insurance", description: "Comprehensive medical, dental, and vision" },
    { icon: "savings", title: "401(k) Matching", description: "Competitive retirement contribution matching" },
    { icon: "paid_time_off", title: "Paid Time Off", description: "Generous PTO and holiday schedule" },
    { icon: "school", title: "Continuing Education", description: "Professional development and training support" },
    { icon: "work_from_home", title: "Remote Work", description: "Flexible work arrangements available" },
    { icon: "card_giftcard", title: "Bonuses", description: "Performance-based incentive programs" },
  ];

  const categories = [
    { value: "all", label: "All Positions", icon: "work" },
    { value: "engineering", label: "Engineering", icon: "engineering" },
    { value: "operations", label: "Operations", icon: "build" },
    { value: "technical", label: "Technical", icon: "science" },
    { value: "administrative", label: "Administrative", icon: "business" },
  ];

  const filteredPositions = selectedCategory === "all"
    ? positions
    : positions.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-primary-dark to-navy dark:from-background-dark dark:via-section-dark dark:to-background-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full mb-6 border border-white/20">
              <span className="material-symbols-outlined text-white text-base">work</span>
              <span className="text-white font-bold text-sm uppercase tracking-wider">
                Join Our Team
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Build Your Career in Forensic Engineering
            </h1>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              Join a team of licensed PE engineers dedicated to uncovering the truth through science and investigation. We offer competitive compensation, professional growth, and meaningful work.
            </p>
            <div className="flex flex-wrap gap-8 text-white">
              <div>
                <div className="text-4xl font-black mb-2">50+</div>
                <div className="text-sm font-semibold opacity-90">Team Members</div>
              </div>
              <div>
                <div className="text-4xl font-black mb-2">10K+</div>
                <div className="text-sm font-semibold opacity-90">Cases Completed</div>
              </div>
              <div>
                <div className="text-4xl font-black mb-2">100%</div>
                <div className="text-sm font-semibold opacity-90">PE Licensed Engineers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50 dark:bg-section-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Benefits & Perks
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We take care of our team with competitive benefits and a supportive work environment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white dark:bg-background-dark rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-accent transition-all group"
              >
                <div className="w-16 h-16 bg-primary/10 dark:bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary dark:text-accent text-3xl">
                    {benefit.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Explore career opportunities across our organization
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  selectedCategory === category.value
                    ? "bg-primary dark:bg-accent text-white shadow-lg"
                    : "bg-gray-100 dark:bg-section-dark text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                <span className="material-symbols-outlined text-base">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="grid gap-6 max-w-5xl mx-auto">
            {filteredPositions.map((position, index) => (
              <div
                key={index}
                className="bg-white dark:bg-section-dark rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-accent transition-all hover:shadow-xl group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-primary/10 dark:bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-primary dark:text-accent text-2xl">
                          {position.icon}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                          {position.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {position.location}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            {position.type}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">payments</span>
                            {position.salary}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {position.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {position.requirements.map((req, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-gray-100 dark:bg-background-dark px-3 py-1 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300">
                          <span className="material-symbols-outlined text-xs text-primary dark:text-accent">check</span>
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="lg:flex-shrink-0">
                    <a
                      href="mailto:careers@trinitypllc.com?subject=Application: {position.title}"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl"
                    >
                      <span className="material-symbols-outlined">send</span>
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark dark:from-accent dark:to-accent-light">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Don&apos;t See a Perfect Fit?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            We&apos;re always looking for talented professionals. Send us your resume and we&apos;ll keep you in mind for future opportunities.
          </p>
          <a
            href="mailto:careers@trinitypllc.com"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl"
          >
            <span className="material-symbols-outlined">email</span>
            careers@trinitypllc.com
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
