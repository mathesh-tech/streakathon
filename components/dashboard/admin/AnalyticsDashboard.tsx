"use client";

import { useEffect, useState } from "react";
import { Users, ShieldAlert, Award, BarChart3, TrendingUp, TrendingDown, Building2, PieChart as PieIcon } from "lucide-react";
import { getDashboardKPIs, getParticipationTrends, getDepartmentBreakdown, getClassWiseBreakdown, getLeaderboardInsights } from "@/actions/analytics";
import { ParticipationChart, DepartmentPieChart, ClassWiseBarChart } from "./charts/AnalyticsCharts";
import { ReportGenerator } from "./reports/ReportGenerator";

export function AnalyticsDashboard() {
  const [kpis, setKpis] = useState<any>(null);
  const [participation, setParticipation] = useState<any>(null);
  const [departmentData, setDepartmentData] = useState<any>([]);
  const [classData, setClassData] = useState<any>([]);
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [kpiData, partData, deptData, clsData, leadData] = await Promise.all([
          getDashboardKPIs(),
          getParticipationTrends(),
          getDepartmentBreakdown(),
          getClassWiseBreakdown(),
          getLeaderboardInsights()
        ]);
        setKpis(kpiData);
        setParticipation(partData);
        setDepartmentData(deptData);
        setClassData(clsData);
        setLeaderboard(leadData);
      } catch (e) {
        console.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !kpis) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 shadow-sm p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
          <div className="text-slate-400 text-sm font-medium mb-1 flex items-center">
            <Users className="h-4 w-4 mr-2 text-blue-400"/> Total Registered Students
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-white">{kpis.totalStudents} <span className="text-xs text-slate-400 font-normal">Students</span></div>
            <div className="flex items-center text-xs text-emerald-400 font-bold">
              <TrendingUp className="w-3 h-3 mr-1" /> Active
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 shadow-sm p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
          <div className="text-slate-400 text-sm font-medium mb-1 flex items-center">
            <Building2 className="h-4 w-4 mr-2 text-amber-400"/> IT Department
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-white">
              {departmentData.find((d: any) => d.name.includes("IT"))?.count || 0}
              <span className="text-xs text-slate-400 font-normal"> Students</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 shadow-sm p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
          <div className="text-slate-400 text-sm font-medium mb-1 flex items-center">
            <Building2 className="h-4 w-4 mr-2 text-amber-400"/> ADS Department
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-white">
              {departmentData.find((d: any) => d.name.includes("ADS"))?.count || 0}
              <span className="text-xs text-slate-400 font-normal"> Students</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 shadow-sm p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
          <div className="text-slate-400 text-sm font-medium mb-1 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-emerald-400"/> Active Teams & Projects
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-white">{kpis.totalTeams} Teams</div>
            <div className="text-xs text-emerald-400 font-bold">{kpis.projectsSubmitted} Submitted</div>
          </div>
        </div>
      </div>

      {/* IT vs ADS Department Pie Chart & Class Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-slate-900 border border-slate-800 shadow-sm p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-amber-400" />
              Department Participation Pie Chart
            </h2>
            <span className="text-xs text-slate-400">IT vs ADS Distribution</span>
          </div>
          <DepartmentPieChart data={departmentData} />
        </section>

        <section className="bg-slate-900 border border-slate-800 shadow-sm p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Class-wise Participation Breakdown
            </h2>
            <span className="text-xs text-slate-400">Class Section Distribution</span>
          </div>
          <ClassWiseBarChart data={classData} />
        </section>
      </div>

      {/* Daily Participation Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="bg-slate-900 border border-slate-800 shadow-sm p-6 rounded-2xl lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-6">Daily Active Participation Trends</h2>
          <ParticipationChart data={participation} />
        </section>

        <ReportGenerator />
      </div>
    </div>
  );
}
