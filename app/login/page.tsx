"use client";

import Link from "next/link";
import {
  PortalAuthShell,
  PortalAuthCard,
  PortalAuthHeader,
  LoginSteps,
} from "@/components/login/PortalLoginLayout";

const ROLES = [
  {
    id: "Adjuster",
    title: "Adjuster",
    desc: "Carrier adjuster portal",
    icon: "shield_person",
  },
  {
    id: "IA",
    title: "Independent Adjuster",
    desc: "IA portal access",
    icon: "business_center",
  },
] as const;

export default function LoginRolePage() {
  return (
    <PortalAuthShell>
      <PortalAuthCard>
        <LoginSteps current={1} />
        <PortalAuthHeader
          title="Client Portal"
          subtitle="Select your role to sign in with a one-time email code."
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {ROLES.map((role) => (
            <Link
              key={role.id}
              href={`/login/sign-in?role=${encodeURIComponent(role.id)}`}
              className="group flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-gray-50/80 p-4 transition-all duration-200 hover:border-primary hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-background-dark dark:hover:border-accent"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition group-hover:bg-primary dark:bg-accent/10 dark:group-hover:bg-accent">
                <span className="material-symbols-outlined text-primary text-xl transition group-hover:text-white dark:text-accent dark:group-hover:text-white">
                  {role.icon}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-gray-900 dark:text-white">{role.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{role.desc}</p>
              </div>
              <span className="material-symbols-outlined text-gray-400 transition group-hover:text-primary dark:group-hover:text-accent">
                chevron_right
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Invite only ·{" "}
          <a href="mailto:claims@trinitypllc.com" className="font-bold text-primary hover:underline dark:text-accent">
            Contact support
          </a>
        </p>
      </PortalAuthCard>
    </PortalAuthShell>
  );
}
