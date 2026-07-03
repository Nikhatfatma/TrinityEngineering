"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, User, LogOut } from "lucide-react";

interface PortalUser {
  email: string;
  name: string;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [portalUser, setPortalUser] = useState<PortalUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [hasLocalSession, setHasLocalSession] = useState(false);
  const pathname = usePathname();
  const hasMediaHero =
    pathname === "/" ||
    pathname === "/claims" ||
    pathname === "/swi" ||
    pathname === "/fortified" ||
    pathname === "/education" ||
    pathname.startsWith("/industry/");
  // pathname === "/careers"; // In-app careers tab — restore when re-enabled
  const isSolidHeader = scrolled || !hasMediaHero;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    ["/logo-transparent.png", "/logo-navbar-dark.png"].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasLocalSession(localStorage.getItem("portal_logged_in") === "true");
    }
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/portal/session")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.valid && data.user) {
          setPortalUser(data.user);
          localStorage.setItem("portal_logged_in", "true");
          setHasLocalSession(true);
        } else {
          setPortalUser(null);
          localStorage.removeItem("portal_logged_in");
          setHasLocalSession(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPortalUser(null);
          localStorage.removeItem("portal_logged_in");
          setHasLocalSession(false);
        }
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/portal/logout", { method: "POST" });
    } finally {
      setPortalUser(null);
      localStorage.removeItem("portal_logged_in");
      setHasLocalSession(false);
      setMobileMenuOpen(false);
      window.location.href = "/login";
    }
  }, []);

  const authLinkClass = `relative group/login flex items-center transition-all duration-500 uppercase tracking-[0.14em] font-black xl:tracking-[0.2em] ${
    isSolidHeader
      ? "text-gray-900 hover:text-[#0047AB]"
      : "text-white hover:text-white"
  }`;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onResize = () => {
      if (mq.matches) setMobileMenuOpen(false);
    };
    mq.addEventListener("change", onResize);
    onResize();

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      mq.removeEventListener("change", onResize);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navItems = ["HOME", "CLAIMS", "SWI", "FORTIFIED", "CAREERS", "EDUCATION"];

  /** External careers portal — replace internal `/careers` route for now */
  const CAREERS_EXTERNAL_URL = "https://careers.trinitypllc.com/jobs/Careers";

  const getNavHref = (item: string) => {
    if (item === "HOME") return "/";
    if (item === "CAREERS") return CAREERS_EXTERNAL_URL;
    // if (item === "CAREERS") return "/careers"; // In-app careers tab — restore when re-enabled
    return `/${item.toLowerCase()}`;
  };

  const isExternalNavItem = (item: string) => item === "CAREERS";

  const isNavActive = (item: string) => {
    const href = getNavHref(item);
    if (item === "HOME") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const mobileHeaderText = isSolidHeader ? "text-gray-900" : "text-white";
  const mobilePhoneClass = `text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-semibold tracking-wide whitespace-nowrap transition-colors hover:opacity-80 ${mobileHeaderText}`;
  const isAuthFlowPage = pathname === "/login" || pathname.startsWith("/login/");
  const showAuthNav = !isAuthFlowPage;

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isSolidHeader
            ? "bg-white shadow-[0_1px_0_rgba(0,0,0,0.05)] h-14 lg:h-[75px]"
            : "h-14 lg:h-[85px] xl:h-[110px] bg-black/30 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none"
        }`}
      >
        <div className="mx-auto flex h-full min-w-0 max-w-[1440px] items-center justify-between gap-1.5 px-4 sm:gap-2 sm:px-6 lg:gap-3 lg:px-6 xl:px-8">
          <Link
            href="/"
            className="flex items-center min-w-0 flex-1 lg:flex-none lg:w-[168px] xl:w-[250px] max-w-[42%] min-[400px]:max-w-[48%] sm:max-w-none shrink-0"
          >
            <span className={`relative block h-9 w-full max-w-full min-[400px]:h-10 sm:h-11 ${isSolidHeader ? "lg:h-[58px] xl:h-[66px]" : "lg:h-[65px] xl:h-[75px]"} transition-all duration-500`}>
              {hasMediaHero && (
                <img
                  src="/logo-transparent.png"
                  alt=""
                  aria-hidden
                  className={`absolute left-0 top-0 h-full w-auto max-w-full object-contain object-left transition-opacity duration-500 ${
                    isSolidHeader ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
                />
              )}
              <img
                src="/logo-navbar-dark.png"
                alt="Trinity Engineering"
                className={`absolute left-0 top-0 h-full w-auto max-w-full object-contain object-left transition-opacity duration-500 ${
                  hasMediaHero && !isSolidHeader ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
              />
            </span>
          </Link>

          <div className="hidden lg:flex flex-1 min-w-0 items-center justify-start xl:justify-center gap-0 lg:pl-6 xl:pl-0 xl:gap-0.5 px-1 xl:px-4">
            {navItems.map((item) => {
              const href = getNavHref(item);
              const isActive = isNavActive(item);
              const linkClass = `relative shrink-0 px-1.5 lg:px-2.5 py-2 text-[10px] tracking-[0.14em] transition-colors duration-300 group xl:px-5 xl:text-[12px] xl:tracking-[0.2em] ${
                    isActive
                      ? isSolidHeader
                        ? "font-bold text-[#0047AB]"
                        : "font-bold text-white"
                      : isSolidHeader
                        ? "font-semibold text-gray-600 hover:text-[#0047AB]"
                        : "font-semibold text-white hover:text-white"
                  }`;
              const linkChildren = (
                <>
                  <span className="relative z-10">{item}</span>
                  <div
                    className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 transition-all duration-300 ${
                      isActive ? "w-1/2" : "w-0"
                    } ${isSolidHeader ? "bg-[#0047AB]" : "bg-white"}`}
                  />
                </>
              );

              return isExternalNavItem(item) ? (
                <a
                  key={item}
                  href={href}
                  className={linkClass}
                >
                  {linkChildren}
                </a>
              ) : (
                <Link
                  key={item}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={linkClass}
                >
                  {linkChildren}
                </Link>
              );
            })}
          </div>

          <div
            className={`hidden lg:flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] shrink-0 xl:gap-4 xl:text-[12px] xl:tracking-[0.1em] ${
              isSolidHeader ? "text-gray-900" : "text-white"
            }`}
          >
            <span className="transition-colors whitespace-nowrap">
              (855) 929-5888
            </span>
            {showAuthNav && (
              <>
                <span className="hidden opacity-40 xl:inline">|</span>
                {authLoading ? (
                  hasLocalSession ? (
                    <div className="w-[80px] h-[24px] opacity-0"></div>
                  ) : (
                    <Link href="/login" className={authLinkClass}>
                      <span className="relative z-10 transition-transform duration-500 group-hover/login:-translate-x-1">
                        LOGIN
                      </span>
                      <span
                        className={`absolute right-0 opacity-0 -translate-x-2 transition-all duration-500 group-hover/login:opacity-100 group-hover/login:translate-x-6 ${
                          isSolidHeader ? "text-blue-500" : "text-white"
                        }`}
                      >
                        →
                      </span>
                    </Link>
                  )
                ) : portalUser && pathname.startsWith("/portal") ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className={`flex items-center gap-2 px-1.5 py-1.5 rounded-full border transition-all duration-300 ${
                        isSolidHeader
                          ? "border-gray-200 hover:border-blue-500 hover:shadow-md bg-white/50"
                          : "border-white/20 hover:border-white/60 bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        isSolidHeader ? "bg-[#0047AB] text-white" : "bg-white/20 text-white"
                      }`}>
                        <User size={14} strokeWidth={2.5} />
                      </div>
                      <span className={`text-[11px] font-bold tracking-wider pr-2 truncate max-w-[100px] ${
                        isSolidHeader ? "text-gray-900" : "text-white"
                      }`}>
                        {portalUser.name?.split(' ')[0] || "PROFILE"}
                      </span>
                    </button>
                    {profileDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                        <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white z-50 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
                          <div className="px-5 py-4 bg-gradient-to-br from-white/90 to-blue-50/80 border-b border-gray-100/50">
                            <p className="text-sm font-extrabold text-gray-900 truncate tracking-tight">{portalUser.name}</p>
                            <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{portalUser.email}</p>
                          </div>
                          <div className="p-2">
                            <button
                              onClick={handleLogout}
                              className="group flex items-center gap-3 w-full text-left px-3 py-2.5 text-[11px] font-black tracking-widest text-gray-500 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 uppercase"
                            >
                              <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-200 transition-colors text-gray-400 group-hover:text-gray-700">
                                <LogOut size={13} strokeWidth={2.5} />
                              </div>
                              LOGOUT
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : portalUser ? (
                  <Link
                    href="/portal/claims"
                    className={`flex items-center gap-2 px-1.5 py-1.5 rounded-full border transition-all duration-300 group/profile ${
                      isSolidHeader
                        ? "border-gray-200 hover:border-blue-500 hover:shadow-md bg-white/50"
                        : "border-white/20 hover:border-white/60 bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/profile:scale-110 ${
                      isSolidHeader ? "bg-gradient-to-br from-[#0047AB] to-[#001D3D] text-white shadow-sm" : "bg-white text-[#0047AB]"
                    }`}>
                      <User size={14} strokeWidth={2.5} />
                    </div>
                    <span className={`text-[11px] font-bold tracking-wider pr-2 truncate max-w-[100px] ${
                      isSolidHeader ? "text-gray-900" : "text-white"
                    }`}>
                      {portalUser.name?.split(' ')[0] || "PROFILE"}
                    </span>
                  </Link>
                ) : (
                  <Link href="/login" className={authLinkClass}>
                    <span className="relative z-10 transition-transform duration-500 group-hover/login:-translate-x-1">
                      LOGIN
                    </span>
                    <span
                      className={`absolute right-0 opacity-0 -translate-x-2 transition-all duration-500 group-hover/login:opacity-100 group-hover/login:translate-x-6 ${
                        isSolidHeader ? "text-blue-500" : "text-white"
                      }`}
                    >
                      →
                    </span>
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-1 sm:gap-1.5 shrink-0">
            <span className={mobilePhoneClass}>
              (855) 929-5888
            </span>
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 -mr-0.5"
            >
              {mobileMenuOpen ? (
                <X className={mobileHeaderText} size={20} strokeWidth={2.5} />
              ) : (
                <Menu className={mobileHeaderText} size={20} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[100] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-[#05111D]/55 backdrop-blur-[3px]"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div
            className="absolute top-0 right-0 z-10 flex w-[min(220px,calc(100vw-48px))] max-h-[100dvh] flex-col overflow-hidden rounded-bl-xl bg-white shadow-[-8px_0_28px_rgba(0,0,0,0.15)] animate-slide-in-right"
          >
            <div className="h-0.5 shrink-0 bg-gradient-to-r from-[#0047AB] via-[#2563EB] to-[#60A5FA]" />

            <div className="flex h-11 shrink-0 items-center justify-between border-b border-gray-100/90 px-3">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="min-w-0">
                <img
                  src="/logo-navbar-dark.png"
                  alt="Trinity Engineering"
                  className="h-7 w-auto object-contain sm:h-8"
                />
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={18} strokeWidth={2.25} />
              </button>
            </div>

            <div className="flex flex-col overflow-y-auto px-2.5 py-3">
              <nav className="flex flex-col gap-0.5">
                {navItems.map((item) => {
                  const href = getNavHref(item);
                  const isActive = isNavActive(item);
                  const mobileLinkClass = `rounded-md px-2.5 py-2 text-[11px] font-semibold tracking-[0.12em] transition-all duration-200 ${
                    isActive
                      ? "bg-[#0047AB]/10 text-[#0047AB] ring-1 ring-[#0047AB]/20"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#0047AB]"
                  }`;

                  return isExternalNavItem(item) ? (
                    <a
                      key={item}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      {item}
                    </a>
                  ) : (
                    <Link
                      key={item}
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      {item}
                    </Link>
                  );
                })}
              </nav>

              {showAuthNav && (
                <div className="mt-3 border-t border-gray-100 pt-3 space-y-2">
                  {portalUser && pathname.startsWith("/portal") ? (
                    <div className="bg-gradient-to-b from-white to-gray-50/50 rounded-2xl p-4 border border-gray-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] mt-4">
                      <div className="flex items-center gap-3.5 mb-4 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0047AB] to-[#001D3D] text-white flex items-center justify-center shrink-0 shadow-sm">
                          <User size={18} strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-extrabold text-gray-900 truncate tracking-tight">{portalUser.name}</p>
                          <p className="text-[11px] font-medium text-gray-500 truncate mt-0.5">{portalUser.email}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 text-gray-700 border border-gray-100 px-4 py-3 text-[11px] font-black tracking-[0.18em] transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 uppercase shadow-sm"
                      >
                        <LogOut size={14} strokeWidth={2.5} className="text-gray-500" />
                        LOGOUT
                      </button>
                    </div>
                  ) : portalUser ? (
                    <Link
                      href="/portal/claims"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between w-full p-2 pl-2 pr-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] transition-all active:scale-[0.98] mt-2 group/mlink"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0047AB] to-[#001D3D] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover/mlink:scale-105">
                          <User size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-[13px] font-extrabold text-gray-900 tracking-tight truncate max-w-[160px]">
                          {portalUser.name || "PROFILE"}
                        </span>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-[#E6F0FF] flex items-center justify-center">
                        <ArrowRight size={14} strokeWidth={2.5} className="text-[#0056B3]" />
                      </div>
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-md bg-[#001D3D] px-3 py-2.5 text-[10px] font-black tracking-[0.18em] text-white shadow-md transition-colors hover:bg-[#0047AB]"
                    >
                      LOGIN
                      <ArrowRight size={12} strokeWidth={2.5} className="shrink-0" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
