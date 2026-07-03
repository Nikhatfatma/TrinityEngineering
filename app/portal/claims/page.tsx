"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClaimsFilterTabs, {
  ClaimsFilter,
  filterClaims,
} from "@/components/portal/claims/ClaimsFilterTabs";
import ClaimDetailPanel from "@/components/portal/claims/ClaimDetailPanel";
import StatusTracker from "@/components/portal/claims/StatusTracker";

// ── Interfaces (extended with optional reportUrl for future) ─────────────────
interface PortalUser {
  email: string;
  role: string;
  name: string;
}

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

// ── Status badge colours ─────────────────────────────────────────────────────
const STATUS_BADGE: Record<string, string> = {
  "new request":                              "bg-gray-100 text-gray-600",
  tentative:                                  "bg-amber-100 text-amber-700",
  scheduled:                                  "bg-indigo-100 text-indigo-700",
  reschedule:                                 "bg-orange-100 text-orange-700",
  inspected:                                  "bg-blue-100 text-blue-700",
  "ready for review":                         "bg-purple-100 text-purple-700",
  "lead engineer seal review":                "bg-violet-100 text-violet-700",
  "corrections needed":                       "bg-red-100 text-red-700",
  "revisions uploaded":                       "bg-sky-100 text-sky-700",
  invoicing:                                  "bg-cyan-100 text-cyan-700",
  "travelers - report sent wait to invoice":  "bg-teal-100 text-teal-700",
  completed:                                  "bg-emerald-100 text-emerald-700",
  "payment overdue":                          "bg-red-100 text-red-700",
  paid:                                       "bg-green-100 text-green-700",
  "additional services":                      "bg-fuchsia-100 text-fuchsia-700",
  "additional services review":               "bg-pink-100 text-pink-700",
  "revisit required":                         "bg-orange-100 text-orange-700",
  "attorney services":                        "bg-rose-100 text-rose-700",
  "on hold":                                  "bg-amber-100 text-amber-700",
  cancelled:                                  "bg-red-100 text-red-700",
  "not accepted":                             "bg-red-100 text-red-700",
};
function statusBadgeClass(status: string): string {
  return STATUS_BADGE[(status || "").toLowerCase()] || "bg-primary/10 text-primary";
}

// ── Date formatter (unchanged from original) ──────────────────────────────────
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

// ── Count helper ─────────────────────────────────────────────────────────────
function buildCounts(claims: ClaimRow[]): Record<ClaimsFilter, number> {
  return {
    all:       claims.length,
    active:    filterClaims(claims, "active").length,
    completed: filterClaims(claims, "completed").length,
    cancelled: filterClaims(claims, "cancelled").length,
  };
}

// ════════════════════════════════════════════════════════════════════════════
export default function PortalClaimsPage() {
  const router = useRouter();

  // ── Existing state (unchanged) ───────────────────────────────────────────
  const [user, setUser]     = useState<PortalUser | null>(null);
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  // ── New state for dashboard features ────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState<ClaimsFilter>("all");
  const [selectedClaim, setSelectedClaim] = useState<ClaimRow | null>(null);

  // ── Existing data-fetch logic (unchanged) ────────────────────────────────
  const loadClaims = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const sessionRes  = await fetch("/api/portal/session");
      const sessionData = await sessionRes.json();

      if (!sessionData.valid) {
        router.replace("/login");
        return;
      }

      setUser(sessionData.user);

      const claimsRes  = await fetch("/api/portal/claims");
      const claimsData = await claimsRes.json();

      if (claimsData.unauthorized) {
        router.replace("/login");
        return;
      }

      if (!claimsData.success) {
        setError(claimsData.error || "Could not load your claim requests.");
        return;
      }

      setClaims(claimsData.claims || []);
    } catch {
      setError("Something went wrong loading your claims.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadClaims();
  }, [loadClaims]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const filteredClaims = filterClaims(claims, statusFilter);
  const counts         = buildCounts(claims);

  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* ── Page header ────────────────────────────────────────────── */}
          <div className="mb-6 sm:mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">
                My Claims
              </h1>
              {user && (
                <p className="text-sm sm:text-base text-gray-500 mt-1">
                  {user.name}{" "}
                  <span className="text-gray-400">({user.email})</span>
                </p>
              )}
            </div>
            <button
              id="claims-refresh-btn"
              onClick={loadClaims}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[16px] ${loading ? "animate-spin" : ""}`}>
                refresh
              </span>
              Refresh
            </button>
          </div>

          {/* ── Loading ─────────────────────────────────────────────────── */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3 text-gray-600">
                <span className="material-symbols-outlined animate-spin text-3xl text-primary">
                  progress_activity
                </span>
                <p className="text-sm sm:text-base">Loading your claims…</p>
              </div>
            </div>
          )}

          {/* ── Error ───────────────────────────────────────────────────── */}
          {!loading && error && (
            <div className="p-4 sm:p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm sm:text-base">
              {error}
            </div>
          )}

          {/* ── Empty state ─────────────────────────────────────────────── */}
          {!loading && !error && claims.length === 0 && (
            <div className="text-center py-16 sm:py-20 bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-200 px-6">
              <span className="material-symbols-outlined text-5xl sm:text-6xl text-gray-300 mb-4">
                inbox
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                No claim requests yet
              </h2>
              <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                You haven&apos;t submitted any inspection requests linked to this
                email address.
              </p>
            </div>
          )}

          {/* ── Dashboard ───────────────────────────────────────────────── */}
          {!loading && !error && claims.length > 0 && (
            <div className="space-y-5">

              {/* Filter tabs */}
              <ClaimsFilterTabs
                value={statusFilter}
                onChange={setStatusFilter}
                counts={counts}
              />

              {/* Filtered empty */}
              {filteredClaims.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-200 px-6">
                  <span className="material-symbols-outlined text-4xl text-gray-300 mb-3">
                    filter_list_off
                  </span>
                  <p className="text-sm font-semibold text-gray-500">
                    No claims match this filter.
                  </p>
                </div>
              )}

              {/* ── Desktop table ────────────────────────────────────────── */}
              {filteredClaims.length > 0 && (
                <>
                  <div className="hidden md:block bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            {[
                              "Claim #",
                              "Type",
                              "Policyholder",
                              "Insurance Co.",
                              "Date of Loss",
                              "Submitted",
                              "Status",
                              "",
                            ].map((h) => (
                              <th
                                key={h}
                                className="px-4 lg:px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredClaims.map((claim) => (
                            <tr
                              key={claim.id || claim.claimNumber}
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
                              onClick={() => setSelectedClaim(claim)}
                            >
                              <td className="px-4 lg:px-5 py-4 text-sm font-black text-gray-900">
                                {claim.claimNumber || "—"}
                              </td>
                              <td className="px-4 lg:px-5 py-4 text-sm text-gray-700">
                                {claim.inspectionType || "—"}
                              </td>
                              <td className="px-4 lg:px-5 py-4 text-sm text-gray-700">
                                {claim.policyholderName || "—"}
                              </td>
                              <td className="px-4 lg:px-5 py-4 text-sm text-gray-700">
                                {claim.insuranceCompany || "—"}
                              </td>
                              <td className="px-4 lg:px-5 py-4 text-sm text-gray-700">
                                {formatDate(claim.dateOfLoss)}
                              </td>
                              <td className="px-4 lg:px-5 py-4 text-sm text-gray-700">
                                {formatDate(claim.submittedAt)}
                              </td>
                              <td className="px-4 lg:px-5 py-4">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${statusBadgeClass(claim.status)}`}
                                >
                                  {claim.status || "Submitted"}
                                </span>
                              </td>
                              <td className="px-4 lg:px-5 py-4">
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                                  View
                                  <span className="material-symbols-outlined text-[14px]">
                                    chevron_right
                                  </span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ── Mobile cards ───────────────────────────────────────── */}
                  <div className="md:hidden space-y-3">
                    {filteredClaims.map((claim) => (
                      <button
                        key={claim.id || claim.claimNumber}
                        id={`claim-card-${claim.id || claim.claimNumber}`}
                        onClick={() => setSelectedClaim(claim)}
                        className="w-full text-left bg-white rounded-2xl border-2 border-gray-200 p-4 shadow-sm active:scale-[0.99] transition-all hover:border-primary/30 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Claim #
                            </p>
                            <p className="text-lg font-black text-gray-900">
                              {claim.claimNumber || "—"}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold flex-shrink-0 ${statusBadgeClass(claim.status)}`}
                          >
                            {claim.status || "Submitted"}
                          </span>
                        </div>

                        {/* Mini status tracker */}
                        <div className="mb-3">
                          <StatusTracker status={claim.status} />
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t border-gray-100 pt-3">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400">
                              Type
                            </p>
                            <p className="text-gray-800 text-xs font-semibold">
                              {claim.inspectionType || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400">
                              Policyholder
                            </p>
                            <p className="text-gray-800 text-xs font-semibold">
                              {claim.policyholderName || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400">
                              Insurance Co.
                            </p>
                            <p className="text-gray-800 text-xs font-semibold">
                              {claim.insuranceCompany || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400">
                              Date of Loss
                            </p>
                            <p className="text-gray-800 text-xs font-semibold">
                              {formatDate(claim.dateOfLoss)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-gray-100">
                          <span className="text-xs font-bold text-primary">
                            View details
                          </span>
                          <span className="material-symbols-outlined text-primary text-[14px]">
                            chevron_right
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Detail panel (slide-in) */}
      <ClaimDetailPanel
        claim={selectedClaim}
        onClose={() => setSelectedClaim(null)}
      />

      <Footer />
    </div>
  );
}
