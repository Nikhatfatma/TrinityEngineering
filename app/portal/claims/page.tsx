"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
}

export default function PortalClaimsPage() {
  const router = useRouter();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClaims = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const sessionRes = await fetch("/api/portal/session");
      const sessionData = await sessionRes.json();

      if (!sessionData.valid) {
        router.replace("/login");
        return;
      }

      setUser(sessionData.user);

      const claimsRes = await fetch("/api/portal/claims");
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

  const formatDate = (value: string) => {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-background-dark dark:via-section-dark dark:to-background-dark flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
                My Claim Requests
              </h1>
              {user && (
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  Signed in as {user.name} ({user.email})
                </p>
              )}
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3 text-gray-600 dark:text-gray-400">
                <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
                <p className="text-sm sm:text-base">Loading your claims...</p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="p-4 sm:p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm sm:text-base">
              {error}
            </div>
          )}

          {!loading && !error && claims.length === 0 && (
            <div className="text-center py-16 sm:py-20 bg-white dark:bg-section-dark rounded-2xl sm:rounded-3xl border-2 border-gray-200 dark:border-gray-800 px-6">
              <span className="material-symbols-outlined text-5xl sm:text-6xl text-gray-300 dark:text-gray-600 mb-4">inbox</span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">No claim requests yet</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                You haven&apos;t submitted any inspection requests linked to this email address.
              </p>
            </div>
          )}

          {!loading && !error && claims.length > 0 && (
            <>
              <div className="hidden md:block bg-white dark:bg-section-dark rounded-2xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-background-dark">
                        <th className="px-4 lg:px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Claim #</th>
                        <th className="px-4 lg:px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
                        <th className="px-4 lg:px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Policyholder</th>
                        <th className="px-4 lg:px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Insurance Co.</th>
                        <th className="px-4 lg:px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date of Loss</th>
                        <th className="px-4 lg:px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Submitted</th>
                        <th className="px-4 lg:px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.map((claim) => (
                        <tr key={claim.id || claim.claimNumber} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-background-dark/50 transition-colors">
                          <td className="px-4 lg:px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{claim.claimNumber || "—"}</td>
                          <td className="px-4 lg:px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{claim.inspectionType || "—"}</td>
                          <td className="px-4 lg:px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{claim.policyholderName || "—"}</td>
                          <td className="px-4 lg:px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{claim.insuranceCompany || "—"}</td>
                          <td className="px-4 lg:px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{formatDate(claim.dateOfLoss)}</td>
                          <td className="px-4 lg:px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{formatDate(claim.submittedAt)}</td>
                          <td className="px-4 lg:px-6 py-4">
                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent">
                              {claim.status || "Submitted"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="md:hidden space-y-4">
                {claims.map((claim) => (
                  <div
                    key={claim.id || claim.claimNumber}
                    className="bg-white dark:bg-section-dark rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Claim #</p>
                        <p className="text-lg font-black text-gray-900 dark:text-white">{claim.claimNumber || "—"}</p>
                      </div>
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent flex-shrink-0">
                        {claim.status || "Submitted"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Type</p>
                        <p className="text-gray-800 dark:text-gray-200">{claim.inspectionType || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Policyholder</p>
                        <p className="text-gray-800 dark:text-gray-200">{claim.policyholderName || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Insurance Co.</p>
                        <p className="text-gray-800 dark:text-gray-200">{claim.insuranceCompany || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Date of Loss</p>
                        <p className="text-gray-800 dark:text-gray-200">{formatDate(claim.dateOfLoss)}</p>
                      </div>
                      <div className="col-span-full">
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Submitted</p>
                        <p className="text-gray-800 dark:text-gray-200">{formatDate(claim.submittedAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
