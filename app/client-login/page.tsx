"use client";

import { useState, FormEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
    // Handle login logic
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const features = [
    { icon: "description", title: "View Reports", description: "Access completed investigation reports" },
    { icon: "event", title: "Track Status", description: "Monitor case progress in real-time" },
    { icon: "chat", title: "Message Engineers", description: "Direct communication with your PE" },
    { icon: "attach_file", title: "Upload Documents", description: "Share additional evidence securely" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-background-dark dark:via-section-dark dark:to-background-dark flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Login Form */}
            <div className="bg-white dark:bg-section-dark rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-8 md:p-12 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 dark:bg-accent/10 rounded-2xl mb-6">
                  <span className="material-symbols-outlined text-primary dark:text-accent text-4xl">
                    lock_person
                  </span>
                </div>
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3">
                  Client Portal
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Access your investigation reports and case information
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary dark:text-accent text-sm">email</span>
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary dark:text-accent text-sm">key</span>
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      name="remember"
                      type="checkbox"
                      checked={formData.remember}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-700 text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Remember me
                    </span>
                  </label>
                  <a href="#" className="text-sm font-bold text-primary dark:text-accent hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">login</span>
                  Sign In
                </button>

                <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don&apos;t have access?{" "}
                    <a href="mailto:claims@trinitypllc.com" className="font-bold text-primary dark:text-accent hover:underline">
                      Contact Support
                    </a>
                  </p>
                </div>
              </form>
            </div>

            {/* Right: Features */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                  Secure Client Portal
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                  24/7 access to your investigation files, reports, and direct communication with licensed PE engineers.
                </p>
              </div>

              <div className="grid gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 bg-white dark:bg-section-dark rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-accent transition-all group"
                  >
                    <div className="w-14 h-14 bg-primary/10 dark:bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-primary dark:text-accent text-2xl">
                        {feature.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-primary to-primary-dark dark:from-accent dark:to-accent-light rounded-3xl p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <span className="material-symbols-outlined text-4xl">security</span>
                  <h3 className="text-2xl font-black">Bank-Level Security</h3>
                </div>
                <p className="text-white/90 leading-relaxed">
                  Your data is protected with 256-bit SSL encryption, multi-factor authentication, and secure cloud storage.
                </p>
              </div>

              <div className="bg-white dark:bg-section-dark rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Need Help?
                </h3>
                <div className="space-y-3">
                  <a href="tel:+18559295888" className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors">
                    <span className="material-symbols-outlined">phone</span>
                    <span className="font-semibold">(855) 929-5888</span>
                  </a>
                  <a href="mailto:claims@trinitypllc.com" className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors">
                    <span className="material-symbols-outlined">email</span>
                    <span className="font-semibold">claims@trinitypllc.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
