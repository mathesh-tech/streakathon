"use client";

import { useEffect, useState } from "react";
import { Settings, Shield, Building2, Calendar, User, Mail, Lock, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (res.ok) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="flex-1 p-8 bg-slate-950 text-slate-100 min-h-screen space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-amber-400" />
          Admin Platform Settings
        </h1>
        <p className="text-slate-400 mt-1">
          Manage system configurations, active academic semester details, and administrator profile security.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center text-slate-500">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Active Semester Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">Active Academic Semester</h2>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <p className="text-xs text-slate-500 uppercase font-semibold">Current Semester</p>
                <p className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {settings?.activeSemester || "Even Semester 2026"}
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <p className="text-xs text-slate-500 uppercase font-semibold">Target Departments</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg font-bold text-xs">
                    IT - Information Technology
                  </span>
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg font-bold text-xs">
                    ADS - AI & Data Science
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <p className="text-xs text-slate-500 uppercase font-semibold">Student Pool Structure</p>
                <p className="text-slate-300 text-xs">
                  2nd & 3rd Year Classes • Sections A, B, C (40 capacity per section).
                </p>
              </div>
            </div>
          </div>

          {/* Admin Profile & Security */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">Administrator Profile & Security</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Admin Name</label>
                <input
                  type="text"
                  disabled
                  value={settings?.adminName || "Administrator"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Official Sonatech Email</label>
                <input
                  type="email"
                  disabled
                  value={settings?.adminEmail || "vijayaragavan.24it@sonatech.ac.in"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Designation</label>
                <input
                  type="text"
                  disabled
                  value={settings?.designation || "Chief Hackathon Administrator"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 cursor-not-allowed"
                />
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-400">
                  Authentication is secured via NextAuth session with bcrypt hash encryption in Neon PostgreSQL.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
