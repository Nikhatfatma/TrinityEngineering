export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width="40" height="35" viewBox="0 0 540 476" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 160L540 0V160H0Z" fill="url(#topGradient)"/>
        <path d="M0 316L540 476V316H0Z" fill="url(#bottomGradient)"/>
        <defs>
          <linearGradient id="topGradient" x1="0" y1="0" x2="540" y2="160">
            <stop offset="0%" stopColor="#000B29"/>
            <stop offset="100%" stopColor="#1E3A8A"/>
          </linearGradient>
          <linearGradient id="bottomGradient" x1="0" y1="476" x2="540" y2="316">
            <stop offset="0%" stopColor="#000B29"/>
            <stop offset="100%" stopColor="#1E3A8A"/>
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-wider text-gray-900 dark:text-white">TRINITY</span>
        <span className="text-xs font-bold tracking-[0.2em] text-gray-700 dark:text-gray-300">ENGINEERING</span>
      </div>
    </div>
  );
}
