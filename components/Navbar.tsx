"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronUp, User, LogOut, ClipboardList } from "lucide-react";

interface PortalUser {
  email: string;
  name: string;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [mobileResearchOpen, setMobileResearchOpen] = useState(false);
  const [mobileAuthPressed, setMobileAuthPressed] = useState<"inspections" | "logout" | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [portalUser, setPortalUser] = useState<PortalUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [hasLocalSession, setHasLocalSession] = useState(false);
  const pathname = usePathname();
  const isOnMyInspectionsPage = pathname === "/portal/claims" || pathname.startsWith("/portal/claims/");
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
    setProfileDropdownOpen(false);
  }, [pathname]);

  // useEffect(() => {
  //   if (pathname.startsWith("/industry/")) {
  //     setMobileResearchOpen(true);
  //   }
  // }, [pathname]);

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
      setProfileDropdownOpen(false);
      localStorage.removeItem("portal_logged_in");
      setHasLocalSession(false);
      setMobileMenuOpen(false);
      window.location.href = "/login";
    }
  }, []);

  const profileTriggerClass = `flex items-center gap-2 px-1.5 py-1.5 rounded-full border transition-all duration-300 ${
    isSolidHeader
      ? "border-gray-200 hover:border-blue-500 hover:shadow-md bg-white/50"
      : "border-white/20 hover:border-white/60 bg-white/10 hover:bg-white/20"
  }`;

  const profileAvatarClass = `w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
    isSolidHeader ? "bg-gradient-to-br from-[#0047AB] to-[#001D3D] text-white shadow-sm" : "bg-white text-[#0047AB]"
  }`;

  const profileNameClass = `text-[11px] font-bold tracking-wider pr-2 truncate max-w-[100px] ${
    isSolidHeader ? "text-gray-900" : "text-white"
  }`;

  const getMobileNavHref = (item: string) => {
    if (item === "CONTACT") return "tel:+18559295888";
    return getNavHref(item);
  };

  const isMobileNavActive = (item: string) => {
    if (item === "CONTACT") return false;
    return isNavActive(item);
  };

  // const isMobileResearchActive = pathname.startsWith("/industry/");

  const mobileNavLinkClass = (isActive: boolean) =>
    `inline-block w-fit border-b-2 py-2.5 text-[14px] font-semibold tracking-[0.12em] transition-[color,border-color] duration-150 md:py-3 md:text-[16px] ${
      isActive
        ? "border-[#0047AB] font-bold text-[#0047AB]"
        : "border-transparent text-[#111827]"
    }`;

  const mobileSubNavLinkClass = (isActive: boolean) =>
    `inline-block w-fit border-b-2 py-2.5 pl-1 text-[12px] font-semibold tracking-[0.1em] transition-[color,border-color] duration-150 md:py-3 md:text-[14px] ${
      isActive
        ? "border-[#0047AB] font-bold text-[#0047AB]"
        : "border-transparent text-[#111827]"
    }`;

  const renderMobileNavItem = (item: string) => {
    const href = getMobileNavHref(item);
    const isActive = isMobileNavActive(item);
    const className = mobileNavLinkClass(isActive);

    if (item === "CONTACT") {
      return (
        <span
          key={item}
          aria-disabled="true"
          className="inline-block w-fit cursor-not-allowed border-b-2 border-transparent py-2.5 text-[14px] font-semibold tracking-[0.12em] text-gray-400 md:py-3 md:text-[16px]"
        >
          {item}
        </span>
      );
    }

    if (isExternalNavItem(item)) {
      return (
        <a key={item} href={href} onClick={() => setMobileMenuOpen(false)} className={className}>
          {item}
        </a>
      );
    }

    return (
      <Link
        key={item}
        href={href}
        aria-current={isActive ? "page" : undefined}
        onClick={() => setMobileMenuOpen(false)}
        className={className}
      >
        {item}
      </Link>
    );
  };

  const mobileAuthButtonClass = (id: "inspections" | "logout", isActive = false) => {
    const isHighlighted = isActive || mobileAuthPressed === id;

    return `flex w-full items-center justify-center gap-2 rounded-md border px-4 py-3 text-[11px] font-bold tracking-[0.14em] uppercase transition-colors duration-150 md:py-3.5 md:text-[13px] ${
      isHighlighted
        ? "border-[#0047AB] bg-[#0047AB] text-white"
        : "border-gray-300 bg-white text-gray-800"
    }`;
  };

  const mobileAuthButtonHandlers = (id: "inspections" | "logout") => ({
    onMouseEnter: () => setMobileAuthPressed(id),
    onMouseLeave: () => setMobileAuthPressed(null),
    onTouchStart: () => setMobileAuthPressed(id),
    onTouchEnd: () => setMobileAuthPressed(null),
    onTouchCancel: () => setMobileAuthPressed(null),
  });

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
      setMobileAuthPressed(null);
    }
    return () => {
      mq.removeEventListener("change", onResize);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navItems = ["HOME", "CLAIMS", "SWI", "FORTIFIED", "CAREERS", "EDUCATION"];

  // const researchSubItems = [
  //   { label: "DRONE INSPECTIONS", href: "/industry/drone-technology", disabled: true },
  //   { label: "INFRARED (IR) IMAGING", href: "/industry/infrared-thermography", disabled: true },
  //   { label: "FORENSIC ENGINEERING", href: "/industry/research-and-testing", disabled: true },
  // ];

  const mobileNavItemsBeforeResearch = ["HOME", "CLAIMS", "SWI", "FORTIFIED"];
  const mobileNavItemsAfterResearch = ["CAREERS", "EDUCATION"]; // "CONTACT" — temporarily hidden from mobile menu

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
                ) : portalUser ? (
                  <div className="relative">
                    <button
                      type="button"
                      aria-expanded={profileDropdownOpen}
                      aria-haspopup="menu"
                      onClick={() => setProfileDropdownOpen((open) => !open)}
                      className={profileTriggerClass}
                    >
                      <div className={profileAvatarClass}>
                        <User size={14} strokeWidth={2.5} />
                      </div>
                      <span className={profileNameClass}>
                        {portalUser.name?.split(" ")[0] || "PROFILE"}
                      </span>
                    </button>
                    {profileDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setProfileDropdownOpen(false)}
                          aria-hidden="true"
                        />
                        <div
                          role="menu"
                          className="absolute right-0 mt-3 w-64 rounded-2xl bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-50 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top-right"
                        >
                          <div className="px-5 py-4 bg-gradient-to-br from-white to-blue-50/80 border-b border-gray-100/80">
                            <p className="text-sm font-extrabold text-gray-900 truncate tracking-tight">
                              {portalUser.name}
                            </p>
                            <p className="text-xs font-medium text-gray-500 truncate mt-0.5">
                              {portalUser.email}
                            </p>
                          </div>
                          <div className="p-2">
                            {!isOnMyInspectionsPage && (
                              <Link
                                href="/portal/claims"
                                role="menuitem"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="group flex items-center gap-3 w-full text-left px-3 py-2.5 text-[11px] font-black tracking-widest text-gray-600 rounded-xl hover:bg-[#E6F0FF] hover:text-[#0047AB] transition-all duration-300 uppercase"
                              >
                                <div className="w-7 h-7 rounded-full bg-[#E6F0FF] flex items-center justify-center group-hover:bg-[#0047AB]/10 transition-colors text-[#0047AB]">
                                  <ClipboardList size={13} strokeWidth={2.5} />
                                </div>
                                My Inspections
                              </Link>
                            )}
                            <button
                              type="button"
                              role="menuitem"
                              onClick={handleLogout}
                              className={`group flex items-center gap-3 w-full text-left px-3 py-2.5 text-[11px] font-black tracking-widest text-gray-600 rounded-xl hover:bg-[#E6F0FF] hover:text-[#0047AB] transition-all duration-300 uppercase ${isOnMyInspectionsPage ? "" : "mt-1"}`}
                            >
                              <div className="w-7 h-7 rounded-full bg-[#E6F0FF] flex items-center justify-center group-hover:bg-[#0047AB]/10 transition-colors text-[#0047AB]">
                                <LogOut size={13} strokeWidth={2.5} />
                              </div>
                              Logout
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
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
            {!mobileMenuOpen && (
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={false}
                onClick={() => setMobileMenuOpen(true)}
                className="p-1 -mr-0.5"
              >
                <Menu className={mobileHeaderText} size={20} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[9999] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/35"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 z-10 flex w-[min(285px,calc(100vw-1.5rem))] flex-col overflow-hidden bg-[#E8EBF0] shadow-[-6px_0_24px_rgba(0,0,0,0.12)] md:w-[min(440px,calc(100vw-2rem))]">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200/80 px-5 py-4 md:px-6">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="min-w-0">
                <img
                  src="/logo-navbar-dark.png"
                  alt="Trinity Engineering"
                  className="h-8 w-auto object-contain md:h-9"
                />
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-[#0047AB]"
              >
                <X size={22} strokeWidth={2.5} className="md:h-6 md:w-6" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 md:px-6 md:py-4">
              <nav className="flex flex-col">
                {mobileNavItemsBeforeResearch.map((item) => renderMobileNavItem(item))}

                {/* RESEARCH & TESTING — temporarily hidden from mobile menu
                <div>
                  <button
                    type="button"
                    aria-expanded={mobileResearchOpen}
                    onClick={() => setMobileResearchOpen((open) => !open)}
                    className="flex w-full items-center justify-between gap-2 py-2.5 text-left text-[14px] font-semibold tracking-[0.12em] text-[#111827] md:py-3 md:text-[16px]"
                  >
                    <span
                      className={`inline-block w-fit border-b-2 transition-[color,border-color] duration-150 ${
                        isMobileResearchActive
                          ? "border-[#0047AB] font-bold text-[#0047AB]"
                          : "border-transparent"
                      }`}
                    >
                      RESEARCH &amp; TESTING
                    </span>
                    {mobileResearchOpen ? (
                      <ChevronUp size={18} strokeWidth={2.25} className="shrink-0 text-[#0047AB] md:h-5 md:w-5" />
                    ) : (
                      <ChevronDown size={18} strokeWidth={2.25} className="shrink-0 text-[#0047AB] md:h-5 md:w-5" />
                    )}
                  </button>

                  {mobileResearchOpen && (
                    <div className="mb-1 flex flex-col pl-4 md:pl-5">
                      {researchSubItems.map((subItem) => {
                        const isSubActive =
                          !subItem.disabled &&
                          (pathname === subItem.href || pathname.startsWith(`${subItem.href}/`));

                        if (subItem.disabled) {
                          return (
                            <span
                              key={subItem.label}
                              aria-disabled="true"
                              className="inline-block w-fit cursor-not-allowed border-b-2 border-transparent py-2.5 pl-1 text-[12px] font-semibold tracking-[0.1em] text-gray-400 md:py-3 md:text-[14px]"
                            >
                              {subItem.label}
                            </span>
                          );
                        }

                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            aria-current={isSubActive ? "page" : undefined}
                            onClick={() => setMobileMenuOpen(false)}
                            className={mobileSubNavLinkClass(isSubActive)}
                          >
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
                */}

                {mobileNavItemsAfterResearch.map((item) => renderMobileNavItem(item))}
              </nav>
            </div>

            {showAuthNav && (
              <div className="shrink-0 border-t border-gray-200/80 px-5 py-4 md:px-6">
                {portalUser ? (
                  <div className="space-y-3">
                    <div className="rounded-md border border-gray-200/80 bg-white px-4 py-3">
                      <p className="truncate text-sm font-bold text-gray-900 md:text-base">{portalUser.name}</p>
                      <p className="truncate text-xs text-gray-500 md:text-sm">{portalUser.email}</p>
                    </div>
                    <Link
                      href="/portal/claims"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileAuthButtonClass("inspections", isOnMyInspectionsPage)}
                      {...mobileAuthButtonHandlers("inspections")}
                    >
                      <ClipboardList size={15} strokeWidth={2.5} className="md:h-[18px] md:w-[18px]" />
                      My Inspections
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className={mobileAuthButtonClass("logout")}
                      {...mobileAuthButtonHandlers("logout")}
                    >
                      <LogOut size={15} strokeWidth={2.5} className="md:h-[18px] md:w-[18px]" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-md bg-[#0047AB] px-4 py-3 text-[12px] font-bold tracking-[0.16em] text-white uppercase md:py-3.5 md:text-[14px]"
                  >
                    LOGIN
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
