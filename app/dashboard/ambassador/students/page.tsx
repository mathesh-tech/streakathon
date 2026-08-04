"use client";

import { useEffect, useState } from "react";
import { Users, Search, RefreshCw, Flame, Building2 } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  registerNumber: string;
  department: string;
  year: number;
  studentProfile: {
    section: string;
    currentCredits: number;
    lifetimeCredits: number;
    currentStreak: number;
    totalParticipations: number;
    totalWins: number;
  } | null;
}

export default function AmbassadorStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (deptFilter !== "ALL") params.append("department", deptFilter);
      if (yearFilter !== "ALL") params.append("year", yearFilter);

      const res = await fetch(`/api/admin/students?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error("Failed to load students", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [deptFilter, yearFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <div className="flex-1 p-8 bg-slate-950 text-slate-100 min-h-screen space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-amber-400" />
            Students Directory & Search (Ambassador View)
          </h1>
          <p className="text-slate-400 mt-1">
            Search and inspect registered IT and ADS students, participation counts, credits, and streak records.
          </p>
        </div>

        <button
          onClick={fetchStudents}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded-xl text-sm font-semibold transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Search & Filters Bar */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by student name, reg number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Departments</option>
            <option value="IT">IT - Information Technology</option>
            <option value="ADS">ADS - AI & Data Science</option>
          </select>
        </div>

        <div>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Years</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
      </form>

      {/* Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            Registered Students ({students.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center text-slate-500">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            No students found matching query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">Student Name</th>
                  <th className="py-3 px-4">Register No</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Dept & Year</th>
                  <th className="py-3 px-4 text-center">Participations</th>
                  <th className="py-3 px-4 text-center">Streak</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Credits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-850/50 transition">
                    <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-extrabold text-sm">
                        {s.name.charAt(0)}
                      </div>
                      {s.name}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-400">{s.registerNumber || "N/A"}</td>
                    <td className="py-4 px-4 text-slate-400">{s.email}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md text-xs font-semibold mr-2">
                        {s.department || "IT"}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md text-xs">
                        Yr {s.year || 3}-{s.studentProfile?.section || "A"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-white">
                      {s.studentProfile?.totalParticipations || 0} Times
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-950/80 border border-orange-800 text-orange-400 rounded-md text-xs font-bold">
                        <Flame className="w-3.5 h-3.5 fill-orange-400" />
                        {s.studentProfile?.currentStreak || 0} Days
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-extrabold text-amber-400 text-base">
                      {s.studentProfile?.currentCredits || 0} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
