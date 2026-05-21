type SectionDividerProps = {
  /** Tailwind via color, e.g. via-[#0047AB] */
  viaClass: string;
  className?: string;
};

/** Wide gradient line — no diamond accent */
export default function SectionDivider({ viaClass, className = "mb-6" }: SectionDividerProps) {
  return (
    <div
      className={`mx-auto hidden w-full max-w-[280px] items-center justify-center sm:max-w-[380px] md:max-w-[520px] lg:flex ${className}`}
    >
      <div
        className={`w-full h-[3px] rounded-full bg-gradient-to-r from-transparent ${viaClass} to-transparent`}
      />
    </div>
  );
}
