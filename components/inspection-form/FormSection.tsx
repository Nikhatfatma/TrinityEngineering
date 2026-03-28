"use client";

import React from "react";

interface FormSectionProps {
  title?: string;
  icon?: React.ElementType;
  subtitle?: string;
  optional?: boolean;
  children: React.ReactNode;
}

export default function FormSection({
  title,
  icon: Icon,
  subtitle,
  optional = false,
  children,
}: FormSectionProps) {
  return (
    <section className="animate-fadeIn">
      {/* 
         Section Header removed as per user request to hide title, subtitle, and icon.
         Props are kept optional for backward compatibility and to avoid TS errors.
      */}
      <div className="space-y-2">
        {children}
      </div>
    </section>
  );
}
