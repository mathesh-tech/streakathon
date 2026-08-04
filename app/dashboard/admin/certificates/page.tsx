"use client";

import { useEffect, useState } from "react";
import { Award, Search, Send, CheckCircle2, AlertCircle, RefreshCw, Trophy, FileText, UserCheck } from "lucide-react";

interface Certificate {
  certificateId: string;
  type: string;
  issueDate: string;
  verificationToken: string;
  student: {
    user: {
      name: string;
      email: string;
      registerNumber: string;
      department: string;
    };
  };
}

export default function CertificatesAdminPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    teamSearch: "",
    studentEmail: "",
    certificateType: "WINNER_FIRST",
  });

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/certificates");
      const data = await res.json();
      if (res.ok) {
        setCertificates(data.certificates || []);
      }
    } catch (err) {
      console.error("Failed to load certificates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIssuing(true);
    setError("");
    setSuccess("");

    if (!formData.teamSearch && !formData.studentEmail) {
      setError("Please enter either a team name/code or student email.");
      setIssuing(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || "Certificates dispatched successfully!");
        setFormData({ teamSearch: "", studentEmail: "", certificateType: "WINNER_FIRST" });
        fetchCertificates();
      } else {
        setError(data.error || "Failed to issue certificate");
      }
    } catch (err) {
      setError("An unexpected error occurred while issuing certificates.");
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="flex-1 p-8 bg-slate-950 text-slate-100 min-h-screen space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-400" />
            Certificates Generator & Dispatch
          </h1>
          <p className="text-slate-400 mt-1">
            Issue official digital certificates of achievement to top 3 winner teams and hackathon participants.
          </p>
        </div>

        <button
          onClick={fetchCertificates}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded-xl text-sm font-semibold transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh List
        </button>
      </div>

      {/* Notifications */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Issue Certificate Form */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Send className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-white">Issue Certificate</h2>
          </div>

          <form onSubmit={handleIssueCertificate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                Certificate Category / Rank
              </label>
              <select
                value={formData.certificateType}
                onChange={(e) => setFormData({ ...formData, certificateType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="WINNER_FIRST">🥇 1st Place Winner Certificate</option>
                <option value="WINNER_SECOND">🥈 2nd Place Winner Certificate</option>
                <option value="WINNER_THIRD">🥉 3rd Place Winner Certificate</option>
                <option value="TOP_TEN">⭐ Top 10 Team Certificate</option>
                <option value="PARTICIPATION">📜 Official Participation Certificate</option>
              </select>
            </div>

            <div className="relative border-t border-b border-slate-800/80 py-4 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase">Target Recipient Option A: By Team Name</p>
              <input
                type="text"
                placeholder="Search Team Name or Code (e.g. SONA-01)..."
                value={formData.teamSearch}
                onChange={(e) => setFormData({ ...formData, teamSearch: e.target.value, studentEmail: "" })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-500">Will automatically issue certificates to all members of the team.</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase">Target Recipient Option B: By Student Email</p>
              <input
                type="email"
                placeholder="Student Email (e.g. student@sonatech.ac.in)..."
                value={formData.studentEmail}
                onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value, teamSearch: "" })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={issuing}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {issuing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating & Dispatching...
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  Issue Certificate
                </>
              )}
            </button>
          </form>
        </div>

        {/* Certificates History List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              Issued Certificates Registry ({certificates.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center text-slate-500">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : certificates.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No certificates issued yet. Use the form on the left to award top 3 winners or participants.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="py-3 px-4 rounded-l-lg">Recipient</th>
                    <th className="py-3 px-4">Certificate Type</th>
                    <th className="py-3 px-4">Verify Code</th>
                    <th className="py-3 px-4 rounded-r-lg">Issued Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {certificates.map((cert) => (
                    <tr key={cert.certificateId} className="hover:bg-slate-850/50 transition">
                      <td className="py-4 px-4 font-semibold text-white">
                        <div>{cert.student?.user?.name}</div>
                        <div className="text-xs text-slate-400 font-normal">{cert.student?.user?.email}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-md text-xs font-bold">
                          {cert.type.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-emerald-400 text-xs font-bold">
                        {cert.verificationToken}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-400">
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
