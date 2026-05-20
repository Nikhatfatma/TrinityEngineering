"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Send } from "lucide-react";

export default function FloatingSubmitButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] hidden lg:block animate-fadeIn">
      <Link
        href="/submit-inspection"
        className="flex flex-col items-center bg-[#0047AB] hover:bg-[#003580] text-white py-4 px-2.5 rounded-l-md shadow-xl transition-all hover:-translate-x-1"
      >
        <Send size={15} className="-rotate-90 mb-1" />
        <span 
          className="mt-3 font-bold uppercase tracking-[0.2em] text-[11px]"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Submit Inspection
        </span>
      </Link>
    </div>
  );
}
