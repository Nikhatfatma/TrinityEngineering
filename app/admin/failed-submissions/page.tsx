"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EditSubmissionModal from "@/components/admin/EditSubmissionModal";

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
  const functionUrl = "/api/submit-inspection";
  const [submissions, setSubmissions] = useState<FailedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryingId, setRetryingId] = useState<string | null>(null);
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<FailedSubmission | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError("");
    try {
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

  const handleOpenEdit = (submission: FailedSubmission) => {
    setEditingSubmission(submission);
    setIsEditModalOpen(true);
  };

  const handleSaveUpdate = async (rowId: string, updatedPayload: any) => {
    try {
      const res = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateFailedSubmission", rowId, payload: updatedPayload }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Update failed");
      
      alert("Submission data updated successfully!");
      fetchSubmissions(); 
    } catch (err: any) {
      throw new Error(err.message || "Failed to update record.");
    }
  };

  const handleDelete = async (rowId: string) => {
    if (!confirm("Are you sure you want to permanently delete this record? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteFailedSubmission", rowId }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Delete failed");
      
      fetchSubmissions();
    } catch (err: any) {
      alert(err.message || "Failed to delete record.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-background-dark flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-red-500">error</span>
                Failed Submissions
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Manage and retry inspection submissions that failed to sync with Zoho Creator.
              </p>
            </div>
            <button
              onClick={fetchSubmissions}
              disabled={loading}
              className="inline-flex items-center justify-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
              Refresh
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-xs font-medium mb-5 flex items-start gap-2 border border-red-200 dark:border-red-800">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <p>{error}</p>
            </div>
          )}

          <div className="bg-white dark:bg-section-dark rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-800">
            {loading ? (
              <div className="p-10 text-center text-gray-500">
                <span className="material-symbols-outlined animate-spin text-3xl mb-2 text-primary">autorenew</span>
                <p className="font-semibold text-sm">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-green-50 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-200 dark:border-green-800">
                  <span className="material-symbols-outlined text-3xl text-green-500">check_circle</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">All clear!</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">There are no failed submissions at this time.</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                {/* Mobile/Tablet Card View - Hidden on lg screens */}
                <div className="lg:hidden divide-y divide-gray-100 dark:divide-gray-800">
                  {submissions.map((sub) => (
                    <div key={sub.ROWID} className="p-4 bg-white dark:bg-background-dark/50 hover:bg-gray-50/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight">
                            {sub.ClaimNumber || "NO CLAIM #"}
                          </div>
                          <div className="text-[10px] text-gray-400 font-bold">
                            {new Date(sub.CREATEDTIME).toLocaleDateString()} @ {new Date(sub.CREATEDTIME).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono opacity-60">ID: {sub.ROWID.slice(-6)}</div>
                      </div>

                      <div className="mb-3">
                         <div className="text-[10px] text-gray-500 flex items-center gap-1 mb-2 truncate">
                            <span className="material-symbols-outlined text-[14px]">alternate_email</span>
                            {sub.AdjusterEmail || "Missing Email"}
                          </div>
                          <div className="text-[10px] bg-red-50/80 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-2.5 rounded-lg border border-red-100/50 dark:border-red-900/20 font-mono leading-relaxed overflow-hidden break-words">
                            {sub.ErrorDetails}
                          </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50 dark:border-gray-800/50">
                        <button
                          onClick={() => handleRetry(sub.ROWID)}
                          disabled={retryingId === sub.ROWID}
                          className="flex-1 min-w-[70px] inline-flex items-center justify-center gap-1 bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg font-black text-[9px] transition-all disabled:opacity-50 shadow-sm uppercase tracking-wider"
                        >
                          <span className="material-symbols-outlined text-[14px]">replay</span>
                          {retryingId === sub.ROWID ? "..." : "Retry"}
                        </button>
                        
                        <button
                          onClick={() => handleOpenEdit(sub)}
                          disabled={retryingId === sub.ROWID}
                          className="flex-1 min-w-[70px] inline-flex items-center justify-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg font-black text-[9px] transition-all shadow-sm uppercase tracking-wider"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(sub.ROWID)}
                          disabled={retryingId === sub.ROWID}
                          className="inline-flex items-center justify-center bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg font-black text-[9px] transition-all shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View - Hidden below lg screens */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                      <tr className="bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 font-mono">
                        <th className="p-4 w-[120px] text-[10px] font-black text-gray-500 dark:text-gray-500 uppercase tracking-widest">Time</th>
                        <th className="p-4 w-[200px] text-[10px] font-black text-gray-500 dark:text-gray-500 uppercase tracking-widest">Entity / Summary</th>
                        <th className="p-4 text-[10px] font-black text-gray-500 dark:text-gray-500 uppercase tracking-widest">Error Trace</th>
                        <th className="p-4 w-[240px] text-[10px] font-black text-gray-500 dark:text-gray-500 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {submissions.map((sub) => (
                        <tr key={sub.ROWID} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors group">
                          <td className="p-4 align-top">
                            <div className="text-[11px] font-bold text-gray-900 dark:text-white">
                              {new Date(sub.CREATEDTIME).toLocaleDateString()}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              {new Date(sub.CREATEDTIME).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="p-4 align-top">
                            <div className="text-[11px] font-black text-gray-900 dark:text-white truncate">
                              {sub.ClaimNumber || "NO CLAIM #"}
                            </div>
                            <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                              <span className="material-symbols-outlined text-[14px]">alternate_email</span>
                              {sub.AdjusterEmail || "Missing Email"}
                            </div>
                          </td>
                          <td className="p-4 align-top">
                            <div className="text-[10px] bg-red-50/80 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-3 rounded-lg border border-red-100/50 dark:border-red-900/20 font-mono leading-relaxed truncate group-hover:whitespace-normal transition-all max-h-[100px] group-hover:max-h-[500px]">
                              {sub.ErrorDetails}
                            </div>
                          </td>
                          <td className="p-4 align-top text-right">
                            <div className="flex flex-row justify-end gap-1 px-1">
                              <button
                                onClick={() => handleRetry(sub.ROWID)}
                                disabled={retryingId === sub.ROWID}
                                title="Retry Submission"
                                className="inline-flex items-center justify-center gap-1 bg-primary hover:bg-primary-dark text-white px-2 py-1 rounded-md font-bold text-[9px] transition-all disabled:opacity-50 shadow-sm uppercase tracking-wider"
                              >
                                <span className="material-symbols-outlined text-[12px]">replay</span>
                                {retryingId === sub.ROWID ? "..." : "Retry"}
                              </button>
                              
                              <button
                                onClick={() => handleOpenEdit(sub)}
                                disabled={retryingId === sub.ROWID}
                                title="Edit Submission"
                                className="inline-flex items-center justify-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-primary/10 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md font-bold text-[9px] transition-all shadow-sm uppercase tracking-wider"
                              >
                                <span className="material-symbols-outlined text-[12px]">edit</span>
                                Edit
                              </button>

                              <button
                                onClick={() => handleDelete(sub.ROWID)}
                                disabled={retryingId === sub.ROWID}
                                title="Delete Record"
                                className="inline-flex items-center justify-center bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-md font-bold text-[9px] transition-all shadow-sm"
                              >
                                <span className="material-symbols-outlined text-[12px]">delete</span>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />

      <EditSubmissionModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        submission={editingSubmission}
        onSave={handleSaveUpdate}
      />
    </div>
  );
}
