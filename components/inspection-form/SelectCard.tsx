"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";

interface SelectCardProps {
  label: string;
  value: string;
  image: string;
  selected: boolean;
  onSelect: () => void;
  dimmed?: boolean;
  horizontal?: boolean;
  containImage?: boolean;
  compactImage?: boolean;
  tooltip?: string;
}

export default function SelectCard({
  label,
  image,
  selected,
  onSelect,
  dimmed = false,
  horizontal = false,
  containImage = false,
  compactImage = false,
  tooltip,
}: SelectCardProps) {
  const tooltipId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [isTouchLike, setIsTouchLike] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setIsTouchLike(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!helpOpen) return;

    const close = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setHelpOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setHelpOpen(false);
    };

    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [helpOpen]);

  const showHelp = Boolean(tooltip && helpOpen);

  const openHelp = useCallback(() => {
    if (tooltip) setHelpOpen(true);
  }, [tooltip]);

  const closeHelp = useCallback(() => {
    setHelpOpen(false);
  }, []);

  const toggleHelp = useCallback(
    (event: React.MouseEvent) => {
      if (!tooltip || !isTouchLike) return;
      event.stopPropagation();
      event.preventDefault();
      setHelpOpen((open) => !open);
    },
    [tooltip, isTouchLike],
  );

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      onMouseEnter={() => {
        if (!isTouchLike) openHelp();
      }}
      onMouseLeave={() => {
        if (!isTouchLike) closeHelp();
      }}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-describedby={showHelp ? tooltipId : undefined}
        className={`group/card relative flex w-full transition-all duration-300 border ${horizontal ? "flex-row items-center h-12 rounded-lg overflow-hidden" : containImage ? "flex-col items-stretch rounded-lg overflow-hidden text-center" : "flex-col items-center rounded-lg text-center overflow-hidden"
          } ${selected
            ? "border-[3px] border-primary z-10 scale-[1.05] shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark hover:shadow-lg hover:-translate-y-0.5 shadow-sm"
          } ${dimmed && !selected ? "scale-[0.98]" : "opacity-100"}`}
      >
        <div
          className={`relative flex-shrink-0 ${
            horizontal
              ? "h-full w-16 overflow-hidden border-r border-gray-100 dark:border-gray-800"
              : containImage
                ? compactImage
                  ? "flex h-[5.25rem] w-full shrink-0 items-center justify-center overflow-hidden bg-white sm:h-[5.5rem] md:h-[6.25rem]"
                  : "flex h-[5.75rem] w-full shrink-0 items-center justify-center overflow-hidden bg-white sm:h-24 md:h-[6.75rem]"
                : "h-20 w-full overflow-hidden md:h-24"
          }`}
        >
          <Image
            src={image}
            alt={label}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`transition-transform duration-500 ${containImage ? "" : "group-hover/card:scale-105"} ${
              containImage
                ? `origin-center object-contain object-center ${compactImage ? "scale-[0.66]" : "scale-[1.24]"}`
                : "object-cover"
            } ${dimmed && !selected && !containImage ? "opacity-50" : "opacity-100"} ${dimmed && !selected && containImage ? "opacity-40" : ""}`}
          />

          {dimmed && !selected && !containImage && (
            <div className="absolute inset-0 z-0 bg-black/60" aria-hidden />
          )}

          {selected && !containImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`${horizontal ? "w-4 h-4" : "w-6 h-6"} rounded-full bg-primary flex items-center justify-center shadow-md animate-scaleIn`}>
                <Check className="text-white w-2.5 h-2.5" strokeWidth={3} />
              </div>
            </div>
          )}
        </div>

        {selected && containImage && (
          <div className="absolute right-2 top-2 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow-md animate-scaleIn">
            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
          </div>
        )}

        <div
          className={`relative z-10 w-full shrink-0 bg-white dark:bg-background-dark ${horizontal ? "flex items-center px-3 h-full" : containImage ? "px-2 py-2 min-h-[2.75rem] text-center" : "px-2 py-1.5 min-h-[2.75rem]"}`}
        >
          <div className={`flex w-full gap-1.5 ${containImage ? "flex-col items-center justify-center" : "items-start justify-between"}`}>
            <span
              className={`text-xs font-bold leading-tight block transition-colors ${containImage ? "text-center" : ""} ${selected ? "text-primary dark:text-accent" : "text-gray-700 dark:text-gray-300"
                }`}
            >
              {label}
            </span>
            {tooltip && isTouchLike && (
              <span
                role="button"
                tabIndex={0}
                onClick={toggleHelp}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    setHelpOpen((open) => !open);
                  }
                }}
                className={`${containImage ? "mt-0" : "mt-0.5"} shrink-0 text-[10px] font-bold uppercase tracking-wide underline-offset-2 transition-colors ${showHelp ? "text-primary underline dark:text-accent" : "text-primary/60 hover:text-primary dark:text-accent/60 dark:hover:text-accent"}`}
              >
                Info
              </span>
            )}
          </div>

          {tooltip && (
            <div
              id={tooltipId}
              role="tooltip"
              aria-hidden={!showHelp}
              className={`grid transition-[grid-template-rows,opacity,margin] duration-200 ease-out ${showHelp ? "mt-1.5 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <p className="rounded-md border border-primary/10 bg-primary/[0.04] px-2 py-1.5 text-[10px] font-normal leading-snug text-gray-600 dark:border-accent/15 dark:bg-accent/[0.06] dark:text-gray-300">
                  {tooltip}
                </p>
              </div>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
