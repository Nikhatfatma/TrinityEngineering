"use client";

// ================================================================
// ClaimTimeline — Chronological event flowchart for a single claim
// Renders all 20 statuses in a serpentine layout with activity dates.
// ================================================================

interface ClaimTimelineProps {
  status: string;
  submittedAt: string;
  claimNumber: string;
  reportUrl?: string;
  notifications?: Array<{ title?: string; message?: string; date?: string; created_time?: string }>;
}

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

function formatDateTime(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ClaimTimeline({
  status,
  submittedAt,
  claimNumber,
  reportUrl,
}: ClaimTimelineProps) {
  const sLower = (status || "").trim().toLowerCase();
  
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
            <marker id="arrow-active-t" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <polygon points="0,1 8,4 0,7" className="fill-primary" />
            </marker>
            <marker id="arrow-gray-t" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
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

          const leftPos = col * 37;
          const topPos = row * rowHeight;

          // Get badge color styling
          const nodeKey = label.toLowerCase();
          const badgeStyle = STATUS_BADGE[nodeKey] || "bg-gray-100 text-gray-600 border-gray-200";

          // Calculate activity timestamp info to display on the node
          let eventTimeText = "";
          if (idx === 0 && submittedAt) {
            eventTimeText = formatDateTime(submittedAt);
          } else if (isCurrent) {
            eventTimeText = "Active Now";
          }

          // Check if report document is available for this step (Completed / Paid)
          const isReportNode = (label === "Completed" || label === "Paid") && reportUrl;

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
                  {isReportNode ? "description" : isCurrent ? "schedule" : isDone ? "check_circle" : "pending"}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold leading-tight line-clamp-1 px-0.5">
                  {label}
                </span>
                
                {eventTimeText && (
                  <span className="text-[7px] font-medium text-gray-500 mt-0.5">
                    {eventTimeText}
                  </span>
                )}
                {isReportNode && (
                  <span className="text-[7px] font-black text-emerald-600 bg-emerald-50 px-1 rounded border border-emerald-200 mt-0.5">
                    Report OK
                  </span>
                )}
              </div>

              {/* Connector Arrow */}
              {idx < ALL_STATUSES.length - 1 && (() => {
                const nextRow = Math.floor((idx + 1) / 3);
                const nextCol = nextRow % 2 === 0 ? (idx + 1) % 3 : 2 - ((idx + 1) % 3);

                const isConnDone = idx < activeIndex;
                const markerSuffix = isConnDone ? "active-t" : "gray-t";
                const strokeColor = isConnDone ? "stroke-primary" : "stroke-gray-300";

                const duration = SIMULATED_DURATIONS[idx] || "—";
                const modifier = SIMULATED_MODIFIERS[idx] || "—";

                if (row === nextRow) {
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
