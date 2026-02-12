"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    investigationType: "",
    details: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const investigationTypes = [
    { name: "Structural Failure", icon: "architecture", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80" },
    { name: "Storm Damage", icon: "cyclone", image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=400&q=80" },
    { name: "FORTIFIED Roof Evaluation", icon: "roofing", image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&q=80" },
    { name: "Large Loss", icon: "warning", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&q=80" },
    { name: "Water Loss", icon: "opacity", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80" },
    { name: "Lightning Damage", icon: "bolt", image: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=400&q=80" },
    { name: "Vandalism/Fraud", icon: "gavel", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80" },
    { name: "Chimney Collapse", icon: "home", image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80" },
    { name: "Component Failure", icon: "build", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80" },
    { name: "HVAC/Electrical", icon: "electrical_services", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80" },
    { name: "Small Fire", icon: "local_fire_department", image: "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?w=400&q=80" },
    { name: "Plumbing Failure", icon: "plumbing", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&q=80" },
  ];

  const selectedType = investigationTypes.find(type => type.name === formData.investigationType);

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-background-dark dark:via-section-dark dark:to-background-dark relative overflow-hidden" id="contact">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent px-5 py-3 rounded-full mb-6 border border-primary/20">
            <span className="material-symbols-outlined text-base">send</span>
            <span className="font-bold text-sm uppercase tracking-wider">
              Request Investigation
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            Submit Service Request
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Get started with a forensic engineering investigation. Our licensed PE engineers will respond within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          
          {/* LEFT: Form Section (3 columns) */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-section-dark rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-8 md:p-10 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Contact Information */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary dark:text-accent text-xl">
                        person
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Contact Information
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary dark:text-accent text-sm">badge</span>
                        Full Name *
                      </label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                        placeholder="John Smith"
                        type="text"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary dark:text-accent text-sm">business</span>
                        Company/Organization
                      </label>
                      <input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                        placeholder="ABC Insurance Company"
                        type="text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary dark:text-accent text-sm">email</span>
                        Email Address *
                      </label>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                        placeholder="john@company.com"
                        type="email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary dark:text-accent text-sm">phone</span>
                        Phone Number *
                      </label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                        placeholder="+1 (555) 000-0000"
                        type="tel"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Investigation Details */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary dark:text-accent text-xl">
                        search
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Investigation Details
                    </h3>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary dark:text-accent text-sm">category</span>
                        Investigation Type *
                      </label>
                      <select
                        name="investigationType"
                        value={formData.investigationType}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all cursor-pointer"
                        required
                      >
                        <option value="">Select Investigation Type</option>
                        {investigationTypes.map((type) => (
                          <option key={type.name} value={type.name}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary dark:text-accent text-sm">description</span>
                        Case Description *
                      </label>
                      <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent resize-none transition-all"
                        placeholder="Please provide details about the incident, damage, or failure requiring investigation..."
                        rows={6}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="group w-full bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white px-8 py-5 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-3"
                  >
                    <span className="material-symbols-outlined text-2xl">send</span>
                    Submit Investigation Request
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: Visual Section (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Selected Investigation Type Card */}
            {selectedType && (
              <div className="bg-white dark:bg-section-dark rounded-3xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden shadow-2xl">
                <div className="relative h-48">
                  <img
                    src={selectedType.image}
                    alt={selectedType.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl">
                          {selectedType.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-white/80 font-semibold">Selected Service</p>
                        <h4 className="text-lg font-black text-white">{selectedType.name}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Why Choose Us Card */}
            <div className="bg-white dark:bg-section-dark rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-8 shadow-2xl">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                Why Choose Trinity
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary dark:text-accent text-xl">
                      schedule
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">24-Hour Response</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Rapid deployment for time-sensitive investigations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 dark:bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-accent text-xl">
                      workspace_premium
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">100% PE Licensed</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All investigations by licensed Professional Engineers
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-green-500 text-xl">
                      verified
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Defensible Reports</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Court-ready documentation and expert testimony
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-blue-500 text-xl">
                      lock
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Secure & Confidential</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Protected communications and data handling
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-gradient-to-br from-primary to-primary-dark dark:from-accent dark:to-accent-light rounded-3xl p-8 shadow-2xl text-white">
              <h3 className="text-xl font-black mb-6">Need Immediate Assistance?</h3>
              <div className="space-y-4">
                <a href="tel:+18559295888" className="flex items-center gap-3 hover:translate-x-2 transition-transform">
                  <span className="material-symbols-outlined text-2xl">phone</span>
                  <div>
                    <p className="text-sm opacity-90">Call Us Now</p>
                    <p className="text-lg font-bold">(855) 929-5888</p>
                  </div>
                </a>
                <a href="mailto:claims@trinitypllc.com" className="flex items-center gap-3 hover:translate-x-2 transition-transform">
                  <span className="material-symbols-outlined text-2xl">email</span>
                  <div>
                    <p className="text-sm opacity-90">Email Us</p>
                    <p className="text-base font-bold break-all">claims@trinitypllc.com</p>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
