"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceAssignmentForm from "@/components/ServiceAssignmentForm";

export default function SubmitAssignmentPage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-background-dark dark:from-background-dark dark:via-section-dark dark:to-background-dark py-20 pt-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 border-2 border-white/20">
            <span className="material-symbols-outlined text-white text-4xl">
              send
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Submit an Assignment
          </h1>
          <p className="text-xl text-gray-200 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
            Request a forensic engineering investigation with Trinity Engineering&apos;s licensed PE engineers
          </p>
          <p className="text-base text-gray-300 dark:text-gray-400 max-w-2xl mx-auto">
            Complete the form below and our team will respond within 24 hours to schedule your inspection
          </p>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-white dark:bg-section-dark border-b border-gray-200 dark:border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-primary dark:text-accent text-3xl">
                schedule
              </span>
              <div className="text-left">
                <div className="font-bold text-gray-900 dark:text-white">24 Hour Response</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Rapid team deployment</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-primary dark:text-accent text-3xl">
                verified
              </span>
              <div className="text-left">
                <div className="font-bold text-gray-900 dark:text-white">Licensed PE Engineers</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Professional expertise</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-primary dark:text-accent text-3xl">
                public
              </span>
              <div className="text-left">
                <div className="font-bold text-gray-900 dark:text-white">Nationwide Coverage</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">All 50 states served</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid - Investigation Type Selection */}
      <section className="py-20 bg-gray-50 dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Select Your Investigation Type
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Click on the service you need to open the assignment form in a new tab
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                name: "Structural Analysis", 
                slug: "structural",
                icon: "architecture",
                description: "Foundation settlement, framing failures, load-bearing analysis",
                cases: "2,500+"
              },
              { 
                name: "Storm Damage", 
                slug: "storm-damage",
                icon: "cyclone",
                description: "Hurricane, wind, hail damage assessment nationwide",
                cases: "5,000+"
              },
              { 
                name: "Water Loss", 
                slug: "water-loss",
                icon: "opacity",
                description: "Plumbing failure and intrusion source identification",
                cases: "3,800+"
              },
              { 
                name: "FORTIFIED Roof", 
                slug: "fortified",
                icon: "roofing",
                description: "Official FORTIFIED certification and evaluation",
                cases: "1,200+"
              },
              { 
                name: "Large Loss", 
                slug: "large-loss",
                icon: "warning",
                description: "Complex multi-discipline catastrophic investigations",
                cases: "850+"
              },
              { 
                name: "Lightning Damage", 
                slug: "lightning-damage",
                icon: "bolt",
                description: "Lightning strike analysis and electrical surge evaluation",
                cases: "950+"
              },
              { 
                name: "Fraud Investigation", 
                slug: "vandalism-fraud",
                icon: "gavel",
                description: "Forensic analysis of intentional vs accidental damage",
                cases: "680+"
              },
              { 
                name: "Chimney Collapse", 
                slug: "chimney-collapse",
                icon: "home",
                description: "Masonry failure and structural chimney investigation",
                cases: "420+"
              },
              { 
                name: "Component Failure", 
                slug: "component-failure",
                icon: "build",
                description: "HVAC, appliance, and building system analysis",
                cases: "2,100+"
              },
              { 
                name: "HVAC/Electrical", 
                slug: "hvac-electrical",
                icon: "electrical_services",
                description: "Mechanical and electrical system failure investigation",
                cases: "1,900+"
              },
              { 
                name: "Fire Investigation", 
                slug: "small-fire",
                icon: "local_fire_department",
                description: "Origin and cause determination for fires",
                cases: "1,400+"
              },
              { 
                name: "Plumbing Failure", 
                slug: "plumbing-failure",
                icon: "plumbing",
                description: "Water heater failures, pipe breaks, fixture malfunction",
                cases: "3,200+"
              },
            ].map((service) => (
              <a
                key={service.slug}
                href={`/services/${service.slug}#submit-assignment`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white dark:bg-section-dark rounded-xl p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-accent transition-all hover:shadow-xl cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary/10 dark:bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary dark:group-hover:bg-accent transition-all">
                    <span className="material-symbols-outlined text-primary dark:text-accent group-hover:text-white text-2xl transition-colors">
                      {service.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-accent transition-colors">
                        {service.name}
                      </h3>
                      <span className="material-symbols-outlined text-gray-400 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                        open_in_new
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      <span>{service.cases} cases completed</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Click to submit assignment
                  </span>
                  <span className="material-symbols-outlined text-primary dark:text-accent">
                    arrow_forward
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Or Continue with General Form */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="h-px w-24 bg-gray-300 dark:bg-gray-700"></div>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                Or
              </span>
              <div className="h-px w-24 bg-gray-300 dark:bg-gray-700"></div>
            </div>
            <button
              onClick={() => {
                const form = document.getElementById('assignment-form');
                if (form) form.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 bg-white dark:bg-section-dark hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-lg font-semibold text-base transition-all border-2 border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-accent"
            >
              <span className="material-symbols-outlined">edit_square</span>
              Continue with General Assignment Form
            </button>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="assignment-form" className="py-20 bg-white dark:bg-section-dark">
        <ServiceAssignmentForm serviceType="" />
      </section>

      {/* Why Choose Trinity */}
      <section className="py-20 bg-gray-50 dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Trinity Engineering
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Delivering actionable intelligence through forensic engineering investigations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "speed",
                title: "Rapid Response",
                description: "24-48 hour deployment for emergency and expedited assignments nationwide.",
              },
              {
                icon: "workspace_premium",
                title: "Licensed Experts",
                description: "All investigations performed by licensed Professional Engineers (PE).",
              },
              {
                icon: "description",
                title: "Defensible Reports",
                description: "Clear, concise, and evidence-based reports suitable for litigation.",
              },
              {
                icon: "gavel",
                title: "Expert Testimony",
                description: "Comprehensive litigation support and expert witness services available.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-section-dark rounded-xl p-6 border border-gray-200 dark:border-gray-800 text-center"
              >
                <div className="w-16 h-16 bg-primary/10 dark:bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary dark:text-accent text-3xl">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 bg-primary dark:bg-section-dark border-t border-primary-dark dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <span className="material-symbols-outlined text-white dark:text-accent text-4xl mb-3 block">
                phone
              </span>
              <h3 className="text-lg font-bold text-white mb-2">Call Us</h3>
              <p className="text-gray-200 dark:text-gray-400 mb-2">Speak with an expert</p>
              <a
                href="tel:+18559295888"
                className="text-xl font-bold text-white hover:text-gray-200 transition-colors"
              >
                (855) 929-5888
              </a>
            </div>
            <div>
              <span className="material-symbols-outlined text-white dark:text-accent text-4xl mb-3 block">
                email
              </span>
              <h3 className="text-lg font-bold text-white mb-2">Email Us</h3>
              <p className="text-gray-200 dark:text-gray-400 mb-2">Send your inquiry</p>
              <a
                href="mailto:claims@trinitypllc.com"
                className="text-xl font-bold text-white hover:text-gray-200 transition-colors break-all"
              >
                claims@trinitypllc.com
              </a>
            </div>
            <div>
              <span className="material-symbols-outlined text-white dark:text-accent text-4xl mb-3 block">
                schedule
              </span>
              <h3 className="text-lg font-bold text-white mb-2">Available 24/7</h3>
              <p className="text-gray-200 dark:text-gray-400 mb-2">Emergency response team</p>
              <p className="text-xl font-bold text-white">
                Always Ready
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
