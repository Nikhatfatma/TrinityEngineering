"use client";

import { useState } from "react";

export default function Navbar() {
  const [isEducationOpen, setIsEducationOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.4)]">
            <span className="text-background-dark font-extrabold text-xl italic">T</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            TRINITY<span className="text-primary">ENGINEERING</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <a
            className="text-sm font-semibold text-gray-300 hover:text-primary transition-colors"
            href="#services"
          >
            Our Services
          </a>
          <a
            className="text-sm font-semibold text-gray-300 hover:text-primary transition-colors"
            href="#"
          >
            Fortified
          </a>
          <div 
            className="relative group"
            onMouseEnter={() => setIsEducationOpen(true)}
            onMouseLeave={() => setIsEducationOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-semibold text-gray-300 hover:text-primary transition-colors focus:outline-none">
              Education
              <span className="material-icons text-sm">expand_more</span>
            </button>
            <div
              className={`absolute top-full left-0 mt-2 w-48 bg-section-dark shadow-2xl rounded-lg border border-white/5 transition-all duration-200 ${
                isEducationOpen ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              <a
                className="block px-4 py-3 text-sm text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
                href="#blog"
              >
                Forensic Blog
              </a>
              <a
                className="block px-4 py-3 text-sm text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
                href="#"
              >
                Case Studies
              </a>
              <a
                className="block px-4 py-3 text-sm text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
                href="#"
              >
                White Papers
              </a>
            </div>
          </div>
          <a
            className="text-sm font-semibold text-gray-300 hover:text-primary transition-colors"
            href="#about"
          >
            About Us
          </a>
          <a
            className="text-sm font-semibold text-gray-300 hover:text-primary transition-colors"
            href="#careers"
          >
            Careers
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a
            className="text-sm font-semibold text-gray-500 hover:text-primary transition-colors px-4"
            href="#"
          >
            Client Login
          </a>
          <a
            className="bg-primary hover:bg-primary-dark text-background-dark px-6 py-2.5 rounded font-bold text-sm transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)]"
            href="#request"
          >
            Submit Request
          </a>
        </div>
      </div>
    </nav>
  );
}
