"use client";

import React from "react";
import { CheckCircle, Home, RefreshCw, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface SuccessMessageProps {
  onReset: () => void;
}

export default function SuccessMessage({ onReset }: SuccessMessageProps) {
  const router = useRouter();

  // ── Play Soft Tone on Mount ──
  React.useEffect(() => {
    try {
      const audio = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3");
      audio.volume = 0.4;
      audio.play().catch(e => console.log("Audio play blocked by browser:", e));
    } catch (err) {
      console.log("Audio error:", err);
    }
  }, []);

  return (
    <div className="relative py-4 px-4 flex items-center justify-center overflow-visible">
      {/* ── 3D Scene Container ── */}
      <div className="perspective-2000 w-full max-w-sm">
        
        {/* ── Main 3D Card ── */}
        <div className="relative group transform-style-3d animate-float-3d">
          
          {/* Depth Layers (Stacked behind for 3D thickness) */}
          <div className="absolute inset-0 bg-primary/10 dark:bg-accent/10 rounded-3xl translate-z-[-10px] blur-sm"></div>
          <div className="absolute inset-0 bg-primary/5 dark:bg-accent/5 rounded-3xl translate-z-[-20px] blur-md"></div>
          
          {/* Main Card Face */}
          <div className="relative bg-white/90 dark:bg-section-dark/90 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-white/10 shadow-3xl transform-style-3d overflow-visible">
            
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none rounded-3xl"></div>
            
            {/* Icon Wrapper with 3D Pop */}
            <div className="relative mb-6 flex justify-center translate-z-20">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 blur-2xl opacity-20 animate-pulse"></div>
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-all duration-700">
                  <CheckCircle className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce" />
                </div>
              </div>
            </div>

            {/* Content with Layered Depth */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white translate-z-30 tracking-tight">
                Submission Successful!
              </h2>
              
              <div className="h-1 w-12 bg-primary dark:bg-accent mx-auto rounded-full translate-z-10"></div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 translate-z-10 leading-relaxed font-medium">
                Your request has been securely processed. Our team will reach out to you shortly via the provided contact details.
              </p>
            </div>

            {/* Actions Section */}
            <div className="mt-8 space-y-2.5 translate-z-40">
              <button
                onClick={() => router.push("/")}
                className="w-full relative overflow-hidden group/btn bg-primary dark:bg-accent text-white font-black py-3 px-6 rounded-xl transition-all shadow-xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 text-[11px] uppercase tracking-widest"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                <Home className="w-4 h-4" />
                Return Home
              </button>
              
              <button
                onClick={onReset}
                className="w-full bg-white dark:bg-background-dark text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent font-black py-3 px-6 rounded-xl transition-all border-2 border-gray-100 dark:border-gray-800 hover:border-primary/30 dark:hover:border-accent/30 flex items-center justify-center gap-3 text-[11px] uppercase tracking-widest"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                Submit Another
              </button>
            </div>
          </div>

          {/* Bottom Reflection Glow */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/20 dark:bg-accent/20 blur-3xl rounded-full opacity-50"></div>
        </div>
      </div>

      {/* Global CSS for 3D Utils (If not in tailwind) */}
      <style jsx global>{`
        .perspective-2000 {
          perspective: 2000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .translate-z-10 { transform: translateZ(10px); }
        .translate-z-20 { transform: translateZ(20px); }
        .translate-z-30 { transform: translateZ(30px); }
        .translate-z-40 { transform: translateZ(40px); }
        .translate-z-\\[-10px\\] { transform: translateZ(-10px); }
        .translate-z-\\[-20px\\] { transform: translateZ(-20px); }

        @keyframes float3d {
          0%, 100% { transform: rotateX(5deg) rotateY(-5deg) translateY(0); }
          50% { transform: rotateX(-5deg) rotateY(5deg) translateY(-10px); }
        }
        .animate-float-3d {
          animation: float3d 6s ease-in-out infinite;
        }

        .shadow-3xl {
          box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.25), 0 30px 60px -30px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
