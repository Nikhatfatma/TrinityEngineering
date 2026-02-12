"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      icon: "science",
      title: "Scientific Rigor",
      description: "Every investigation backed by proven engineering principles and methodologies",
    },
    {
      icon: "gavel",
      title: "Defensible Results",
      description: "Court-ready reports and expert testimony that withstand legal scrutiny",
    },
    {
      icon: "workspace_premium",
      title: "Professional Excellence",
      description: "100% PE-licensed engineers committed to the highest standards",
    },
    {
      icon: "speed",
      title: "Rapid Response",
      description: "24-hour deployment for time-sensitive investigations nationwide",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Cases Completed", icon: "fact_check" },
    { number: "50", label: "States Covered", icon: "public" },
    { number: "24hr", label: "Response Time", icon: "schedule" },
    { number: "98%", label: "Accuracy Rate", icon: "trending_up" },
  ];

  const timeline = [
    {
      year: "2015",
      title: "Company Founded",
      description: "Trinity Engineering PLLC established with a vision to provide scientific truth in property damage investigations",
    },
    {
      year: "2017",
      title: "Nationwide Expansion",
      description: "Expanded operations to cover all 50 states with licensed PE engineers in major markets",
    },
    {
      year: "2019",
      title: "FORTIFIED Certification",
      description: "Became authorized FORTIFIED Home™ evaluator through IBHS certification",
    },
    {
      year: "2021",
      title: "Advanced Laboratory",
      description: "Opened state-of-the-art materials testing and forensic analysis laboratory",
    },
    {
      year: "2024",
      title: "Industry Leadership",
      description: "Recognized as a leading forensic engineering firm with 10,000+ successful investigations",
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
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full mb-6 border border-white/20">
              <span className="material-symbols-outlined text-white text-base">info</span>
              <span className="text-white font-bold text-sm uppercase tracking-wider">
                About Trinity Engineering
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Engineering Detectives Using Science to Find Answers
            </h1>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              Since 2015, Trinity Engineering has been the trusted partner for insurance companies, legal professionals, and property owners seeking scientific truth in forensic engineering investigations.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-primary/10 dark:bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary dark:text-accent text-4xl">
                    {stat.icon}
                  </span>
                </div>
                <div className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gray-50 dark:bg-section-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                To deliver unbiased, scientifically sound forensic engineering investigations that serve justice, protect property owners, and support fair claim resolutions.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                We believe that every property damage claim deserves thorough investigation by qualified professionals. Our team of licensed PE engineers combines decades of experience with cutting-edge diagnostic technology to uncover the true cause of damage and provide defensible, litigation-ready reports.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
                alt="Mission"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Principles that guide every investigation and interaction
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-section-dark rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-accent transition-all hover:shadow-xl group text-center"
              >
                <div className="w-20 h-20 bg-primary/10 dark:bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary dark:text-accent text-4xl">
                    {value.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-gray-50 dark:bg-section-dark">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              A decade of growth, innovation, and excellence
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary -translate-x-1/2"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`relative grid md:grid-cols-2 gap-8 items-center ${
                  index % 2 === 0 ? '' : 'md:grid-flow-dense'
                }`}>
                  {/* Content */}
                  <div className={`${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12 md:col-start-2'}`}>
                    <div className="bg-white dark:bg-background-dark rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-800 shadow-xl">
                      <div className="text-4xl font-black text-primary dark:text-accent mb-3">{item.year}</div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 bg-primary dark:bg-accent rounded-full border-4 border-white dark:border-gray-900 shadow-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark dark:from-accent dark:to-accent-light">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Partner With the Best
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Experience the Trinity Engineering difference on your next forensic investigation
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/submit-inspection"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl"
            >
              <span className="material-symbols-outlined">send</span>
              Submit Request
            </Link>
            <a
              href="tel:+18559295888"
              className="inline-flex items-center gap-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white border-2 border-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
            >
              <span className="material-symbols-outlined">phone</span>
              (855) 929-5888
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
