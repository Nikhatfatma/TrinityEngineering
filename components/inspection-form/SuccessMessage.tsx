"use client";

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

export default function SuccessMessage({ onContinue }: SuccessMessageProps) {
  return (
    <div className="fixed inset-x-0 top-16 bottom-0 z-30 flex flex-col items-center justify-center bg-white px-6 text-center">
      <VerifiedBadgeIcon />

      <h2 className="mt-6 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
        Submission successful
      </h2>

      <p className="mt-3 max-w-md text-sm font-normal leading-relaxed text-gray-700 sm:text-base">
        Our team will review the details and reach out soon.
      </p>

      {onContinue && (
        <button
          type="button"
          onClick={onContinue}
          className="mt-8 inline-flex min-w-[10rem] items-center justify-center rounded-md bg-[#0047AB] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#003580]"
        >
          Continue
        </button>
      )}
    </div>
  );
}
