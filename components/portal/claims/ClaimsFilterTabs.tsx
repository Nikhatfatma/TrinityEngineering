"use client";

// ================================================================
// ClaimsFilterTabs — Status filter tabs for the claims list
// Props: value (current filter), onChange, counts per bucket
// ================================================================

export type ClaimsFilter = "all" | "active" | "completed" | "cancelled";

const ACTIVE_STATUSES = [
  "new request",
  "tentative",
  "scheduled",
  "reschedule",
  "inspected",
  "revisit required",
  "ready for review",
  "lead engineer seal review",
  "corrections needed",
  "revisions uploaded",
  "additional services",
  "additional services review",
  "attorney services",
  "invoicing",
  "travelers - report sent wait to invoice",
  "payment overdue",
  "paid",
  "on hold",
];
const COMPLETED_STATUSES = ["completed"];
const CANCELLED_STATUSES = ["cancelled", "not accepted", "canceled"];

export function filterClaims<T extends { status: string }>(
  claims: T[],
  filter: ClaimsFilter
): T[] {
  if (filter === "all") return claims;
  return claims.filter((c) => {
    const s = (c.status || "").toLowerCase();
    if (filter === "active") return ACTIVE_STATUSES.includes(s);
    if (filter === "completed") return COMPLETED_STATUSES.includes(s);
    if (filter === "cancelled") return CANCELLED_STATUSES.includes(s);
    return true;
  });
}

interface Tab {
  key: ClaimsFilter;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { key: "all", label: "All Claims", icon: "folder_open" },
  { key: "active", label: "Active", icon: "pending_actions" },
  { key: "completed", label: "Completed", icon: "task_alt" },
  { key: "cancelled", label: "Cancelled", icon: "cancel" },
];

interface ClaimsFilterTabsProps {
  value: ClaimsFilter;
  onChange: (filter: ClaimsFilter) => void;
  counts: Record<ClaimsFilter, number>;
}

export default function ClaimsFilterTabs({
  value,
  onChange,
  counts,
}: ClaimsFilterTabsProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {TABS.map((tab) => {
        const isActive = value === tab.key;
        const count = counts[tab.key];
        return (
          <button
            key={tab.key}
            id={`claims-filter-${tab.key}`}
            onClick={() => onChange(tab.key)}
            className={`
              inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold
              transition-all duration-200 border
              ${
                isActive
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }
            `}
          >
            <span className="material-symbols-outlined text-[15px]">
              {tab.icon}
            </span>
            {tab.label}
            {count > 0 && (
              <span
                className={`
                  ml-0.5 inline-flex h-4 min-w-[1rem] items-center justify-center
                  rounded-full px-1 text-[10px] font-black
                  ${isActive ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"}
                `}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
