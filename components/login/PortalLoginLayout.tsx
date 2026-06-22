"use client";

import Link from "next/link";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

interface PortalAuthShellProps {
  children: ReactNode;
}

/** Full-viewport portal shell — no footer, no page scroll */
export function PortalAuthShell({ children }: PortalAuthShellProps) {
  return (
    <div className="flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-background-dark dark:via-section-dark dark:to-background-dark">
      <Navbar />
      <div className="flex flex-1 min-h-0 items-center justify-center overflow-hidden px-4 pb-4 pt-14 sm:px-6 lg:pt-[75px]">
        <div className="w-full max-w-3xl">{children}</div>
      </div>
    </div>
  );
}

interface LoginStepsProps {
  current: 1 | 2 | 3;
  compact?: boolean;
}

export function LoginSteps({ current, compact = false }: LoginStepsProps) {
  const steps = [
    { n: 1, label: "Role" },
    { n: 2, label: "Email" },
    { n: 3, label: "Code" },
  ] as const;

  return (
    <div className={`flex items-center justify-center gap-1 sm:gap-1.5 ${compact ? "mb-2" : "mb-4 gap-1.5 sm:gap-2"}`}>
      {steps.map((step, i) => {
        const done = step.n < current;
        const active = step.n === current;
        return (
          <div key={step.n} className="flex items-center gap-1 sm:gap-1.5">
            <div className="flex items-center gap-1">
              <span
                className={`flex items-center justify-center rounded-full font-black ${
                  compact ? "h-5 w-5 text-[9px]" : "h-6 w-6 text-[10px] sm:h-7 sm:w-7 sm:text-xs"
                } ${
                  done || active
                    ? "bg-primary text-white dark:bg-accent"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {done ? (
                  <span className="material-symbols-outlined text-sm">check</span>
                ) : (
                  step.n
                )}
              </span>
              <span
                className={`hidden text-[10px] font-bold uppercase tracking-wider sm:inline ${
                  active || done ? "text-primary dark:text-accent" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-4 sm:w-8 ${done ? "bg-primary dark:bg-accent" : "bg-gray-200 dark:bg-gray-700"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function PortalAuthCard({
  children,
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border-2 border-gray-200/90 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-100 dark:border-gray-800 dark:bg-section-dark dark:ring-gray-800 sm:rounded-3xl ${
        compact ? "p-4 sm:p-5" : "p-5 sm:p-6 md:p-7"
      }`}
    >
      {children}
    </div>
  );
}

export function PortalAuthHeader({
  title,
  subtitle,
  compact = false,
}: {
  title: string;
  subtitle?: string;
  compact?: boolean;
}) {
  return (
    <div className={`text-center ${compact ? "mb-2.5" : "mb-4 sm:mb-5"}`}>
      {!compact && (
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm dark:bg-accent/10">
          <span className="material-symbols-outlined text-primary dark:text-accent text-2xl">
            lock_person
          </span>
        </div>
      )}
      <h1
        className={`font-black tracking-tight text-gray-900 dark:text-white ${
          compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
        }`}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={`leading-snug text-gray-600 dark:text-gray-400 ${
            compact ? "mt-1 text-[11px] sm:text-xs" : "mt-1.5 text-xs sm:text-sm"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function PortalAuthRoleBadge({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  return (
    <span className={`inline-flex w-full items-center justify-center ${compact ? "mb-2" : "mb-4"}`}>
      <span
        className={`rounded-full border border-primary/20 bg-primary/5 font-bold uppercase tracking-widest text-primary dark:border-accent/30 dark:bg-accent/10 dark:text-accent ${
          compact ? "px-2.5 py-0.5 text-[9px]" : "px-3 py-1 text-[10px]"
        }`}
      >
        {label}
      </span>
    </span>
  );
}

export function PortalAuthTextLink({
  href,
  children,
  onClick,
  compact = false,
}: {
  href?: string;
  children: ReactNode;
  onClick?: () => void;
  compact?: boolean;
}) {
  const className = `${
    compact ? "mt-0" : "mt-1"
  } block w-full text-center text-xs font-semibold text-gray-500 transition hover:text-primary hover:underline dark:text-gray-400 dark:hover:text-accent`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export function PortalAuthButton({
  children,
  loading,
  type = "submit",
  onClick,
  disabled,
}: {
  children: ReactNode;
  loading?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-md shadow-primary/20 transition hover:bg-primary-dark hover:shadow-lg disabled:opacity-60 dark:bg-accent dark:shadow-accent/20 dark:hover:bg-accent-light"
    >
      {loading ? (
        <>
          <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
          Please wait...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function PortalAuthInput({
  icon,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: string }) {
  return (
    <div className="relative">
      {icon && (
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
          {icon}
        </span>
      )}
      <input
        {...props}
        className={`w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-2.5 text-base text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-background-dark dark:text-white dark:focus:border-accent dark:focus:ring-accent/20 ${
          icon ? "pl-10 pr-3" : "px-3"
        } ${className}`}
      />
    </div>
  );
}

export function PortalAuthAlert({
  type,
  children,
  compact = false,
}: {
  type: "error" | "info";
  children: ReactNode;
  compact?: boolean;
}) {
  const styles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
      : "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300";

  return (
    <div
      className={`rounded-lg border text-xs ${compact ? "mb-2 px-2.5 py-1.5" : "mb-3 px-3 py-2 sm:text-sm"} ${styles}`}
    >
      {children}
    </div>
  );
}
