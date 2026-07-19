"use client";

import Link from "next/link";
import { Phone, Mail, Clock, ChevronRight } from "lucide-react";

const FOOTER_TAGLINE = "";

const SERVICES_COL_LEFT = [
  "Structural Investigations",
  "Storm Damage",
  "Water Loss",
  "FORTIFIED Roof",
  "Large Loss",
  "Lightning Damage",
];

const SERVICES_COL_RIGHT = [
  "Chimney Collapse",
  "Component Failure",
  "HVAC/Electrical",
  "Fire Investigation",
  "Plumbing Failure",
  "Fraud Investigation",
];

export default function Footer() {
  const footerLinkClass = "relative group flex items-center gap-0 hover:gap-2 transition-all duration-300 hover:text-blue-400 py-1";

  const serviceHref = (item: string) => "/submit-inspection";

  const ServiceLink = ({ item }: { item: string }) => (
    <Link className={footerLinkClass} href={serviceHref(item)}>
      <span>{item}</span>
    </Link>
  );
  
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
    <footer className="relative bg-[#18222F] py-8 text-white max-lg:overflow-x-clip max-lg:py-9">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-6 lg:pr-14 xl:px-8 xl:pr-8">
        <div className="mb-8 grid grid-cols-1 gap-8 max-lg:mb-7 max-lg:justify-items-start max-lg:gap-6 lg:mb-10 lg:grid-cols-12 lg:gap-6 xl:gap-8">
          
          {/* Logo Section */}
          <div className="flex w-full min-w-0 flex-col max-lg:items-start max-lg:justify-start lg:col-span-2 lg:justify-center xl:col-span-3">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <img 
                src="/logo-transparent.png" 
                alt="Trinity Engineering" 
                className="h-[56px] w-auto object-contain object-left sm:h-[72px] lg:h-[84px]"
              />
            </Link>
            <p className="mt-4 max-w-full text-left text-[13px] font-normal leading-relaxed text-white/75 sm:mt-5 sm:text-[14px] lg:hidden">
              {FOOTER_TAGLINE}
            </p>
            <div className="mt-5 w-full border-b border-white/10 lg:hidden" aria-hidden />
          </div>

          {/* Tablet — left services + right services above Contact column */}
          <div className="hidden w-full min-w-0 grid-cols-2 gap-x-10 gap-y-8 md:grid lg:hidden">
            <div className="col-span-2">
              <HeaderWithDot title="Services" />
            </div>
            <ul className="space-y-8 text-[13px] font-medium text-white/80">
              {SERVICES_COL_LEFT.map((item) => (
                <li key={item}>
                  <ServiceLink item={item} />
                </li>
              ))}
            </ul>
            <div className="flex flex-col justify-end text-[13px] font-medium text-white/80">
              <ul className="space-y-8">
                {SERVICES_COL_RIGHT.map((item) => (
                  <li key={item}>
                    <ServiceLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0">
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
            <div className="min-w-0">
              <HeaderWithDot title="Contact" />
              <ul className="space-y-6 text-[13px] font-medium">
                <li className="group flex min-w-0 cursor-pointer items-start gap-3">
                  <div className="shrink-0 rounded-sm bg-blue-500/10 p-2 transition-colors group-hover:bg-blue-500/20">
                    <Phone size={14} className="text-blue-500" />
                  </div>
                  <span className="min-w-0 break-words hover:text-blue-400 transition-colors">(855) 929-5888</span>
                </li>
                <li className="group flex min-w-0 cursor-pointer items-start gap-3">
                  <div className="shrink-0 rounded-sm bg-blue-500/10 p-2 transition-colors group-hover:bg-blue-500/20">
                    <Mail size={14} className="text-blue-500" />
                  </div>
                  <a href="mailto:claims@trinitypllc.com" className="min-w-0 break-all hover:text-blue-400 transition-colors sm:break-words">claims@trinitypllc.com</a>
                </li>
                <li className="group flex min-w-0 cursor-pointer items-start gap-3">
                  <div className="shrink-0 rounded-sm bg-blue-500/10 p-2 transition-colors group-hover:bg-blue-500/20">
                    <Mail size={14} className="text-blue-500" />
                  </div>
                  <a href="mailto:fortified@trinitypllc.com" className="min-w-0 break-all hover:text-blue-400 transition-colors sm:break-words">fortified@trinitypllc.com</a>
                </li>
                <li className="group flex min-w-0 items-start gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-sm group-hover:bg-blue-500/20 transition-colors">
                    <Clock size={14} className="text-blue-500" />
                  </div>
                  <span className="text-white/80">24/7 Emergency Service</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Services — mobile + desktop */}
          <div className="w-full min-w-0 md:hidden lg:col-span-5 lg:block xl:col-span-5">
            <HeaderWithDot title="Services" />
            <div className="text-[13px] font-medium text-white/80 w-full min-w-0">
              <div className="flex flex-col gap-8 lg:hidden">
                <ul className="space-y-4">
                  {SERVICES_COL_LEFT.map((item) => (
                    <li key={item}>
                      <ServiceLink item={item} />
                    </li>
                  ))}
                </ul>
                <ul className="space-y-4">
                  {SERVICES_COL_RIGHT.map((item) => (
                    <li key={item}>
                      <ServiceLink item={item} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4">
                <ul className="space-y-4">
                  {SERVICES_COL_LEFT.map((item) => (
                    <li key={item}>
                      <ServiceLink item={item} />
                    </li>
                  ))}
                </ul>
                <ul className="space-y-4">
                  {SERVICES_COL_RIGHT.map((item) => (
                    <li key={item}>
                      <ServiceLink item={item} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Company + Contact — mobile + desktop */}
          <div className="grid w-full grid-cols-1 gap-10 max-lg:gap-8 md:hidden lg:contents">
            <div className="min-w-0 lg:col-span-2">
              <HeaderWithDot title="Company" />
              <ul className="space-y-4 text-[13px] font-medium text-white/80">
                {["Fortified", "Education", "Careers"].map((item) => (
                  <li key={item}>
                    <Link className={footerLinkClass} href={`/${item.toLowerCase().replace(/ /g, "-")}`}>
                      <ChevronRight size={12} className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300 text-blue-500" />
                      <span>{item}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 lg:col-span-3 xl:col-span-2">
              <HeaderWithDot title="Contact" />
              <ul className="space-y-6 text-[12px] font-medium xl:text-[13px]">
                <li className="group flex min-w-0 cursor-pointer items-start gap-3">
                  <div className="shrink-0 rounded-sm bg-blue-500/10 p-2 transition-colors group-hover:bg-blue-500/20">
                    <Phone size={14} className="text-blue-500" />
                  </div>
                  <span className="min-w-0 break-words hover:text-blue-400 transition-colors">(855) 929-5888</span>
                </li>
                <li className="group flex min-w-0 cursor-pointer items-start gap-3">
                  <div className="shrink-0 rounded-sm bg-blue-500/10 p-2 transition-colors group-hover:bg-blue-500/20">
                    <Mail size={14} className="text-blue-500" />
                  </div>
                  <a href="mailto:claims@trinitypllc.com" className="min-w-0 break-all hover:text-blue-400 transition-colors sm:break-words">claims@trinitypllc.com</a>
                </li>
                <li className="group flex min-w-0 cursor-pointer items-start gap-3">
                  <div className="shrink-0 rounded-sm bg-blue-500/10 p-2 transition-colors group-hover:bg-blue-500/20">
                    <Mail size={14} className="text-blue-500" />
                  </div>
                  <a href="mailto:fortified@trinitypllc.com" className="min-w-0 break-all hover:text-blue-400 transition-colors sm:break-words">fortified@trinitypllc.com</a>
                </li>

              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col items-center justify-center text-center text-[11px] font-bold text-white tracking-widest uppercase">
          <p className="max-w-full break-words">© Trinitypllc.com 2022 All rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
