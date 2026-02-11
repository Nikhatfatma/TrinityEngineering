"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    classification: "",
    phone: "",
    details: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const serviceOptions = [
    { value: "", label: "Select Investigation Type" },
    { value: "storm-damage", label: "Storm Damage Assessment" },
    { value: "water-loss", label: "Water Loss Investigation" },
    { value: "structural", label: "Structural Failure Analysis" },
    { value: "fortified", label: "Fortified Certification" },
    { value: "chimney", label: "Chimney Collapse Investigation" },
    { value: "large-loss", label: "Large Loss Assessment" },
    { value: "component", label: "Component Failure Analysis" },
    { value: "hvac", label: "HVAC/Electrical Systems" },
  ];

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-br dark:bg-background-dark overflow-hidden transition-colors duration-300" id="request">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/20 to-blue-400/10 dark:bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-cyan-400/10 to-primary/10 dark:bg-primary/5 rounded-full blur-[150px] animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-blue-500/10 dark:bg-primary/10 border border-primary/30 rounded-full px-6 py-3 mb-8 shadow-sm">
            <span className="material-symbols-outlined text-primary text-xl animate-pulse">
              bolt
            </span>
            <span className="text-sm font-bold text-primary uppercase tracking-[0.3em]">
              24-Hour Rapid Response
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-white bg-clip-text text-transparent mb-6 tracking-tight">
            Begin Your <span className="bg-gradient-to-r from-primary via-cyan-500 to-blue-500 dark:from-primary dark:to-primary bg-clip-text text-transparent">Investigation</span>
          </h2>
          <p className="text-gray-700 dark:text-gray-400 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Submit your case details and receive priority assignment to our elite forensic engineering team.
          </p>
        </div>

        {/* Split Screen Form Container */}
        <div className="grid lg:grid-cols-2 gap-0 max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden border-2 border-gray-200 dark:border-white/10 shadow-2xl hover:shadow-3xl transition-shadow bg-white dark:bg-section-dark">
          {/* Left Side - Visual Content */}
          <div className="relative hidden lg:block overflow-hidden bg-gray-900 dark:bg-background-dark">
            <img
              src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80"
              alt="Forensic Engineering Investigation"
              className="absolute inset-0 w-full h-full object-cover opacity-50 dark:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-primary/30 dark:from-background-dark dark:via-background-dark/90 dark:to-primary/20"></div>
            
            <div className="relative z-10 p-12 h-full flex flex-col justify-between">
              {/* Top Content */}
              <div>
                <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 mb-8">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-white font-bold text-sm">Live Support Available</span>
                </div>

                <h3 className="text-4xl font-extrabold text-white mb-6 leading-tight">
                  Elite Engineering <br />
                  <span className="text-primary">Expertise</span>
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-10">
                  Join hundreds of satisfied clients who trust Trinity Engineering for accurate, defensible forensic analysis.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <div className="text-4xl font-black text-primary mb-2">98%</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                      Success Rate
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <div className="text-4xl font-black text-primary mb-2">24h</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                      Response Time
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-xl">verified</span>
                  </div>
                  <span className="text-sm font-semibold">Licensed PE Engineers</span>
                </div>
                <div className="flex items-center gap-4 text-white">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-xl">shield_check</span>
                  </div>
                  <span className="text-sm font-semibold">Litigation Support Ready</span>
                </div>
                <div className="flex items-center gap-4 text-white">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-xl">public</span>
                  </div>
                  <span className="text-sm font-semibold">Nationwide Coverage</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-12 bg-white dark:bg-section-dark">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.2em]">
                  <span className="material-symbols-outlined text-sm">person</span>
                  Principal Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-300 dark:border-white/10 rounded-xl px-6 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600 hover:border-gray-400 dark:hover:border-white/20"
                  placeholder="Enter your full legal name"
                  type="text"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.2em]">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  Email Address
                </label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-300 dark:border-white/10 rounded-xl px-6 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600 hover:border-gray-400 dark:hover:border-white/20"
                  placeholder="name@organization.com"
                  type="email"
                  required
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.2em]">
                  <span className="material-symbols-outlined text-sm">phone</span>
                  Priority Contact
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-300 dark:border-white/10 rounded-xl px-6 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600 hover:border-gray-400 dark:hover:border-white/20"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  required
                />
              </div>

              {/* Investigation Type */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.2em]">
                  <span className="material-symbols-outlined text-sm">category</span>
                  Investigation Type
                </label>
                <div className="relative">
                  <select
                    name="classification"
                    value={formData.classification}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-300 dark:border-white/10 rounded-xl px-6 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none hover:border-gray-400 dark:hover:border-white/20 cursor-pointer"
                    required
                  >
                    {serviceOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-background-dark">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="material-icons absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Case Details */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.2em]">
                  <span className="material-symbols-outlined text-sm">description</span>
                  Case Details
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-300 dark:border-white/10 rounded-xl px-6 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600 hover:border-gray-400 dark:hover:border-white/20 resize-none"
                  placeholder="Provide a detailed description of the failure event, damage observed, and any relevant background information..."
                  rows={5}
                  required
                ></textarea>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">info</span>
                  Include location, date of incident, and preliminary observations
                </p>
              </div>

              {/* File Upload Placeholder */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                  <span className="material-symbols-outlined text-sm">attach_file</span>
                  Attachments (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl p-8 text-center hover:border-primary/30 transition-all cursor-pointer group bg-gray-50 dark:bg-transparent">
                  <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-600 group-hover:text-primary transition-colors mb-2 block">
                    cloud_upload
                  </span>
                  <p className="text-gray-600 dark:text-gray-500 text-sm mb-1">
                    Drag & drop files or <span className="text-primary font-semibold">browse</span>
                  </p>
                  <p className="text-gray-500 dark:text-gray-600 text-xs">Photos, documents, or reports (Max 10MB)</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary via-cyan-400 to-blue-500 hover:from-blue-500 hover:via-cyan-400 hover:to-primary dark:from-primary dark:to-primary-dark dark:hover:from-primary-dark dark:hover:to-primary text-white dark:text-background-dark font-black py-5 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-primary/40 transition-all text-lg tracking-widest group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  SUBMIT INVESTIGATION REQUEST
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-center gap-8 text-gray-600 dark:text-gray-500 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">lock</span>
                    <span>Secure & Confidential</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                    <span>24h Response</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Trust Bar */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-500 text-sm mb-6">Trusted by leading insurance carriers and law firms nationwide</p>
          <div className="flex justify-center items-center gap-8 flex-wrap opacity-30 grayscale">
            <div className="w-20 h-8 bg-white/10 rounded"></div>
            <div className="w-20 h-8 bg-white/10 rounded"></div>
            <div className="w-20 h-8 bg-white/10 rounded"></div>
            <div className="w-20 h-8 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
