"use client";

import { useState } from "react";
import Link from "next/link";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Submit Request",
      description: "Complete our online inspection form with incident details, location, and supporting documentation. Our team reviews your submission immediately.",
      icon: "send",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80",
      color: "primary",
      details: ["Online form submission", "24/7 availability", "Instant confirmation"],
    },
    {
      number: "02",
      title: "Assignment & Scheduling",
      description: "Licensed PE engineer assigned within 24 hours. Site visit scheduled at your convenience with flexible timing options.",
      icon: "event",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80",
      color: "blue",
      details: ["PE engineer assignment", "Flexible scheduling", "Preparation checklist"],
    },
    {
      number: "03",
      title: "On-Site Investigation",
      description: "Comprehensive field inspection with advanced diagnostic tools, high-resolution photography, thermal imaging, and precise measurements.",
      icon: "search",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80",
      color: "accent",
      details: ["Advanced equipment", "Detailed documentation", "Evidence collection"],
    },
    {
      number: "04",
      title: "Laboratory Analysis",
      description: "Material testing, structural calculations, and forensic analysis in our state-of-the-art certified laboratory facilities.",
      icon: "science",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80",
      color: "purple",
      details: ["Material testing", "Structural analysis", "Certified lab"],
    },
    {
      number: "05",
      title: "Expert Report",
      description: "Detailed engineering report with findings, root cause analysis, professional opinions, and litigation-ready documentation.",
      icon: "description",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
      color: "green",
      details: ["Comprehensive findings", "Root cause analysis", "Court-ready format"],
    },
    {
      number: "06",
      title: "Litigation Support",
      description: "Expert testimony, deposition preparation, case strategy consultation, and ongoing support throughout the legal process.",
      icon: "gavel",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
      color: "orange",
      details: ["Expert testimony", "Deposition prep", "Case consultation"],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: any = {
      primary: {
        bg: "bg-primary/10 dark:bg-primary/20",
        text: "text-primary dark:text-accent",
        border: "border-primary dark:border-accent",
        gradient: "from-primary to-primary-dark",
      },
      blue: {
        bg: "bg-blue-500/10",
        text: "text-blue-500",
        border: "border-blue-500",
        gradient: "from-blue-500 to-blue-600",
      },
      accent: {
        bg: "bg-accent/10 dark:bg-accent/20",
        text: "text-accent",
        border: "border-accent",
        gradient: "from-accent to-accent-light",
      },
      purple: {
        bg: "bg-purple-500/10",
        text: "text-purple-500",
        border: "border-purple-500",
        gradient: "from-purple-500 to-purple-600",
      },
      green: {
        bg: "bg-green-500/10",
        text: "text-green-500",
        border: "border-green-500",
        gradient: "from-green-500 to-green-600",
      },
      orange: {
        bg: "bg-orange-500/10",
        text: "text-orange-500",
        border: "border-orange-500",
        gradient: "from-orange-500 to-orange-600",
      },
    };
    return colors[color] || colors.primary;
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-background-dark dark:via-section-dark dark:to-background-dark relative overflow-hidden" id="how-it-works">
      
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent px-5 py-3 rounded-full mb-6 border border-primary/20">
            <span className="material-symbols-outlined text-base">timeline</span>
            <span className="font-bold text-sm uppercase tracking-wider">
              Our Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
            How Investigations Work
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A systematic, scientific approach to forensic engineering from initial request to expert testimony
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary dark:from-accent dark:via-primary dark:to-accent transform -translate-x-1/2"></div>

          {/* Steps */}
          <div className="space-y-16">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              const colorClasses = getColorClasses(step.color);
              
              return (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => setActiveStep(index)}
                >
                  <div className={`grid lg:grid-cols-2 gap-8 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}>
                    
                    {/* Content Side */}
                    <div className={`${isEven ? 'lg:text-right lg:pr-16' : 'lg:pl-16 lg:col-start-2'}`}>
                      <div className="group">
                        {/* Number Badge */}
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${colorClasses.gradient} text-white font-black text-2xl mb-6 shadow-xl transform group-hover:scale-110 transition-all`}>
                          {step.number}
                        </div>

                        {/* Title */}
                        <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                          {step.title}
                        </h3>

                        {/* Description */}
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                          {step.description}
                        </p>

                        {/* Details List */}
                        <ul className={`space-y-3 ${isEven ? 'lg:flex lg:flex-col lg:items-end' : ''}`}>
                          {step.details.map((detail, i) => (
                            <li key={i} className={`flex items-center gap-3 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                              <div className={`w-2 h-2 rounded-full ${colorClasses.bg} ${colorClasses.border} border-2`}></div>
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {detail}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {/* Icon */}
                        <div className={`mt-6 ${isEven ? 'lg:flex lg:justify-end' : ''}`}>
                          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${colorClasses.bg} group-hover:scale-110 transition-transform`}>
                            <span className={`material-symbols-outlined text-3xl ${colorClasses.text}`}>
                              {step.icon}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image Side */}
                    <div className={`${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
                      <div className="relative group cursor-pointer">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 transform group-hover:scale-105 transition-all duration-500">
                          <img
                            src={step.image}
                            alt={step.title}
                            className="w-full h-80 object-cover"
                          />
                          {/* Overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                          
                          {/* Hover Content */}
                          <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="text-white">
                              <p className="text-sm font-bold mb-1">Step {step.number}</p>
                              <p className="text-xl font-black">{step.title}</p>
                            </div>
                          </div>
                        </div>

                        {/* Decorative Element */}
                        <div className={`absolute -z-10 -inset-4 bg-gradient-to-br ${colorClasses.gradient} opacity-20 rounded-3xl blur-2xl group-hover:opacity-30 transition-opacity`}></div>
                      </div>
                    </div>
                  </div>

                  {/* Center Connector Dot */}
                  <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className={`w-6 h-6 rounded-full border-4 border-white dark:border-gray-900 bg-gradient-to-br ${colorClasses.gradient} shadow-lg ${activeStep === index ? 'scale-150' : ''} transition-transform`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-24 bg-gradient-to-r from-primary via-accent to-primary dark:from-accent dark:via-primary dark:to-accent rounded-3xl p-12 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">24hr</div>
              <div className="text-sm font-semibold opacity-90 uppercase tracking-wider">Initial Response</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">100%</div>
              <div className="text-sm font-semibold opacity-90 uppercase tracking-wider">PE Licensed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">10K+</div>
              <div className="text-sm font-semibold opacity-90 uppercase tracking-wider">Cases Completed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">98%</div>
              <div className="text-sm font-semibold opacity-90 uppercase tracking-wider">Client Satisfaction</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/submit-inspection"
            className="group inline-flex items-center gap-3 bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white px-10 py-6 rounded-2xl font-bold text-xl transition-all shadow-2xl hover:shadow-primary/50 hover:scale-105"
          >
            <span className="material-symbols-outlined text-2xl">send</span>
            Start Your Investigation
            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
              arrow_forward
            </span>
          </Link>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Or call us at <a href="tel:+18559295888" className="font-bold text-primary dark:text-accent hover:underline">(855) 929-5888</a>
          </p>
        </div>
      </div>
    </section>
  );
}
