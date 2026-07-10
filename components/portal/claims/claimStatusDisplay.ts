// Portal-facing claim status labels (badges, timeline, list).
// Single source of truth for mapping Creator statuses → portal UI.

export const PORTAL_CLAIM_STATUSES = [
  "New Request",
  "Tentative",
  "Scheduled",
  "Rescheduled",
  "Inspected",
  "Ready for Review",
  "Complete",
] as const;

export type PortalClaimStatus = (typeof PORTAL_CLAIM_STATUSES)[number];

const STORAGE_PREFIX = "portal_claim_mapped_status:";

/** Workflow order used to resolve unknown statuses to the nearest valid step. */
const WORKFLOW_ORDER: PortalClaimStatus[] = [
  "New Request",
  "Tentative",
  "Scheduled",
  "Rescheduled",
  "Inspected",
  "Ready for Review",
  "Complete",
];

const STATUS_BADGE: Record<string, string> = {
  "new request": "bg-gray-100 text-gray-600",
  tentative: "bg-amber-100 text-amber-700",
  scheduled: "bg-indigo-100 text-indigo-700",
  rescheduled: "bg-orange-100 text-orange-700",
  inspected: "bg-blue-100 text-blue-700",
  "ready for review": "bg-purple-100 text-purple-700",
  complete: "bg-emerald-100 text-emerald-700",
};

const TIMELINE_NODE_BADGE: Record<string, string> = {
  ...STATUS_BADGE,
  "additional services": "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300",
  "additional services review": "bg-pink-100 text-pink-800 border-pink-300",
  "attorney services": "bg-rose-100 text-rose-800 border-rose-200",
};

/** Exact 1:1 Creator pick-list values → portal label. */
const EXACT_STATUS_MAP: Record<string, PortalClaimStatus> = {
  "new request": "New Request",
  tentative: "Tentative",
  scheduled: "Scheduled",
  reschedule: "Rescheduled",
  rescheduled: "Rescheduled",
  inspected: "Inspected",
  "ready for review": "Ready for Review",
  complete: "Complete",
  completed: "Complete",
};

/** Internal / legacy Creator statuses → nearest portal workflow step. */
const DERIVED_STATUS_MAP: Record<string, PortalClaimStatus> = {
  "revisit required": "Inspected",
  "lead engineer seal review": "Ready for Review",
  "corrections needed": "Ready for Review",
  "revisions uploaded": "Ready for Review",
  invoicing: "Ready for Review",
  "travelers - report sent wait to invoice": "Ready for Review",
  paid: "Complete",
  "payment overdue": "Complete",
  "attorney services": "Complete",
  "additional services": "Complete",
  "additional services review": "Complete",
  "on hold": "Tentative",
  cancelled: "New Request",
  canceled: "New Request",
  "not accepted": "New Request",
};

const ALTERNATE_END_LABELS: Record<string, string> = {
  "attorney services": "Attorney Services",
  "additional services": "Additional Services",
  "additional services review": "Additional Services Review",
};

export type StatusMappingSource =
  | "exact"
  | "derived"
  | "heuristic"
  | "persisted"
  | "fallback";

export interface ResolvedPortalClaimStatus {
  displayLabel: PortalClaimStatus;
  mappingSource: StatusMappingSource;
  showRescheduleStep: boolean;
  alternateEndLabel?: string;
}

function workflowRank(label: PortalClaimStatus): number {
  return WORKFLOW_ORDER.indexOf(label);
}

function isPortalClaimStatus(value: string): value is PortalClaimStatus {
  return (PORTAL_CLAIM_STATUSES as readonly string[]).includes(value);
}

function readPersistedStatus(claimKey?: string): PortalClaimStatus | null {
  if (!claimKey || typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${claimKey}`);
    if (stored && isPortalClaimStatus(stored)) return stored;
  } catch {
    // Ignore storage errors (private mode, quota, etc.)
  }
  return null;
}

function writePersistedStatus(claimKey: string, label: PortalClaimStatus): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${claimKey}`, label);
  } catch {
    // Ignore storage errors
  }
}

/** Keyword heuristics for unrecognized Creator values. */
function inferStatusFromKeywords(raw: string): PortalClaimStatus | null {
  const s = raw.toLowerCase();
  if (s.includes("complete") || s.includes("paid") || s.includes("final")) return "Complete";
  if (s.includes("review") || s.includes("revision") || s.includes("correction") || s.includes("invoice")) {
    return "Ready for Review";
  }
  if (s.includes("inspect") || s.includes("revisit")) return "Inspected";
  if (s.includes("reschedul")) return "Rescheduled";
  if (s.includes("schedul")) return "Scheduled";
  if (s.includes("tentative") || s.includes("hold")) return "Tentative";
  if (s.includes("cancel") || s.includes("reject") || s.includes("not accept")) return "New Request";
  return null;
}

function buildResolved(
  label: PortalClaimStatus,
  mappingSource: StatusMappingSource,
  rawLower: string,
  alternateEndLabel?: string
): ResolvedPortalClaimStatus {
  return {
    displayLabel: label,
    mappingSource,
    showRescheduleStep: label === "Rescheduled",
    alternateEndLabel,
  };
}

/** Try exact → derived → keyword. Returns null when Creator status cannot be mapped. */
function tryMapCreatorStatus(raw: string): ResolvedPortalClaimStatus | null {
  const s = (raw || "").trim().toLowerCase();

  if (!s) {
    return buildResolved("New Request", "exact", s);
  }

  if (EXACT_STATUS_MAP[s]) {
    return buildResolved(EXACT_STATUS_MAP[s], "exact", s, ALTERNATE_END_LABELS[s]);
  }

  if (DERIVED_STATUS_MAP[s]) {
    return buildResolved(DERIVED_STATUS_MAP[s], "derived", s, ALTERNATE_END_LABELS[s]);
  }

  const heuristic = inferStatusFromKeywords(s);
  if (heuristic) {
    return buildResolved(heuristic, "heuristic", s);
  }

  return null;
}

/**
 * Resolve Creator status for portal UI.
 * 1. exact → derived → keyword
 * 2. if mapped: save as last known step for this claim
 * 3. if unmapped: keep last known step (persisted) — do not jump
 * 4. first visit with unmapped status: New Request
 */
export function resolvePortalClaimStatus(
  raw: string,
  claimKey?: string
): ResolvedPortalClaimStatus {
  const mapped = tryMapCreatorStatus(raw);

  if (mapped) {
    if (claimKey) writePersistedStatus(claimKey, mapped.displayLabel);
    return mapped;
  }

  if (claimKey) {
    const persisted = readPersistedStatus(claimKey);
    if (persisted) {
      return buildResolved(persisted, "persisted", (raw || "").trim().toLowerCase());
    }
  }

  return buildResolved("New Request", "fallback", (raw || "").trim().toLowerCase());
}

export function getPortalClaimStatusDisplay(
  raw: string,
  claimKey?: string
): PortalClaimStatus {
  return resolvePortalClaimStatus(raw, claimKey).displayLabel;
}

export function getPortalClaimStatusBadgeClass(displayStatus: string): string {
  return STATUS_BADGE[(displayStatus || "").toLowerCase()] || "bg-primary/10 text-primary";
}

export function getPortalTimelineNodeBadgeClass(label: string): string {
  return TIMELINE_NODE_BADGE[(label || "").toLowerCase()] || "bg-gray-100 text-gray-600 border-gray-200";
}

/** Build ordered timeline labels for a claim (core path + optional steps). */
export function buildClaimTimelineLabels(resolved: ResolvedPortalClaimStatus): string[] {
  const labels: string[] = [
    "New Request",
    "Tentative",
    "Scheduled",
    ...(resolved.showRescheduleStep ? ["Rescheduled"] : []),
    "Inspected",
    "Ready for Review",
    "Complete",
  ];

  if (resolved.alternateEndLabel) {
    labels.push(resolved.alternateEndLabel);
  }

  return labels;
}

/** Index of the active timeline node for the resolved portal label. */
export function getClaimTimelineActiveIndex(
  timelineLabels: string[],
  resolved: ResolvedPortalClaimStatus
): number {
  if (resolved.alternateEndLabel) {
    return timelineLabels.length - 1;
  }

  const target = resolved.displayLabel;
  const exactIdx = timelineLabels.findIndex(
    (label) => label.toLowerCase() === target.toLowerCase()
  );
  if (exactIdx >= 0) return exactIdx;

  const targetRank = workflowRank(target);
  let bestIdx = 0;
  let bestRank = -1;

  timelineLabels.forEach((label, idx) => {
    const rank = workflowRank(label as PortalClaimStatus);
    if (rank >= 0 && rank <= targetRank && rank >= bestRank) {
      bestRank = rank;
      bestIdx = idx;
    }
  });

  return bestIdx;
}

/** Compact stage bar (mobile list) — same seven portal labels. */
export const PORTAL_STAGE_BAR: { label: PortalClaimStatus; key: string }[] = [
  { key: "new", label: "New Request" },
  { key: "tentative", label: "Tentative" },
  { key: "scheduled", label: "Scheduled" },
  { key: "inspected", label: "Inspected" },
  { key: "review", label: "Ready for Review" },
  { key: "complete", label: "Complete" },
];

export function getPortalStageBarActiveIndex(raw: string, claimKey?: string): number {
  const resolved = resolvePortalClaimStatus(raw, claimKey);
  const rank = workflowRank(resolved.displayLabel);

  const barRank =
    resolved.displayLabel === "Rescheduled"
      ? workflowRank("Scheduled")
      : rank;

  let bestIdx = 0;
  PORTAL_STAGE_BAR.forEach((stage, idx) => {
    const stageRank = workflowRank(stage.label);
    if (stageRank >= 0 && stageRank <= barRank && stageRank >= workflowRank(PORTAL_STAGE_BAR[bestIdx].label)) {
      bestIdx = idx;
    }
  });

  return bestIdx;
}

/** Prefer claim id; fall back to claim number for persistence key. */
export function getClaimPersistenceKey(claim: {
  id?: string;
  claimNumber?: string;
}): string | undefined {
  const id = (claim.id || "").trim();
  if (id) return id;
  const claimNumber = (claim.claimNumber || "").trim();
  return claimNumber || undefined;
}
