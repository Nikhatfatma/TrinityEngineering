"use client";

// ================================================================
// StatusTracker — Renders standard stage bar or 20-node flowchart
// ================================================================

interface Stage {
  key: string;
  label: string;
  statuses: string[];
  description: string;
}

const STAGES: Stage[] = [
  {
    key: "new",
    label: "New Request",
    statuses: ["new request"],
    description: "Your inspection request has been received and is being reviewed by our team.",
  },
  {
    key: "tentative",
    label: "Tentative",
    statuses: ["tentative"],
    description: "A date is being considered — our scheduling team will confirm shortly.",
  },
  {
    key: "scheduled",
    label: "Scheduled",
    statuses: ["scheduled", "reschedule"],
    description: "Your inspection is confirmed and on the schedule. We will be in touch with details.",
  },
  {
    key: "inspected",
    label: "Inspected",
    statuses: ["inspected", "revisit required"],
    description: "The on-site inspection is complete. Your report is now being prepared.",
  },
  {
    key: "review",
    label: "In Review",
    statuses: [
      "ready for review",
      "lead engineer seal review",
      "corrections needed",
      "revisions uploaded",
      "additional services",
      "additional services review",
      "attorney services",
    ],
    description: "Your inspection report is undergoing engineering review and quality checks.",
  },
  {
    key: "invoicing",
    label: "Invoicing",
    statuses: [
      "invoicing",
      "travelers - report sent wait to invoice",
      "payment overdue",
    ],
    description: "Your report is finalised and an invoice has been issued.",
  },
  {
    key: "completed",
    label: "Completed",
    statuses: ["completed", "paid"],
    description: "Your report is finalised and your account is settled. Thank you!",
  },
];

const ON_HOLD_STATUSES = ["on hold"];
const CANCELLED_STATUSES = ["cancelled", "not accepted", "canceled"];

const SUB_STATUS_COPY: Record<string, string> = {
  reschedule: "Your inspection is being rescheduled — we will reach out to confirm a new date.",
  "revisit required": "A revisit inspection has been requested. We will contact you to schedule.",
  "corrections needed": "Corrections have been requested on your report. Our team is working on them.",
  "revisions uploaded": "Revised report has been uploaded and is pending re-review.",
  "lead engineer seal review": "Your report is with the Lead Engineer for final seal and approval.",
  "additional services": "Additional services have been identified and are being arranged.",
  "additional services review": "Additional services are currently under review.",
  "attorney services": "Your file has been escalated to our attorney services team.",
  "travelers - report sent wait to invoice": "Your report has been sent to Travelers. We are waiting before issuing the invoice.",
  "payment overdue": "Your invoice is past due. Please contact us to resolve the outstanding balance.",
};

const ALL_STATUSES = [
  "New Request",
  "Tentative",
  "Scheduled",
  "Reschedule",
  "Inspected",
  "Ready for Review",
  "Lead Engineer Seal Review",
  "Corrections Needed",
  "Revisions Uploaded",
  "Invoicing",
  "Travelers - Report Sent Wait to Invoice",
  "Completed",
  "Payment Overdue",
  "Paid",
  "Additional Services",
  "Additional Services Review",
  "Revisit Required",
  "Attorney Services",
  "On Hold",
  "Cancelled",
];

const STATUS_BADGE: Record<string, string> = {
  "new request":                              "bg-gray-100 text-gray-700 border-gray-300",
  tentative:                                  "bg-amber-100 text-amber-800 border-amber-300",
  scheduled:                                  "bg-indigo-100 text-indigo-800 border-indigo-300",
  reschedule:                                 "bg-orange-100 text-orange-800 border-orange-300",
  inspected:                                  "bg-blue-100 text-blue-800 border-blue-300",
  "ready for review":                         "bg-purple-100 text-purple-800 border-purple-300",
  "lead engineer seal review":                "bg-violet-100 text-violet-800 border-violet-300",
  "corrections needed":                       "bg-red-100 text-red-800 border-red-300",
  "revisions uploaded":                       "bg-sky-100 text-sky-800 border-sky-300",
  invoicing:                                  "bg-cyan-100 text-cyan-800 border-cyan-300",
  "travelers - report sent wait to invoice":  "bg-teal-100 text-teal-800 border-teal-300",
  completed:                                  "bg-emerald-100 text-emerald-800 border-emerald-300",
  "payment overdue":                          "bg-red-100 text-red-800 border-red-300",
  paid:                                       "bg-green-100 text-green-800 border-green-300",
  "additional services":                      "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300",
  "additional services review":               "bg-pink-100 text-pink-800 border-pink-300",
  "revisit required":                         "bg-orange-100 text-orange-800 border-orange-300",
  "attorney services":                        "bg-rose-100 text-rose-800 border-rose-200",
  "on hold":                                  "bg-amber-100 text-amber-800 border-amber-300",
  cancelled:                                  "bg-red-100 text-red-800 border-red-300",
  "not accepted":                             "bg-red-100 text-red-800 border-red-300",
};

const SIMULATED_DURATIONS = [
  "2 hrs", "1 day", "2 days", "3 hrs", "1 day",
  "2 days", "12 hrs", "1 day", "18 hrs", "1 day",
  "4 hrs", "2 days", "1 day", "6 hrs", "1 day",
  "12 hrs", "2 days", "1 day", "3 hrs"
];

const SIMULATED_MODIFIERS = [
  "System Auto", "Coordinator", "Field Admin", "Inspector", "QA Editor",
  "Lead Engineer", "System Auto", "Field Admin", "Inspector", "Accounting",
  "System Auto", "Collections", "Accounting", "Billing", "Manager Review",
  "Attorney Team", "Manager", "Coordinator", "System Auto"
];

function getActiveStageIndex(status: string): number {
  const s = (status || "").trim().toLowerCase();
  for (let i = 0; i < STAGES.length; i++) {
    if (STAGES[i].statuses.includes(s)) return i;
  }
  return 0;
}

interface StatusTrackerProps {
  status: string;
  variant?: "bar" | "flow";
}

export default function StatusTracker({ status, variant = "bar" }: StatusTrackerProps) {
  const s = (status || "").trim();
  const sLower = s.toLowerCase();
  const cancelled = CANCELLED_STATUSES.includes(sLower);
  const onHold = ON_HOLD_STATUSES.includes(sLower);
  const subCopy = SUB_STATUS_COPY[sLower];

  // ── Render 20-Node Serpentine Flowchart ─────────────────────────────────────
  if (variant === "flow") {
    // Find active index in ALL_STATUSES
    const activeIndex = ALL_STATUSES.findIndex(
      (item) => item.toLowerCase() === sLower || (sLower === "not accepted" && item.toLowerCase() === "cancelled")
    );

    const rowsCount = Math.ceil(ALL_STATUSES.length / 3);
    const rowHeight = 110;

    return (
      <div className="w-full overflow-x-auto pb-4">
        <style>{`
          @keyframes flowAnim {
            to { stroke-dashoffset: -8; }
          }
          .animate-flow {
            animation: flowAnim 1s linear infinite;
          }
          @keyframes pulseSoft {
            0%, 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
            50% { box-shadow: 0 0 0 6px rgba(37, 99, 235, 0); }
          }
          .animate-pulse-soft {
            animation: pulseSoft 2s infinite;
          }
        `}</style>

        {/* SVG Marker Definitions */}
        <svg className="absolute w-0 h-0" fill="none">
          <defs>
            <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <polygon points="0,1 8,4 0,7" className="fill-primary" />
            </marker>
            <marker id="arrow-gray" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <polygon points="0,1 8,4 0,7" className="fill-gray-300" />
            </marker>
          </defs>
        </svg>

        <div
          style={{ height: `${rowsCount * rowHeight}px` }}
          className="relative min-w-[460px] w-[calc(100%-32px)] mx-auto mt-4"
        >
          {ALL_STATUSES.map((label, idx) => {
            const isCurrent = idx === activeIndex || (activeIndex === -1 && idx === 0);
            const isDone = activeIndex !== -1 && idx < activeIndex;
            const isPending = activeIndex !== -1 && idx > activeIndex;

            const row = Math.floor(idx / 3);
            const col = row % 2 === 0 ? idx % 3 : 2 - (idx % 3);

            const leftPos = col * 37; // Node width is 26%, gap is 11% (Col 0: 0%, Col 1: 37%, Col 2: 74%)
            const topPos = row * rowHeight;

            // Get badge color styling
            const nodeKey = label.toLowerCase();
            const badgeStyle = STATUS_BADGE[nodeKey] || "bg-gray-100 text-gray-600 border-gray-200";

            return (
              <div key={label}>
                {/* Node Box */}
                <div
                  style={{
                    position: "absolute",
                    left: `${leftPos}%`,
                    top: `${topPos}px`,
                    width: "26%",
                    height: "70px",
                  }}
                  className={`
                    flex flex-col justify-center items-center rounded-xl p-2 border transition-all duration-300 text-center hover:-translate-y-0.5 hover:shadow-md cursor-default
                    ${
                      isCurrent
                        ? `${badgeStyle} border-2 font-black scale-105 shadow-lg ring-4 ring-primary/20 z-20 animate-pulse-soft`
                        : isDone
                        ? "bg-primary/5 text-primary border-primary/20 shadow-sm"
                        : "bg-gray-50/50 text-gray-400 border-dashed border-gray-200 opacity-80 hover:opacity-100"
                    }
                  `}
                >
                  <span className="material-symbols-outlined text-[16px] mb-0.5">
                    {isCurrent ? "stars" : isDone ? "check_circle" : "pending"}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold leading-tight line-clamp-2 px-0.5">
                    {label}
                  </span>
                  {isCurrent && (
                    <span className="text-[7px] font-black tracking-wider uppercase bg-primary text-white rounded px-1 mt-0.5">
                      Current
                    </span>
                  )}
                </div>

                {/* Connector Arrow to next node */}
                {idx < ALL_STATUSES.length - 1 && (() => {
                  const nextRow = Math.floor((idx + 1) / 3);
                  const nextCol = nextRow % 2 === 0 ? (idx + 1) % 3 : 2 - ((idx + 1) % 3);

                  const isConnDone = idx < activeIndex;
                  const markerSuffix = isConnDone ? "active" : "gray";
                  const strokeColor = isConnDone ? "stroke-primary" : "stroke-gray-300";

                  const duration = SIMULATED_DURATIONS[idx] || "—";
                  const modifier = SIMULATED_MODIFIERS[idx] || "—";

                  if (row === nextRow) {
                    // Horizontal arrow
                    const isRight = nextCol > col;
                    const arrowLeft = isRight ? col * 37 + 26 : nextCol * 37 + 26;
                    const lineX1 = isRight ? "0" : "100%";
                    const lineX2 = isRight ? "100%" : "0";

                    return (
                      <div
                        style={{
                          position: "absolute",
                          left: `${arrowLeft}%`,
                          width: "11%",
                          top: `${row * rowHeight + 35 - 16}px`,
                          height: "32px",
                        }}
                        className="pointer-events-none z-10"
                      >
                        {isConnDone && (
                          <div className="absolute top-0 left-0 right-0 text-[7px] font-black text-primary/70 text-center select-none truncate">
                            {duration}
                          </div>
                        )}
                        <svg className="absolute top-4 left-0 w-full h-2 overflow-visible" fill="none">
                          <line
                            x1={lineX1}
                            y1="4"
                            x2={lineX2}
                            y2="4"
                            strokeLinecap="round"
                            className={`${strokeColor} stroke-[2] ${!isConnDone ? "animate-flow" : ""}`}
                            style={{ strokeDasharray: isConnDone ? "none" : "4,4" }}
                            markerEnd={`url(#arrow-${markerSuffix})`}
                          />
                        </svg>
                        {isConnDone && (
                          <div className="absolute bottom-0 left-0 right-0 text-[7px] text-gray-400 text-center select-none truncate">
                            {modifier}
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    // Vertical down arrow
                    return (
                      <div
                        style={{
                          position: "absolute",
                          left: `calc(${col * 37 + 13}% - 40px)`,
                          width: "80px",
                          top: `${row * rowHeight + 70}px`,
                          height: "40px",
                        }}
                        className="pointer-events-none z-10"
                      >
                        {isConnDone && (
                          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[35px] text-right text-[7px] font-black text-primary/70 truncate select-none">
                            {duration}
                          </div>
                        )}
                        <svg className="absolute inset-0 w-full h-full overflow-visible" fill="none">
                          <line
                            x1="40"
                            y1="0"
                            x2="40"
                            y2="100%"
                            strokeLinecap="round"
                            className={`${strokeColor} stroke-[2] ${!isConnDone ? "animate-flow" : ""}`}
                            style={{ strokeDasharray: isConnDone ? "none" : "4,4" }}
                            markerEnd={`url(#arrow-${markerSuffix})`}
                          />
                        </svg>
                        {isConnDone && (
                          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[35px] text-left text-[7px] text-gray-400 truncate select-none">
                            {modifier}
                          </div>
                        )}
                      </div>
                    );
                  }
                })()}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Render 7-Stage Pizza Tracker Bar (Dashboard Cards / Variant Bar) ─────────
  if (cancelled) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg className="h-4.5 w-4.5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-bold text-red-700">{s}</p>
            <p className="text-[10px] text-red-500 mt-0.5">
              This request was cancelled or not accepted.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (onHold) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
            <span className="material-symbols-outlined text-amber-500 text-lg">pause_circle</span>
          </span>
          <div>
            <p className="text-xs font-bold text-amber-700">On Hold</p>
            <p className="text-[10px] text-amber-600 mt-0.5">
              This inspection is temporarily placed on hold.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeIdx = getActiveStageIndex(s);
  const activeStage = STAGES[activeIdx] ?? STAGES[0];
  const linePct = activeIdx === 0 ? 0 : (activeIdx / (STAGES.length - 1)) * 100;

  return (
    <div className="space-y-3">
      {subCopy && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/30 px-3 py-2">
          <span className="material-symbols-outlined text-amber-500 text-[16px] flex-shrink-0 mt-0.5">
            info
          </span>
          <p className="text-[10px] font-semibold text-amber-700 leading-relaxed">
            {subCopy}
          </p>
        </div>
      )}

      {/* Tracker bar */}
      <div className="relative overflow-x-auto pb-1">
        <div className="min-w-[380px] sm:min-w-0">
          {/* Background connector line */}
          <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-gray-200" />
          {/* Progress fill */}
          {activeIdx > 0 && (
            <div
              className="absolute top-3.5 left-4 h-0.5 bg-primary transition-all duration-500"
              style={{ width: `calc(${linePct}% * (100% - 2rem) / 100)` }}
            />
          )}

          <div className="relative flex items-start justify-between">
            {STAGES.map((stage, idx) => {
              const isDone = idx < activeIdx;
              const isActive = idx === activeIdx;

              return (
                <div key={stage.key} className="flex flex-col items-center gap-1 flex-1">
                  {/* Circle */}
                  <div
                    className={`relative z-10 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      isDone
                        ? "border-primary bg-primary"
                        : isActive
                        ? "border-primary bg-primary ring-2 ring-primary/20"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {isDone ? (
                      <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : isActive ? (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                    )}
                  </div>

                  {/* Stage label */}
                  <p
                    className={`text-center text-[8px] sm:text-[9px] font-bold leading-tight px-0.5 ${
                      isDone || isActive ? "text-primary" : "text-gray-400"
                    }`}
                  >
                    {stage.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active stage description */}
      <div className="rounded-lg border border-primary/10 bg-primary/5 px-3 py-2">
        <p className="text-[10px] font-bold text-primary mb-0.5">{s}</p>
        <p className="text-[10px] text-gray-600 leading-relaxed">
          {subCopy || activeStage.description}
        </p>
      </div>
    </div>
  );
}
