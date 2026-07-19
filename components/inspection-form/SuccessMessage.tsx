"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, Send } from "lucide-react";

interface SuccessMessageProps {
  onReset: () => void;
  onContinue?: () => void;
}

function VerifiedBadgeIcon() {
  return (
    <span
      className="material-symbols-outlined text-[4.5rem] sm:text-[5rem] text-[#2563EB] leading-none select-none"
      style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48" }}
      aria-hidden
    >
      verified
    </span>
  );
}

const cardClass =
  "group flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-primary/25 bg-white px-3 py-3.5 text-center shadow-sm transition-all hover:border-primary/45 hover:shadow-md dark:border-accent/25 dark:bg-section-dark";

const mediaClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 dark:bg-accent/15";

export default function SuccessMessage({ onReset, onContinue }: SuccessMessageProps) {
  return (
    <div className="fixed inset-x-0 top-16 bottom-0 z-30 flex flex-col items-center justify-center overflow-y-auto bg-white px-6 py-8 text-center dark:bg-background-dark">
      <VerifiedBadgeIcon />

      <h2 className="mt-6 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
        Submission successful
      </h2>

      <p className="mt-3 max-w-md text-sm font-normal leading-relaxed text-gray-700 sm:text-base dark:text-gray-300">
        Our team will review the details and reach out soon.
      </p>

      <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/swi" className={cardClass}>
          <span className={mediaClass}>
            <Image
              src="/swi-globe-addon-rgb.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
          </span>
          <span className="text-[12px] font-bold leading-tight text-primary dark:text-accent">
            Learn about SWI
          </span>
          <span className="text-xs font-bold text-primary/60 dark:text-accent/70" aria-hidden>
            →
          </span>
        </Link>

        <Link href="/industry/research-and-testing" className={cardClass}>
          <span className={mediaClass}>
            <Image
              src="/tri-logo-badge.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
          </span>
          <span className="text-[12px] font-bold leading-tight text-primary dark:text-accent">
            Learn about TRI
          </span>
          <span className="text-xs font-bold text-primary/60 dark:text-accent/70" aria-hidden>
            →
          </span>
        </Link>

        <Link href="/" className={cardClass}>
          <span className={mediaClass}>
            <Home className="h-7 w-7 text-primary dark:text-accent" strokeWidth={1.75} aria-hidden />
          </span>
          <span className="text-[12px] font-bold leading-tight text-primary dark:text-accent">
            Go to Home
          </span>
          <span className="text-xs font-bold text-primary/60 dark:text-accent/70" aria-hidden>
            →
          </span>
        </Link>

        <button type="button" onClick={onReset} className={cardClass}>
          <span className={mediaClass}>
            <Send className="h-7 w-7 text-primary dark:text-accent" strokeWidth={1.75} aria-hidden />
          </span>
          <span className="text-[12px] font-bold leading-tight text-primary dark:text-accent">
            Submit Another Inspection
          </span>
          <span className="text-xs font-bold text-primary/60 dark:text-accent/70" aria-hidden>
            →
          </span>
        </button>
      </div>

      {onContinue && (
        <button
          type="button"
          onClick={onContinue}
          className="mt-6 inline-flex min-w-[10rem] items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark dark:bg-accent"
        >
          Continue
        </button>
      )}
    </div>
  );
}
