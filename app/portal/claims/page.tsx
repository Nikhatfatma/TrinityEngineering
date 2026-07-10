"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClaimsFilterTabs, {
  ClaimsFilter,
  filterClaims,
} from "@/components/portal/claims/ClaimsFilterTabs";
import ClaimDetailPanel from "@/components/portal/claims/ClaimDetailPanel";
import StatusTracker from "@/components/portal/claims/StatusTracker";
import {
  getPortalClaimStatusBadgeClass,
  getPortalClaimStatusDisplay,
  getClaimPersistenceKey,
} from "@/components/portal/claims/claimStatusDisplay";

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

// ── Status badge colours (portal display labels only) ───────────────────────
function statusBadgeClass(status: string): string {
  return getPortalClaimStatusBadgeClass(status);
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

function getFirstName(name?: string): string {
  const trimmed = (name || "").trim();
  if (!trimmed) return "there";
  return trimmed.split(/\s+/)[0];
}

// ════════════════════════════════════════════════════════════════════════════
export default function PortalClaimsPage() {
  const router = useRouter();

  // ── Existing state (unchanged) ───────────────────────────────────────────
  const [user, setUser]     = useState<PortalUser | null>(null);
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshError, setRefreshError] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const claimsCountRef = useRef(0);

  const LOAD_FAILED_MESSAGE =
    "We couldn't load your inspections right now. Please try again in a moment.";

  // ── New state for dashboard features ────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState<ClaimsFilter>("all");
  const [selectedClaim, setSelectedClaim] = useState<ClaimRow | null>(null);

  useEffect(() => {
    claimsCountRef.current = claims.length;
  }, [claims]);

  // ── Existing data-fetch logic (unchanged) ────────────────────────────────
  const loadClaims = useCallback(async () => {
    const hadClaims = claimsCountRef.current > 0;
    setLoading(true);
    setRefreshError("");
    if (!hadClaims) setLoadFailed(false);

    try {
      const sessionRes  = await fetch("/api/portal/session");
      const sessionData = await sessionRes.json();

      if (!sessionData.valid) {
        router.replace("/login");
        return;
      }

      setUser(sessionData.user);

      const claimsRes  = await fetch("/api/portal/claims");

      if (!claimsRes.ok) {
        if (hadClaims) {
          setRefreshError("Something went wrong refreshing your inspections.");
        } else {
          setLoadFailed(true);
          setClaims([]);
        }
        return;
      }

      const claimsData = await claimsRes.json();

      if (claimsData.unauthorized) {
        router.replace("/login");
        return;
      }

      if (!claimsData.success) {
        if (hadClaims) {
          setRefreshError(claimsData.error || "Could not refresh your inspections.");
        } else {
          // First load with no cached inspections — show empty welcome, not network error
          setLoadFailed(false);
          setClaims([]);
        }
        return;
      }

      setRefreshError("");
      setLoadFailed(false);
      setClaims(claimsData.claims || []);
    } catch {
      if (hadClaims) {
        setRefreshError("Something went wrong refreshing your inspections.");
      } else {
        setLoadFailed(true);
      }
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
    <div className="flex min-w-0 w-full flex-col overflow-x-clip bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />

      <main className="min-w-0 w-full pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="mx-auto min-w-0 w-full max-w-6xl px-4 sm:px-6 md:px-8">

          {/* ── Page header ────────────────────────────────────────────── */}
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4 sm:mb-5 md:mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900 sm:text-3xl md:text-[2.5rem] md:leading-tight">
                My Inspections
              </h1>
              {user && (
                <p className="mt-1 text-sm text-gray-500 sm:text-base md:text-xl">
                  Welcome, {getFirstName(user.name)}
                </p>
              )}
            </div>
            <button
              id="claims-refresh-btn"
              onClick={loadClaims}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-600 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 md:gap-2 md:px-5 md:py-3 md:text-base"
            >
              <span className={`material-symbols-outlined text-[16px] md:text-[20px] ${loading ? "animate-spin" : ""}`}>
                refresh
              </span>
              Refresh
            </button>
          </div>

          {/* ── Loading ─────────────────────────────────────────────────── */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3 text-gray-600">
                <span className="material-symbols-outlined animate-spin text-3xl text-primary">
                  progress_activity
                </span>
                <p className="text-sm sm:text-base">Loading your inspections…</p>
              </div>
            </div>
          )}

          {/* ── Refresh error (only when inspections were already loaded) ─ */}
          {!loading && refreshError && claims.length > 0 && (
            <div className="mb-4 p-4 sm:p-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm sm:text-base">
              {refreshError}
            </div>
          )}

          {/* ── Load failed (network / API issue, no inspections loaded) ── */}
          {!loading && claims.length === 0 && loadFailed && (
            <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-white px-5 py-8 sm:px-8 sm:py-10 text-center shadow-lg shadow-primary/5">
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/5 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-accent/10 blur-2xl" />

              <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="material-symbols-outlined text-primary text-[28px]">wifi_off</span>
              </div>

              <p className="relative text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
                <span className="material-symbols-outlined text-primary text-[18px] align-[-4px] mr-1">
                  info
                </span>
                {LOAD_FAILED_MESSAGE}
              </p>
            </div>
          )}

          {/* ── Welcome empty state (loaded successfully, no inspections) ─ */}
          {!loading && claims.length === 0 && !loadFailed && (
            <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-white px-5 py-8 sm:px-8 sm:py-10 text-center shadow-lg shadow-primary/5">
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/5 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-accent/10 blur-2xl" />

              <div className="relative mx-auto mb-3 flex h-12 w-40 items-center justify-center sm:h-14 sm:w-48">
                <Image
                  src="/logo-navbar-dark.png"
                  alt="Trinity Engineering"
                  width={220}
                  height={64}
                  className="h-full w-auto object-contain"
                  priority
                />
              </div>

              <p className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80 mb-2">
                Trinity Engineering Portal
              </p>
              <h2 className="relative text-xl sm:text-2xl font-black text-gray-900 mb-2">
                Welcome{user ? `, ${getFirstName(user.name)}` : ""}!
              </h2>
              <p className="relative text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
                You don&apos;t have any inspections linked to your account yet.
                When you submit a request, it will appear here so you can track
                status and view details.
              </p>

              <div className="relative mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/submit-inspection"
                  className="group inline-flex items-center justify-center gap-2 border-2 border-[#0047AB] bg-[#0047AB] text-white px-7 py-3 rounded-md font-bold transition-all duration-300 hover:bg-transparent hover:border-[#0047AB] hover:text-[#0047AB] text-xs sm:text-sm md:text-[15px]"
                >
                  <Send className="h-4 w-4 shrink-0 text-white transition-all duration-300 group-hover:scale-110 group-hover:text-[#0047AB]" />
                  Submit Inspection
                </Link>
              </div>
            </div>
          )}

          {/* ── Dashboard ───────────────────────────────────────────────── */}
          {!loading && claims.length > 0 && (
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
                    No inspections match this filter.
                  </p>
                </div>
              )}

              {/* ── Desktop table ────────────────────────────────────────── */}
              {filteredClaims.length > 0 && (
                <div className="space-y-2.5 md:space-y-3.5 lg:space-y-3">
                  {filteredClaims.map((claim) => {
                    const claimKey = getClaimPersistenceKey(claim);
                    const displayStatus = getPortalClaimStatusDisplay(claim.status, claimKey);

                    return (
                      <button
                        key={claim.id || claim.claimNumber}
                        id={`claim-card-${claim.id || claim.claimNumber}`}
                        onClick={() => setSelectedClaim(claim)}
                        className="w-full rounded-xl border border-gray-200 bg-white p-3.5 text-left shadow-sm transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.99] md:p-5 lg:p-4"
                      >
                        <div className="mb-2 flex items-start justify-between gap-3 md:mb-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 md:text-sm">
                              Claim #
                            </p>
                            <p className="text-base font-black text-gray-900 md:text-2xl lg:text-lg">
                              {claim.claimNumber || "—"}
                            </p>
                          </div>
                          <span
                            className={`inline-flex flex-shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-bold md:px-3.5 md:py-1.5 md:text-base lg:px-2.5 lg:py-1 lg:text-xs ${statusBadgeClass(displayStatus)}`}
                          >
                            {displayStatus}
                          </span>
                        </div>

                        <div className="mb-2 md:mb-3">
                          <StatusTracker status={claim.status} claimKey={claimKey} showBar={false} />
                        </div>

                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-gray-100 pt-2.5 md:gap-x-5 md:gap-y-3 md:pt-3.5 lg:grid-cols-3 lg:gap-y-2 lg:pt-3">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 md:text-sm">Type</p>
                            <p className="text-xs font-semibold text-gray-800 md:text-base">
                              {claim.inspectionType || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 md:text-sm">Policyholder</p>
                            <p className="text-xs font-semibold text-gray-800 md:text-base">
                              {claim.policyholderName || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 md:text-sm">Insurance Co.</p>
                            <p className="text-xs font-semibold text-gray-800 md:text-base">
                              {claim.insuranceCompany || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 md:text-sm">Date of Loss</p>
                            <p className="text-xs font-semibold text-gray-800 md:text-base">
                              {formatDate(claim.dateOfLoss)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 md:text-sm">Submitted</p>
                            <p className="text-xs font-semibold text-gray-800 md:text-base">
                              {formatDate(claim.submittedAt)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-1.5 flex items-center justify-end gap-1 border-t border-gray-100 pt-1.5 md:mt-2.5 md:pt-2.5">
                          <span className="text-[11px] font-bold text-primary md:text-base lg:text-xs">View details</span>
                          <span className="material-symbols-outlined text-[13px] text-primary md:text-[18px]">
                            chevron_right
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
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
