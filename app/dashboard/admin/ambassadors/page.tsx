"use client";

import { useState, useEffect } from "react";
import { UserPlus, Shield, CheckCircle, AlertCircle, RefreshCw, Mail, Lock, User, Building2, GraduationCap, Users, Trash2, Key, X } from "lucide-react";

interface Ambassador {
  id: string;
  name: string;
  email: string;
  department: string;
  status: string;
  createdAt: string;
  lastLogin: string | null;
  ambassadorProfile: {
    assignedYear: number;
    assignedSection: string;
    permissions: string[];
  } | null;
}

export default function AmbassadorsPage() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingAmbassador, setEditingAmbassador] = useState<Ambassador | null>(null);
  const [editPassword, setEditPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form fields for creating Ambassador
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "IT",
    assignedYear: 3,
    assignedSection: "A",
  });

  const fetchAmbassadors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ambassadors");
      const data = await res.json();
      if (res.ok) {
        setAmbassadors(data.ambassadors || []);
      } else {
        setError(data.error || "Failed to load ambassadors");
      }
    } catch (err) {
      setError("Network error fetching ambassadors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbassadors();
  }, []);

  const handleCreateAmbassador = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setSuccess(null);

    if (!formData.email.endsWith("@sonatech.ac.in")) {
      setError("Email address must end with @sonatech.ac.in");
      setCreating(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/ambassadors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || `Ambassador ID created for ${formData.name}`);
        setFormData({ name: "", email: "", password: "", department: "IT", assignedYear: 3, assignedSection: "A" });
        fetchAmbassadors();
      } else {
        setError(data.error || "Failed to create ambassador ID");
      }
    } catch (err) {
      setError("An unexpected error occurred while creating ambassador");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAmbassador = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete Ambassador ID for ${name}? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/ambassadors/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || `Deleted Ambassador ${name}`);
        fetchAmbassadors();
      } else {
        setError(data.error || "Failed to delete ambassador");
      }
    } catch (err) {
      setError("Failed to delete ambassador account");
    } finally {
      setDeletingId(null);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAmbassador) return;

    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/ambassadors/${editingAmbassador.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: editPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(`Password reset successfully for ${editingAmbassador.name}`);
        setEditingAmbassador(null);
        setEditPassword("");
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      setError("Failed to update ambassador password");
    }
  };

  return (
    <div className="flex-1 p-8 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-amber-400" />
              Hackathon Ambassadors Management
            </h1>
            <p className="text-slate-400 mt-1">
              Create, view, manage credentials, and delete Hackathon Ambassador accounts (2nd, 3rd & 4th Year).
            </p>
          </div>
          <button
            onClick={fetchAmbassadors}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-4 bg-red-950/80 border border-red-800 rounded-xl flex items-center justify-between text-red-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl flex items-center justify-between text-emerald-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{success}</span>
            </div>
            <button onClick={() => setSuccess(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Ambassador Form */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <UserPlus className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-white">Create Ambassador ID</h2>
            </div>

            <form onSubmit={handleCreateAmbassador} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Siva Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Sonatech Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="name@sonatech.ac.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Must end with @sonatech.ac.in</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="Set Login Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Department Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="IT">IT - Information Technology</option>
                  <option value="ADS">ADS - AI & Data Science</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                    Assigned Year
                  </label>
                  <select
                    value={formData.assignedYear}
                    onChange={(e) => setFormData({ ...formData, assignedYear: parseInt(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Section
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="A"
                    value={formData.assignedSection}
                    onChange={(e) => setFormData({ ...formData, assignedSection: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {creating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Creating ID...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Ambassador ID
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Ambassador List Table with Actions */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                Active Ambassadors ({ambassadors.length})
              </h2>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center text-slate-500">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            ) : ambassadors.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                No Hackathon Ambassadors created yet. Use the form on the left to create one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                    <tr>
                      <th className="py-3 px-4 rounded-l-lg">Ambassador</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Dept</th>
                      <th className="py-3 px-4">Year & Sec</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {ambassadors.map((amb) => (
                      <tr key={amb.id} className="hover:bg-slate-850/50 transition">
                        <td className="py-4 px-4 font-medium text-white flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold">
                            {amb.name.charAt(0)}
                          </div>
                          {amb.name}
                        </td>
                        <td className="py-4 px-4 text-slate-400">{amb.email}</td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md text-xs font-medium">
                            {amb.department || "IT"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md text-xs">
                            Year {amb.ambassadorProfile?.assignedYear || 3} - {amb.ambassadorProfile?.assignedSection || "A"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-md text-xs font-medium">
                            {amb.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingAmbassador(amb)}
                              title="Reset Password"
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition"
                            >
                              <Key className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteAmbassador(amb.id, amb.name)}
                              disabled={deletingId === amb.id}
                              title="Delete Ambassador Account"
                              className="p-1.5 bg-red-950/50 hover:bg-red-900/80 text-red-400 rounded-lg transition disabled:opacity-50"
                            >
                              {deletingId === amb.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
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

      {/* Password Reset Modal */}
      {editingAmbassador && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                Reset Password: {editingAmbassador.name}
              </h3>
              <button onClick={() => setEditingAmbassador(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password (min 6 chars)"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAmbassador(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition shadow-lg shadow-amber-500/20"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
