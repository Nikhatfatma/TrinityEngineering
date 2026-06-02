type SectionDividerProps = {
  /** Tailwind via color, e.g. via-[#0047AB] */
  viaClass: string;
  className?: string;
};

/** Wide gradient line above section headings */
export default function SectionDivider({ viaClass, className = "mb-6" }: SectionDividerProps) {
  return (
    <div
      className={`mx-auto flex w-full max-w-3xl items-center justify-center sm:max-w-4xl md:max-w-5xl lg:max-w-6xl ${className}`}
    >
      <div
        className={`h-[3px] w-full rounded-full bg-gradient-to-r from-transparent sm:h-[4px] ${viaClass} to-transparent`}
      />
    </div>
  );
}
