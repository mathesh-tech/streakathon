"use client";

import { useState } from "react";
import { Award, PlusCircle, MinusCircle, ShieldCheck, AlertCircle, CheckCircle2, RefreshCw, Zap, Flame, Trophy } from "lucide-react";

export default function CreditRulesAdminPage() {
  const [identifier, setIdentifier] = useState("");
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("");
  const [actionType, setActionType] = useState<"ADD" | "DEDUCT">("ADD");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!identifier || !points) {
      setError("Please enter student email/register number and point amount.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, points, reason, actionType }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        setIdentifier("");
        setPoints("");
        setReason("");
      } else {
        setError(data.error || "Failed to update credits");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 bg-slate-950 text-slate-100 min-h-screen space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Award className="w-8 h-8 text-amber-400" />
          Innovation Credits & Point Adjuster
        </h1>
        <p className="text-slate-400 mt-1">
          Review standard credit point allocation rules and manually adjust (add or deduct) credit points for any student.
        </p>
      </div>

      {/* Standard Rules Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Hackathon Winner Bonus</h3>
          <p className="text-slate-400 text-xs">
            1st Winner: <strong>+500 pts</strong> • 2nd: <strong>+350 pts</strong> • 3rd: <strong>+200 pts</strong>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Participation Reward</h3>
          <p className="text-slate-400 text-xs">
            Every verified hackathon participant earns <strong>+100 Innovation Credits</strong> upon submission.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl w-fit">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Daily Streak Bonus</h3>
          <p className="text-slate-400 text-xs">
            Maintaining continuous daily streak awards <strong>+10 Credits/day</strong> with milestone multipliers.
          </p>
        </div>
      </div>

      {/* Manual Point Adjustment Panel */}
      <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Manual Student Credit Adjustment</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-950/80 border border-red-800 rounded-xl flex items-center gap-3 text-red-200">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleCreditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Student Email or Register Number
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 617824IT001 or student@sonatech.ac.in"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Action Type</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="ADD">➕ Add Credits (+)</option>
                <option value="DEDUCT">➖ Deduct Credits (-)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Points Amount</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 50"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Reason / Note</label>
            <input
              type="text"
              placeholder="e.g. Special Hackathon Presentation Award"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-bold rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 mt-4 ${
              actionType === "ADD"
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20"
                : "bg-red-600 hover:bg-red-500 text-white shadow-red-600/20"
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Updating Student Credits...
              </>
            ) : actionType === "ADD" ? (
              <>
                <PlusCircle className="w-4 h-4" />
                Apply Credit Addition
              </>
            ) : (
              <>
                <MinusCircle className="w-4 h-4" />
                Apply Credit Deduction
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
