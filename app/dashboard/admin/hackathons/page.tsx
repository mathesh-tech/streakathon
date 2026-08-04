"use client";

import { useEffect, useState } from "react";
import { Trophy, Plus, Calendar, MapPin, Users, CheckCircle2, Clock, PlayCircle, RefreshCw, X, AlertCircle } from "lucide-react";

interface Hackathon {
  id: string;
  title: string;
  description: string;
  theme: string;
  venue: string;
  status: string;
  registrationOpen: string;
  registrationClose: string;
  submissionDeadline: string;
  _count?: {
    teams: number;
    registrations: number;
  };
}

export default function HackathonsAdminPage() {
  const [hackathons, setHackathons] = useState<{ live: Hackathon[]; upcoming: Hackathon[]; past: Hackathon[]; all: Hackathon[] }>({
    live: [],
    upcoming: [],
    past: [],
    all: [],
  });
  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "past" | "all">("live");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    theme: "",
    venue: "APJ Abdul Kalam Block",
    status: "LIVE",
  });

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hackathons");
      const data = await res.json();
      if (res.ok) {
        setHackathons({
          live: data.live || [],
          upcoming: data.upcoming || [],
          past: data.past || [],
          all: data.all || [],
        });
      }
    } catch (err) {
      console.error("Failed to load hackathons", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  const handleCreateHackathon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/hackathons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || "Hackathon created!");
        setIsModalOpen(false);
        setFormData({ title: "", description: "", theme: "", venue: "APJ Abdul Kalam Block", status: "LIVE" });
        fetchHackathons();
      } else {
        setError(data.error || "Failed to create hackathon");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setCreating(false);
    }
  };

  const displayedHackathons = hackathons[activeTab] || [];

  return (
    <div className="flex-1 p-8 bg-slate-950 text-slate-100 min-h-screen space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            Hackathons Management
          </h1>
          <p className="text-slate-400 mt-1">
            Monitor and manage live sprint events, upcoming challenges, and past completed hackathons.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={fetchHackathons}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded-xl text-sm font-semibold transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            Create Hackathon
          </button>
        </div>
      </div>

      {/* Status Messages */}
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

      {/* Tabs Filter */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab("live")}
          className={`pb-3 px-4 font-semibold text-sm transition relative ${
            activeTab === "live" ? "text-amber-400 border-b-2 border-amber-400" : "text-slate-400 hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-emerald-400" />
            Live / Ongoing ({hackathons.live.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab("upcoming")}
          className={`pb-3 px-4 font-semibold text-sm transition relative ${
            activeTab === "upcoming" ? "text-amber-400 border-b-2 border-amber-400" : "text-slate-400 hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Upcoming ({hackathons.upcoming.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab("past")}
          className={`pb-3 px-4 font-semibold text-sm transition relative ${
            activeTab === "past" ? "text-amber-400 border-b-2 border-amber-400" : "text-slate-400 hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
            Past Conducted ({hackathons.past.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab("all")}
          className={`pb-3 px-4 font-semibold text-sm transition relative ${
            activeTab === "all" ? "text-amber-400 border-b-2 border-amber-400" : "text-slate-400 hover:text-white"
          }`}
        >
          All ({hackathons.all.length})
        </button>
      </div>

      {/* Hackathons Grid */}
      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : displayedHackathons.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/50 border border-slate-800 rounded-2xl">
          No hackathons found in this section.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedHackathons.map((h) => (
            <div
              key={h.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition">
                    {h.title}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full border ${
                      h.status === "LIVE"
                        ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                        : h.status === "UPCOMING"
                        ? "bg-blue-950/80 text-blue-400 border-blue-800"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {h.status}
                  </span>
                </div>

                <p className="text-slate-400 text-sm line-clamp-2">{h.description}</p>

                <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Theme: <strong>{h.theme}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Venue: {h.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Registered Teams: <strong>{h._count?.teams || 0} Teams</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(h.registrationOpen).toLocaleDateString()}
                </span>
                <span className="text-amber-400 font-semibold">Active Event</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Hackathon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                Create New Hackathon
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHackathon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Hackathon Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Streakathon 2K26 AI Sprint"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Event goals, rules, and problem domain"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Theme</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Campus AI"
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Venue</label>
                  <input
                    type="text"
                    required
                    placeholder="APJ Abdul Kalam Block"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-sm hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Publish Hackathon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
