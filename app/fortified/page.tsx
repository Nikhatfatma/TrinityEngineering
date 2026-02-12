"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function FortifiedPage() {
  const benefits = [
    {
      icon: "shield",
      title: "Storm Protection",
      description: "Enhanced resistance to high winds, hail, and severe weather events",
    },
    {
      icon: "savings",
      title: "Insurance Discounts",
      description: "Qualify for significant insurance premium reductions (up to 55%)",
    },
    {
      icon: "trending_up",
      title: "Property Value",
      description: "Increase home value and marketability with certification",
    },
    {
      icon: "verified",
      title: "Third-Party Verification",
      description: "Independent certification from qualified engineers",
    },
  ];

  const designationLevels = [
    {
      level: "FORTIFIED Roof™",
      icon: "roofing",
      description: "Sealed roof deck with enhanced roof covering and attachment",
      features: ["Sealed roof deck", "Ring-shank nails", "Starter strip protection", "Drip edge installation"],
      color: "from-blue-500 to-blue-600",
    },
    {
      level: "FORTIFIED Silver™",
      icon: "home_repair_service",
      description: "Roof designation plus protection for openings and attachments",
      features: ["All Roof features", "Opening protection", "Garage door bracing", "Gable end bracing"],
      color: "from-gray-400 to-gray-500",
    },
    {
      level: "FORTIFIED Gold™",
      icon: "workspace_premium",
      description: "Complete home protection with foundation to roof envelope",
      features: ["All Silver features", "Foundation protection", "Complete envelope", "Maximum resilience"],
      color: "from-yellow-500 to-yellow-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-primary-dark to-navy dark:from-background-dark dark:via-section-dark dark:to-background-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full mb-6 border border-white/20">
                <span className="material-symbols-outlined text-white text-base">shield</span>
                <span className="text-white font-bold text-sm uppercase tracking-wider">
                  IBHS Certified Program
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                FORTIFIED Home™ Certification
              </h1>
              <p className="text-xl text-gray-100 mb-8 leading-relaxed">
                Strengthen your home against severe weather with FORTIFIED Home™ - a voluntary construction and re-roofing program developed by the Insurance Institute for Business & Home Safety (IBHS).
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/submit-inspection"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl"
                >
                  <span className="material-symbols-outlined">send</span>
                  Schedule Evaluation
                </Link>
                <a
                  href="mailto:fortified@trinitypllc.com"
                  className="inline-flex items-center gap-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all"
                >
                  <span className="material-symbols-outlined">email</span>
                  Contact Expert
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&q=80"
                alt="FORTIFIED Roof"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-section-dark rounded-2xl p-6 shadow-2xl border-2 border-gray-200 dark:border-gray-800">
                <div className="text-4xl font-black text-primary dark:text-accent mb-2">55%</div>
                <div className="text-sm font-bold text-gray-600 dark:text-gray-400">Insurance Savings</div>
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
              Why Choose FORTIFIED?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              FORTIFIED Home™ provides measurable benefits that protect your investment and provide peace of mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white dark:bg-background-dark rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-accent transition-all hover:shadow-xl group"
              >
                <div className="w-16 h-16 bg-primary/10 dark:bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary dark:text-accent text-3xl">
                    {benefit.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Designation Levels */}
      <section className="py-24 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              FORTIFIED Designation Levels
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Choose the level of protection that&apos;s right for your home
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {designationLevels.map((level, index) => (
              <div
                key={index}
                className="relative bg-white dark:bg-section-dark rounded-3xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all group"
              >
                <div className={`h-2 bg-gradient-to-r ${level.color}`}></div>
                <div className="p-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${level.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <span className="material-symbols-outlined text-white text-4xl">
                      {level.icon}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                    {level.level}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {level.description}
                  </p>
                  <ul className="space-y-3">
                    {level.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
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
            Ready to FORTIFY Your Home?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Contact our certified FORTIFIED evaluators to start your certification process today
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/submit-inspection"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl"
            >
              <span className="material-symbols-outlined">send</span>
              Request Evaluation
            </Link>
            <a
              href="mailto:fortified@trinitypllc.com"
              className="inline-flex items-center gap-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white border-2 border-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
            >
              <span className="material-symbols-outlined">email</span>
              fortified@trinitypllc.com
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
