"use client";

import { useEffect, useState } from "react";
import {
  buildClaimTimelineLabels,
  getClaimTimelineActiveIndex,
  getPortalTimelineNodeBadgeClass,
  resolvePortalClaimStatus,
} from "./claimStatusDisplay";

// ================================================================
// ClaimTimeline — Main workflow path for a single claim
// New Request → Tentative → Scheduled → Rescheduled (if applicable)
// → Inspected → Ready for Review → Complete
// Optional alternates after Complete: Attorney Services / Additional Services
// ================================================================

interface ClaimTimelineProps {
  status: string;
  submittedAt: string;
  claimNumber: string;
  claimId?: string;
  reportUrl?: string;
  notifications?: Array<{ title?: string; message?: string; date?: string; created_time?: string }>;
}

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

function useCompactTimeline() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return compact;
}

export default function ClaimTimeline({
  status,
  submittedAt,
  reportUrl,
  claimId,
  claimNumber,
}: ClaimTimelineProps) {
  const compact = useCompactTimeline();
  const claimKey = claimId || claimNumber;
  const resolved = resolvePortalClaimStatus(status, claimKey);
  const statuses = buildClaimTimelineLabels(resolved);
  const activeIndex = getClaimTimelineActiveIndex(statuses, resolved);

  const rowHeight = compact ? 80 : 110;
  const nodeHeight = compact ? 58 : 70;
  const rowsCount = Math.ceil(statuses.length / 3);

  return (
    <div className="w-full overflow-x-auto pb-1 sm:pb-4">
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
        className="relative mx-auto mt-1 w-[92%] min-w-0 sm:mt-2 sm:w-[calc(100%-40px)] sm:min-w-[420px]"
      >
        {statuses.map((label, idx) => {
          const isCurrent = idx === activeIndex;
          const isDone = activeIndex !== -1 && idx < activeIndex;
          const row = Math.floor(idx / 3);
          const col = row % 2 === 0 ? idx % 3 : 2 - (idx % 3);
          const leftPos = col * 37;
          const topPos = row * rowHeight;
          const badgeStyle = getPortalTimelineNodeBadgeClass(label);

          let eventTimeText = "";
          if (idx === 0 && submittedAt) {
            eventTimeText = formatDateTime(submittedAt);
          } else if (isCurrent) {
            eventTimeText = "Active Now";
          }

          const isReportNode =
            (label === "Complete" ||
              label === "Attorney Services" ||
              label === "Additional Services" ||
              label === "Additional Services Review") &&
            !!reportUrl;

          return (
            <div key={`${label}-${idx}`}>
              <div
                style={{
                  position: "absolute",
                  left: `${leftPos}%`,
                  top: `${topPos}px`,
                  width: "26%",
                  height: `${nodeHeight}px`,
                }}
                className={`
                  flex flex-col justify-center items-center overflow-visible rounded-lg border p-1.5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-default sm:rounded-xl sm:p-2
                  ${
                    isCurrent
                      ? `${badgeStyle} z-20 border-2 font-black shadow-md ring-2 ring-primary/20 animate-pulse-soft sm:scale-105 sm:shadow-lg sm:ring-4`
                      : isDone
                      ? "bg-primary/5 text-primary border-primary/20 shadow-sm"
                      : "bg-gray-50/50 text-gray-400 border-dashed border-gray-200 opacity-80 hover:opacity-100"
                  }
                `}
              >
                {!compact && (
                  <span className="material-symbols-outlined mb-0.5 text-[16px]">
                    {isReportNode ? "description" : isCurrent ? "schedule" : isDone ? "check_circle" : "pending"}
                  </span>
                )}
                <span className="px-0.5 text-[9px] font-bold leading-snug sm:text-[10px]">
                  {label}
                </span>

                {!compact && eventTimeText && (
                  <span className="mt-0.5 text-[7px] font-medium text-gray-500">
                    {eventTimeText}
                  </span>
                )}
                {!compact && isReportNode && (
                  <span className="text-[7px] font-black text-emerald-600 bg-emerald-50 px-1 rounded border border-emerald-200 mt-0.5">
                    Report OK
                  </span>
                )}
              </div>

              {idx < statuses.length - 1 && (() => {
                const nextRow = Math.floor((idx + 1) / 3);
                const nextCol = nextRow % 2 === 0 ? (idx + 1) % 3 : 2 - ((idx + 1) % 3);
                const isConnDone = idx < activeIndex;
                const markerSuffix = isConnDone ? "active-t" : "gray-t";
                const strokeColor = isConnDone ? "stroke-primary" : "stroke-gray-300";

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
                        top: `${row * rowHeight + nodeHeight / 2 - 16}px`,
                        height: "32px",
                      }}
                      className="pointer-events-none z-10"
                    >
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
                    </div>
                  );
                }

                return (
                  <div
                    style={{
                      position: "absolute",
                      left: `calc(${col * 37 + 13}% - 40px)`,
                      width: "80px",
                      top: `${row * rowHeight + nodeHeight}px`,
                      height: `${Math.max(rowHeight - nodeHeight, 16)}px`,
                    }}
                    className="pointer-events-none z-10"
                  >
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
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
