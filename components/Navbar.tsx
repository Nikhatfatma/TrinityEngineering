"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

export default function Navbar() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const services = [
    { name: "Storm Damage", icon: "cyclone", href: "/services/storm-damage" },
    { name: "Water Loss", icon: "opacity", href: "/services/water-loss" },
    { name: "Structural", icon: "architecture", href: "/services/structural" },
    { name: "Fortified", icon: "shield", href: "/services/fortified" },
    { name: "Chimney Collapse", icon: "report_problem", href: "/services/chimney-collapse" },
    { name: "Large Loss", icon: "domain_disabled", href: "/services/large-loss" },
    { name: "Component Failure", icon: "construction", href: "/services/component-failure" },
    { name: "HVAC/Electrical", icon: "electrical_services", href: "/services/hvac-electrical" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img 
            src="/logo.jpg" 
            alt="Trinity Engineering" 
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Desktop Menu - Center */}
        <div className="hidden lg:flex items-center gap-8">
          {/* Services Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors focus:outline-none">
              Our Services
              <span className="material-icons text-sm">expand_more</span>
            </button>
            <div
              className={`absolute top-full left-0 mt-2 w-64 bg-white dark:bg-section-dark shadow-2xl rounded-lg border border-gray-200 dark:border-gray-800 transition-all duration-200 max-h-[500px] overflow-y-auto scrollbar-hide ${
                isServicesOpen ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              <div className="p-2">
                {services.map((service) => (
                  <a
                    key={service.name}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors rounded-lg group/item"
                    href={service.href}
                  >
                    <span className="material-symbols-outlined text-lg text-primary group-hover/item:scale-110 transition-transform">
                      {service.icon}
                    </span>
                    <span>{service.name}</span>
                  </a>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800 p-2">
                <a
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-primary hover:bg-primary/10 transition-colors rounded-lg font-bold"
                  href="#services"
                >
                  View All Services
                  <span className="material-icons text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>

          {/* Fortified */}
          <Link
            className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
            href="/fortified"
          >
            Fortified
          </Link>

          {/* Education Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsEducationOpen(true)}
            onMouseLeave={() => setIsEducationOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors focus:outline-none">
              Education
              <span className="material-icons text-sm">expand_more</span>
            </button>
            <div
              className={`absolute top-full left-0 mt-2 w-48 bg-white dark:bg-section-dark shadow-2xl rounded-lg border border-gray-200 dark:border-gray-800 transition-all duration-200 ${
                isEducationOpen ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              <Link
                className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors rounded-t-lg"
                href="/case-studies"
              >
                Case Studies
              </Link>
              <Link
                className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors rounded-b-lg"
                href="/white-papers"
              >
                White Papers
              </Link>
            </div>
          </div>

          {/* Careers */}
          <Link
            className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
            href="/careers"
          >
            Careers
          </Link>

          {/* About Us */}
          <Link
            className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
            href="/about"
          >
            About Us
          </Link>

          {/* Contact */}
          <Link
            className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
            href="/contact"
          >
            Contact
          </Link>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Client Login */}
          <Link
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            href="/client-login"
          >
            Client Login
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-base">
                light_mode
              </span>
            ) : (
              <span className="material-symbols-outlined text-gray-600 text-base">
                dark_mode
              </span>
            )}
          </button>

          {/* Submit Inspection Button */}
          <Link
            className="bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
            href="/submit-inspection"
          >
            <span className="material-icons text-base">send</span>
            Submit Inspection
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-300"
          aria-label="Toggle mobile menu"
        >
          <span className="material-icons text-2xl">
            {isMobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-section-dark border-t border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4 space-y-3">
            {/* Services */}
            <div>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 dark:text-gray-300 py-2"
              >
                Our Services
                <span className="material-icons text-sm">
                  {isServicesOpen ? "expand_less" : "expand_more"}
                </span>
              </button>
              {isServicesOpen && (
                <div className="pl-4 space-y-2 mt-2">
                  {services.map((service) => (
                    <a
                      key={service.name}
                      href={service.href}
                      className="block text-sm text-gray-600 dark:text-gray-400 py-2"
                    >
                      {service.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <Link href="/fortified" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 py-2">
              Fortified
            </Link>

            {/* Education */}
            <div>
              <button
                onClick={() => setIsEducationOpen(!isEducationOpen)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 dark:text-gray-300 py-2"
              >
                Education
                <span className="material-icons text-sm">
                  {isEducationOpen ? "expand_less" : "expand_more"}
                </span>
              </button>
              {isEducationOpen && (
                <div className="pl-4 space-y-2 mt-2">
                  <Link href="/case-studies" className="block text-sm text-gray-600 dark:text-gray-400 py-2">
                    Case Studies
                  </Link>
                  <Link href="/white-papers" className="block text-sm text-gray-600 dark:text-gray-400 py-2">
                    White Papers
                  </Link>
                </div>
              )}
            </div>

            <Link href="/careers" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 py-2">
              Careers
            </Link>

            <Link href="/about" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 py-2">
              About Us
            </Link>

            <Link href="/contact" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 py-2">
              Contact
            </Link>

            <Link href="/client-login" className="block text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
              Client Login
            </Link>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
              <Link
                href="/submit-inspection"
                className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold transition-all"
              >
                <span className="material-icons text-base">send</span>
                Submit Inspection
              </Link>
            </div>

            <button
              onClick={toggleTheme}
              className="flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <span className="material-symbols-outlined text-base">
                {theme === "dark" ? "light_mode" : "dark_mode"}
              </span>
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
