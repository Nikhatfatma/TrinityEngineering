"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, HelpCircle, X } from "lucide-react";
import { SERVICE_ADD_ONS } from "./serviceAddOnsContent";

function renderServiceTitle(title: string) {
  if (!title.includes("™")) return title;

  const [before, after] = title.split("™");
  return (
    <>
      {before}
      <span className="text-[0.8em] font-bold leading-none [vertical-align:0.1em]">
        ™
      </span>
      {after}
    </>
  );
}

function ServiceAddOnLogo({
  src,
  hoverSrc,
  alt,
  variant = "default",
  selected = false,
}: {
  src: string;
  hoverSrc?: string;
  alt: string;
  variant?: "swi" | "tri" | "default";
  selected?: boolean;
}) {
  if (variant === "swi" && hoverSrc) {
    return (
      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center bg-transparent sm:h-28 sm:w-28">
        <img
          src={src}
          srcSet={`${src} 1x, ${src.replace(".png", "@2x.png")} 2x`}
          alt={alt}
          width={256}
          height={256}
          decoding="async"
          className={`h-full w-full object-contain transition-opacity duration-200 ${
            selected ? "opacity-0" : "group-hover:opacity-0"
          }`}
        />
        <img
          src={hoverSrc}
          srcSet={`${hoverSrc} 1x, ${hoverSrc.replace(".png", "@2x.png")} 2x`}
          alt=""
          aria-hidden
          width={256}
          height={256}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-contain transition-all duration-200 ${
            selected ? "scale-110 opacity-100" : "opacity-0 group-hover:scale-110 group-hover:opacity-100"
          }`}
        />
      </div>
    );
  }

  if (variant === "tri") {
    return (
      <div
        className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full transition-colors duration-200 sm:h-28 sm:w-28 ${
          selected ? "bg-white" : "bg-transparent group-hover:bg-white"
        }`}
      >
        <img
          src={src}
          srcSet={`${src} 1x, ${src.replace(".png", "@2x.png")} 2x`}
          alt={alt}
          width={256}
          height={256}
          decoding="async"
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  if (variant === "swi") {
    return (
      <div className="flex h-24 w-24 shrink-0 items-center justify-center bg-transparent sm:h-28 sm:w-28">
        <img
          src={src}
          srcSet={`${src} 1x, ${src.replace(".png", "@2x.png")} 2x`}
          alt={alt}
          width={256}
          height={256}
          decoding="async"
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center sm:h-24 sm:w-24">
      <img
        src={src}
        srcSet={`${src} 1x, ${src.replace(".png", "@2x.png")} 2x`}
        alt={alt}
        width={256}
        height={256}
        decoding="async"
        className="h-full w-full rounded-full object-contain shadow-sm"
      />
    </div>
  );
}

function renderDescriptionParagraph(paragraph: string, highlightPhrase: string) {
  const index = paragraph.indexOf(highlightPhrase);
  if (index === -1) return paragraph;

  const before = paragraph.slice(0, index);
  const after = paragraph.slice(index + highlightPhrase.length);

  return (
    <>
      {before}
      <span className="font-bold text-gray-900 dark:text-white">
        {renderServiceTitle(highlightPhrase)}
      </span>
      {after}
    </>
  );
}

interface ServiceAddOnsProps {
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export default function ServiceAddOns({ selectedIds, onChange }: ServiceAddOnsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeAddon = SERVICE_ADD_ONS.find((item) => item.id === activeId) ?? null;

  useEffect(() => {
    if (!activeId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeId]);

  const handleToggle = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((current) => current !== id)
        : [...selectedIds, id]
    );
  };

  return (
    <div className="animate-fadeIn">
      <div className="mx-auto w-full max-w-2xl">
        <ul className="space-y-4 text-left">
          {SERVICE_ADD_ONS.map((addon) => {
            const isSelected = selectedIds.includes(addon.id);

            return (
              <li
                key={addon.id}
                className={`group flex min-h-[5.5rem] cursor-pointer flex-col gap-2 rounded-2xl border px-5 py-5 transition-colors sm:gap-3 sm:px-7 sm:py-6 ${
                  isSelected
                    ? "border-[#0047AB] bg-[#0047AB]"
                    : "border-gray-200 bg-gray-50 hover:border-[#003E97] hover:bg-[#003E97] dark:border-gray-700 dark:bg-background-dark/60 dark:hover:border-[#003E97] dark:hover:bg-[#003E97]"
                }`}
                onClick={() => handleToggle(addon.id)}
              >
                <div className="flex items-center justify-between gap-4 sm:gap-5">
                  <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                    {"logoSrc" in addon && addon.logoSrc ? (
                      <ServiceAddOnLogo
                        src={addon.logoSrc}
                        hoverSrc={"logoHoverSrc" in addon ? addon.logoHoverSrc : undefined}
                        alt={addon.logoAlt}
                        variant={addon.id === "swi" ? "swi" : addon.id === "tri" ? "tri" : "default"}
                        selected={isSelected}
                      />
                    ) : (
                      <div className="h-20 w-20 shrink-0 sm:h-24 sm:w-24" aria-hidden />
                    )}
                    <span
                      className={`pl-2 text-left text-lg font-semibold leading-snug sm:pl-3 sm:text-xl ${
                        isSelected
                          ? "text-white"
                          : "text-gray-900 group-hover:text-white dark:text-white"
                      }`}
                    >
                      {renderServiceTitle(addon.title)}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    name={`serviceAddOn-${addon.id}`}
                    value={addon.id}
                    checked={isSelected}
                    onChange={() => handleToggle(addon.id)}
                    onClick={(event) => event.stopPropagation()}
                    className={`h-4 w-4 shrink-0 cursor-pointer accent-[#0047AB] ${
                      isSelected ? "accent-white" : "group-hover:accent-white"
                    }`}
                    aria-label={`${isSelected ? "Deselect" : "Select"} ${addon.title}`}
                  />
                </div>
                <div className="-mt-1 flex w-full justify-center sm:-mt-2">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveId(addon.id);
                    }}
                    className={`inline-flex shrink-0 items-center justify-center transition-colors ${
                      isSelected ? "text-white" : "text-[#0047AB] group-hover:text-white"
                    }`}
                    aria-label={`Learn more about ${addon.title}`}
                  >
                    <HelpCircle className="h-4 w-4" strokeWidth={2.25} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {activeAddon && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8"
          onClick={() => setActiveId(null)}
          role="presentation"
        >
          <div
            className="relative w-full max-w-xl rounded-2xl bg-white p-6 text-left shadow-2xl dark:bg-section-dark sm:p-8"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-addon-modal-heading"
          >
            <button
              type="button"
              onClick={() => setActiveId(null)}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              id="service-addon-modal-heading"
              className="space-y-4 pr-10 text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-base"
            >
              {activeAddon.description.split("\n\n").map((paragraph) => (
                <p key={paragraph}>
                  {renderDescriptionParagraph(paragraph, activeAddon.highlightPhrase)}
                </p>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Link
                href={activeAddon.learnMoreHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#0047AB] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#003580] sm:w-auto"
                aria-label={`Learn more about ${activeAddon.title}`}
              >
                Learn more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
