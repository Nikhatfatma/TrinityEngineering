"use client";

interface SuccessMessageProps {
  onReset: () => void;
}

function VerifiedBadgeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20"
    >
      <path
        d="M23 12l-2.44-2.79.34-3.69-3.61-1.21L15 2l-3-2.69L9 2 5.71 4.31 2.1 5.52l.34 3.69L0 12l2.44 2.79-.34 3.69 3.61 1.21L9 22l3 2.69L15 22l3.29-2.31 3.61-1.21-.34-3.69L23 12z"
        fill="#2563EB"
      />
      <path
        d="M14.5 15.5l-3.5-3.5 1.41-1.41L14.5 13l4.59-4.59L20.5 9.91 14.5 15.5z"
        fill="white"
      />
    </svg>
  );
}

export default function SuccessMessage(_props: SuccessMessageProps) {
  return (
    <div className="fixed inset-x-0 top-16 bottom-0 z-30 flex flex-col items-center justify-center bg-white px-6 text-center">
      <VerifiedBadgeIcon />

      <h2 className="mt-8 text-lg font-medium tracking-tight text-[#8B9CB3] sm:text-xl">
        Submission successful
      </h2>

      <p className="mt-3 max-w-md text-sm font-normal leading-relaxed text-[#5C6B7F] sm:text-[15px]">
        Our team will review the details and reach out soon.
      </p>
    </div>
  );
}
