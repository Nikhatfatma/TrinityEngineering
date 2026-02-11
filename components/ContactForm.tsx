"use client";

import { FormEvent } from "react";

export default function ContactForm() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
  };

  return (
    <section className="py-32 bg-background-dark" id="request">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h2 className="text-sm font-bold text-primary uppercase tracking-[0.4em] mb-6">
            Investigation intake
          </h2>
          <h3 className="text-6xl font-extrabold text-white mb-8 tracking-tighter">
            Submit Your Case
          </h3>
          <p className="text-gray-400 text-xl font-light">
            Rapid-response activation within 24 hours of submission.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-section-dark p-12 md:p-20 rounded-[3rem] shadow-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]"></div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10"
          >
            <div className="space-y-4">
              <label className="text-xs font-bold text-primary uppercase tracking-[0.2em] ml-1">
                Principal Name
              </label>
              <input
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-700"
                placeholder="Full legal name"
                type="text"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-primary uppercase tracking-[0.2em] ml-1">
                Secure Email
              </label>
              <input
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-700"
                placeholder="name@organization.com"
                type="email"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-primary uppercase tracking-[0.2em] ml-1">
                Investigation Classification
              </label>
              <div className="relative">
                <select className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none">
                  <option className="bg-background-dark">
                    Storm Damage Assessment
                  </option>
                  <option className="bg-background-dark">
                    Water Loss Identification
                  </option>
                  <option className="bg-background-dark">
                    Structural Integrity Failure
                  </option>
                  <option className="bg-background-dark">
                    Forensic Fire Analysis
                  </option>
                  <option className="bg-background-dark">
                    Litigation Expert Service
                  </option>
                </select>
                <span className="material-icons absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  expand_more
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-primary uppercase tracking-[0.2em] ml-1">
                Priority Contact
              </label>
              <input
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-700"
                placeholder="+1 (000) 000-0000"
                type="tel"
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="text-xs font-bold text-primary uppercase tracking-[0.2em] ml-1">
                Case Specifications
              </label>
              <textarea
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-700"
                placeholder="Briefly outline the failure event and structure parameters..."
                rows={6}
              ></textarea>
            </div>

            <div className="md:col-span-2 pt-6">
              <button
                className="w-full bg-primary hover:bg-primary-dark text-background-dark font-black py-7 rounded-2xl shadow-[0_0_40px_rgba(0,242,255,0.3)] transition-all text-xl tracking-widest"
                type="submit"
              >
                INITIALIZE INVESTIGATION
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
