"use client";

import { useState } from "react";
import { QrCode, Search, CheckCircle2, AlertCircle, RefreshCw, Users, ShieldCheck, Zap, Mail, UserCheck } from "lucide-react";

export default function AmbassadorAttendancePage() {
  const [tokenInput, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleScanOrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVerificationResult(null);

    if (!tokenInput.trim()) {
      setError("Please scan or type a student email, register number, or QR token.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/ambassador/verify-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrToken: tokenInput.trim(), leaderEmail: tokenInput.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setVerificationResult(data);
        setTokenInput("");
      } else {
        setError(data.error || "Verification failed. Student or team not found.");
      }
    } catch (err) {
      setError("An unexpected error occurred during attendance verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 bg-slate-950 text-slate-100 min-h-screen space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <QrCode className="w-8 h-8 text-amber-400" />
          Option 1: QR Ticket Scanner & Attendance
        </h1>
        <p className="text-slate-400 mt-1">
          Scan student ticket QR code or email from registration confirmation. Scanning Team Leader automatically marks attendance and awards <strong>+1 Innovation Credit</strong> to all team members in parallel.
        </p>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-950/80 border border-red-800 rounded-xl flex items-center gap-3 text-red-200">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Scanner Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Scan Registration QR Code</h2>
              <p className="text-xs text-slate-400">Scan camera barcode or enter student email / register number</p>
            </div>
          </div>

          <form onSubmit={handleScanOrSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
                Scan Result / Email / QR Token
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. leader@sonatech.ac.in or 617824IT001"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Verifying Team Attendance...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Verify Attendance & Award +1 Credit
                </>
              )}
            </button>
          </form>
        </div>

        {/* Verification Result Confirmation Card */}
        {verificationResult && (
          <div className="bg-slate-900 border border-emerald-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 pb-4 border-b border-emerald-900/60">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-emerald-400 flex items-center gap-2">
                  {verificationResult.isAlreadyVerified ? "ALREADY VERIFIED" : "VERIFICATION SUCCESSFUL"}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">{verificationResult.message}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <p className="text-xs text-slate-500 uppercase font-semibold">Verified Team Name</p>
                <p className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  {verificationResult.teamName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Team Members</p>
                  <p className="text-base font-extrabold text-white">{verificationResult.membersCount} Members</p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Parallel Credit Status</p>
                  <p className="text-base font-extrabold text-emerald-400 flex items-center gap-1">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    +1 Credit Claimed
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
