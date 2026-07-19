"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Send } from "lucide-react";

export default function FloatingSubmitButton() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/submit-inspection")) return null;
  if (!visible) return null;

  return (
    <div className="fixed right-0 top-1/2 z-[60] -translate-y-1/2 animate-fadeIn max-lg:top-auto max-lg:bottom-24 max-lg:translate-y-0">
      <Link
        href="/submit-inspection"
        className="flex flex-col items-center rounded-l-md bg-[#0047AB] px-1.5 py-2.5 text-white shadow-xl transition-all hover:-translate-x-1 hover:bg-[#003580] max-lg:px-1.5 max-lg:py-3 lg:px-2.5 lg:py-4"
        aria-label="Submit Inspection"
      >
        <Send className="mb-1 h-3.5 w-3.5 shrink-0 lg:h-[15px] lg:w-[15px]" />
        <span
          className="mt-1.5 font-bold uppercase tracking-[0.14em] text-[8px] max-lg:mt-2 lg:mt-3 lg:text-[11px] lg:tracking-[0.2em]"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Submit Inspection
        </span>
      </Link>
    </div>
  );
}
