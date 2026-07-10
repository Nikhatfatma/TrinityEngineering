"use client";

import { useEffect } from "react";
import ClaimTimeline from "./ClaimTimeline";
import {
  getPortalClaimStatusBadgeClass,
  getPortalClaimStatusDisplay,
  getClaimPersistenceKey,
} from "./claimStatusDisplay";

// ================================================================
// ClaimDetailPanel — Slide-in right panel for a single claim
// Shows: full details, claim timeline, report download
// ================================================================

interface ClaimRow {
  id: string;
  claimNumber: string;
  inspectionType: string;
  status: string;
  dateOfLoss: string;
  policyholderName: string;
  submittedAt: string;
  insuranceCompany: string;
  reportUrl?: string;
}

interface ClaimDetailPanelProps {
  claim: ClaimRow | null;
  onClose: () => void;
}

function formatDate(value: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadgeClass(status: string): string {
  return getPortalClaimStatusBadgeClass(status);
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-800 mt-0.5">
        {value || "—"}
      </p>
    </div>
  );
}

export default function ClaimDetailPanel({
  claim,
  onClose,
}: ClaimDetailPanelProps) {
  const displayStatus = claim
    ? getPortalClaimStatusDisplay(claim.status, getClaimPersistenceKey(claim))
    : "New Request";

  // Lock body scroll while open
  useEffect(() => {
    if (claim) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [claim]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (claim) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [claim, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          claim ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        id="claim-detail-panel"
        role="dialog"
        aria-modal="true"
        aria-label={claim ? `Claim #${claim.claimNumber} details` : "Claim details"}
        className={`
          fixed top-0 right-0 z-50 h-full w-full max-w-xl
          bg-white shadow-2xl
          flex flex-col
          transition-transform duration-300 ease-out
          ${claim ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {claim && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4 flex-shrink-0">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Claim Details
                </p>
                <h2 className="text-lg font-black text-gray-900 truncate">
                  #{claim.claimNumber || "—"}
                </h2>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${getStatusBadgeClass(displayStatus)}`}
                >
                  {displayStatus}
                </span>
                <button
                  onClick={onClose}
                  id="claim-detail-close-btn"
                  aria-label="Close detail panel"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

              {/* Claim Details Grid */}
              <section aria-label="Claim information">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Claim Information
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <DetailRow label="Claim #" value={claim.claimNumber} />
                  <DetailRow label="Status" value={displayStatus} />
                  <DetailRow label="Inspection Type" value={claim.inspectionType} />
                  <DetailRow label="Insurance Company" value={claim.insuranceCompany} />
                  <DetailRow label="Policyholder" value={claim.policyholderName} />
                  <DetailRow label="Date of Loss" value={formatDate(claim.dateOfLoss)} />
                  <DetailRow
                    label="Submitted"
                    value={formatDate(claim.submittedAt)}
                  />
                </div>
              </section>

              {/* Report Download */}
              <section aria-label="Report download">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Inspection Report
                </p>
                {claim.reportUrl ? (
                  <a
                    href={claim.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="claim-report-download-btn"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary px-4 py-3 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      download
                    </span>
                    Download Report
                  </a>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="material-symbols-outlined text-gray-300 text-xl flex-shrink-0">
                      description
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">
                        Report not yet available
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Your report will appear here once the inspection is complete
                        and finalized.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* Claim Timeline */}
              <section aria-label="Claim timeline">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Claim Timeline
                </p>
                <div className="mx-auto max-w-[94%] rounded-2xl border border-gray-100 bg-gray-50 p-2 sm:max-w-[96%] sm:p-4">
                  <ClaimTimeline
                    status={claim.status}
                    submittedAt={claim.submittedAt}
                    claimNumber={claim.claimNumber}
                    claimId={claim.id}
                    reportUrl={claim.reportUrl}
                  />
                </div>
              </section>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
