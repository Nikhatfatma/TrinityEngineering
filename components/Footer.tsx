"use client";

import Link from "next/link";
import { Phone, Mail, Clock, ChevronRight } from "lucide-react";

export default function Footer() {
  const footerLinkClass = "relative group flex items-center gap-0 hover:gap-2 transition-all duration-300 hover:text-blue-400 py-1";
  
  const HeaderWithDot = ({ title }: { title: string }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
        <h5 className="text-white font-black text-[11px] uppercase tracking-[0.3em]">{title}</h5>
      </div>
      <div className="w-16 h-[2px] bg-gradient-to-r from-[#0047AB] via-[#3B82F6] to-transparent"></div>
    </div>
  );

  return (
    <footer className="bg-[#05111D] text-white py-12 max-lg:py-14 px-4 sm:px-6 overflow-hidden relative">
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(59,130,246,0.6), 0 0 30px rgba(0,71,171,0.4); opacity: 0.8; }
          50% { box-shadow: 0 0 25px rgba(59,130,246,0.9), 0 0 50px rgba(0,71,171,0.7); opacity: 1; }
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>
      
      {/* Dynamic Pulsing Neon Line */}
      <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#0047AB] animate-pulse-glow z-20"></div>
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-lg:gap-8 lg:gap-8 mb-12 max-lg:mb-10 lg:mb-16">
          
          {/* Logo Section - Span 3 */}
          <div className="lg:col-span-3 flex flex-col justify-center max-lg:items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <img 
                src="/logo-transparent.png" 
                alt="Trinity Engineering" 
                className="h-[80px] w-auto object-contain object-left"
              />
            </Link>
          </div>

          {/* Services Section - Span 5 */}
          <div className="lg:col-span-5">
            <HeaderWithDot title="Services" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] font-medium text-white/80 max-lg:max-w-xs max-lg:mx-auto">
              <ul className="space-y-4">
                {["Structural Investigations", "Storm Damage", "Water Loss", "FORTIFIED Roof", "Large Loss", "Lightning Damage"].map((item) => (
                  <li key={item}>
                    <Link className={footerLinkClass} href={`/services/${item.toLowerCase().replace(/ /g, "-")}`}>
                      <ChevronRight size={12} className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300 text-blue-500" />
                      <span>{item}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-4">
                {["Chimney Collapse", "Component Failure", "HVAC/Electrical", "Fire Investigation", "Plumbing Failure", "Fraud Investigation"].map((item) => (
                  <li key={item}>
                    <Link className={footerLinkClass} href={`/services/${item.toLowerCase().replace(/ /g, "-")}`}>
                      <ChevronRight size={12} className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300 text-blue-500" />
                      <span>{item}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Company Section - Span 2 */}
          <div className="lg:col-span-2">
            <HeaderWithDot title="Company" />
            <ul className="space-y-4 text-[13px] font-medium text-white/80">
              {["Our Services", "Fortified", "Education", "Careers", "About Us", "Contact"].map((item) => (
                <li key={item}>
                  <Link className={footerLinkClass} href={`/${item.toLowerCase().replace(/ /g, "-")}`}>
                    <ChevronRight size={12} className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300 text-blue-500" />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section - Span 2 */}
          <div className="lg:col-span-2">
            <HeaderWithDot title="Contact" />
            <ul className="space-y-6 text-[13px] font-medium">
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 bg-blue-500/10 rounded-sm group-hover:bg-blue-500/20 transition-colors">
                  <Phone size={14} className="text-blue-500" />
                </div>
                <a href="tel:+18559295888" className="hover:text-blue-400 transition-colors">(855) 929-5888</a>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 bg-blue-500/10 rounded-sm group-hover:bg-blue-500/20 transition-colors">
                  <Mail size={14} className="text-blue-500" />
                </div>
                <a href="mailto:claims@trinitypllc.com" className="hover:text-blue-400 transition-colors">claims@trinitypllc.com</a>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 bg-blue-500/10 rounded-sm group-hover:bg-blue-500/20 transition-colors">
                  <Mail size={14} className="text-blue-500" />
                </div>
                <a href="mailto:fortified@trinitypllc.com" className="hover:text-blue-400 transition-colors">fortified@trinitypllc.com</a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-blue-500/10 rounded-sm group-hover:bg-blue-500/20 transition-colors">
                  <Clock size={14} className="text-blue-500" />
                </div>
                <span className="text-white/80">24/7 Emergency Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-bold text-white/30 tracking-widest uppercase">
          <p>© Trinitypllc.com 2022 All rights Reserved.</p>
          <div className="flex gap-12">
            <Link className="hover:text-blue-400 transition-colors" href="/privacy">Privacy Policy</Link>
            <Link className="hover:text-blue-400 transition-colors" href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
