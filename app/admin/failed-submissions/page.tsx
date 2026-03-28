"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Type definition for Failed Submissions
interface FailedSubmission {
  ROWID: string;
  Payload: string; // JSON string
  ClaimNumber: string;
  AdjusterEmail: string;
  ErrorDetails: string;
  CREATEDTIME: string;
}

export default function AdminFailedSubmissionsPage() {
  const [submissions, setSubmissions] = useState<FailedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError("");
    try {
      const functionUrl = "/api/submit-inspection";


      const res = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getFailedSubmissions" }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Failed to fetch submissions");
      
      setSubmissions(result.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleRetry = async (rowId: string) => {
    if (!confirm("Are you sure you want to retry this submission?")) return;
    setRetryingId(rowId);
    
    try {
      const functionUrl = "/api/submit-inspection";


      const res = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "retrySubmission", rowId }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Retry failed");
      
      alert("Submission successfully retried and sent to Zoho Creator!");
      fetchSubmissions(); // refresh the list
    } catch (err: any) {
      alert("Retry failed again: " + (err.message || err));
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-background-dark dark:via-section-dark dark:to-background-dark flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-red-500">error</span>
                Failed Submissions
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage and retry inspection submissions that failed to sync with Zoho Creator.
              </p>
            </div>
            <button
              onClick={fetchSubmissions}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
            >
              <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>refresh</span>
              Refresh
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl font-medium mb-6 flex items-start gap-3 border border-red-200 dark:border-red-800">
              <span className="material-symbols-outlined">warning</span>
              <p>{error}</p>
            </div>
          )}

          <div className="bg-white dark:bg-section-dark rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <span className="material-symbols-outlined animate-spin text-4xl mb-3 text-primary">autorenew</span>
                <p className="font-medium text-lg">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-16 text-center">
                <div className="bg-green-50 dark:bg-green-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200 dark:border-green-800">
                  <span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">All clear!</h3>
                <p className="text-gray-500 dark:text-gray-400">There are no failed submissions at this time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="p-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Date / Time</th>
                      <th className="p-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Claim Summary</th>
                      <th className="p-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Error Details</th>
                      <th className="p-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {submissions.map((sub) => (
                      <tr key={sub.ROWID} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                        <td className="p-4 align-top">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {new Date(sub.CREATEDTIME).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(sub.CREATEDTIME).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                            Claim: {sub.ClaimNumber || "N/A"}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">email</span>
                            {sub.AdjusterEmail || "N/A"}
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <div className="text-xs bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-2.5 rounded-lg border border-red-100 dark:border-red-900/30 max-h-32 overflow-y-auto font-mono">
                            {sub.ErrorDetails}
                          </div>
                        </td>
                        <td className="p-4 text-right align-top">
                          <button
                            onClick={() => handleRetry(sub.ROWID)}
                            disabled={retryingId === sub.ROWID}
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white px-4 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                          >
                            {retryingId === sub.ROWID ? (
                              <span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span>
                            ) : (
                              <span className="material-symbols-outlined text-[18px]">replay</span>
                            )}
                            {retryingId === sub.ROWID ? "Retrying..." : "Retry Sync"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
