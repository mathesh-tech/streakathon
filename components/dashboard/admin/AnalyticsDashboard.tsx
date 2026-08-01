"use client";

import { useEffect, useState } from "react";
import { Users, ShieldAlert, Award, BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getDashboardKPIs, getParticipationTrends, getCreditDistribution, getLeaderboardInsights } from "@/actions/analytics";
import { ParticipationChart, CreditDistributionChart } from "./charts/AnalyticsCharts";
import { ReportGenerator } from "./reports/ReportGenerator";

export function AnalyticsDashboard() {
  const [kpis, setKpis] = useState<any>(null);
  const [participation, setParticipation] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [kpiData, partData, credData, leadData] = await Promise.all([
          getDashboardKPIs(),
          getParticipationTrends(),
          getCreditDistribution(),
          getLeaderboardInsights()
        ]);
        setKpis(kpiData);
        setParticipation(partData);
        setCredits(credData);
        setLeaderboard(leadData);
      } catch (e) {
        console.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !kpis) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
          <div className="text-muted-foreground text-sm font-medium mb-1 flex items-center">
            <Users className="h-4 w-4 mr-2 text-indigo-400"/> Total Students
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-foreground">{kpis.totalStudents}</div>
            <div className="flex items-center text-xs text-emerald-500 font-bold">
              <TrendingUp className="w-3 h-3 mr-1" /> +12%
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
          <div className="text-muted-foreground text-sm font-medium mb-1 flex items-center">
            <Award className="h-4 w-4 mr-2 text-emerald-400"/> Avg. Credits
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-foreground">{kpis.averageCredits}</div>
            <div className="flex items-center text-xs text-emerald-500 font-bold">
              <TrendingUp className="w-3 h-3 mr-1" /> +5%
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
          <div className="text-muted-foreground text-sm font-medium mb-1 flex items-center">
            <ShieldAlert className="h-4 w-4 mr-2 text-amber-400"/> Attendance
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-foreground">{kpis.attendancePercentage}%</div>
            <div className="flex items-center text-xs text-rose-500 font-bold">
              <TrendingDown className="w-3 h-3 mr-1" /> -2%
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
          <div className="text-muted-foreground text-sm font-medium mb-1 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-blue-400"/> Submissions
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-foreground">{kpis.projectsSubmitted}</div>
            <div className="flex items-center text-xs text-muted-foreground font-bold">
              <Minus className="w-3 h-3 mr-1" /> 0%
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-2xl lg:col-span-2">
          <h2 className="text-xl font-bold mb-6">Daily Active Participation</h2>
          <ParticipationChart data={participation} />
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-6">Credit Distribution</h2>
          <CreditDistributionChart data={credits} />
        </section>
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-2xl lg:col-span-2 border-t-4 border-t-amber-500">
          <h2 className="text-xl font-bold mb-6">Leaderboard Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Top Performers</h3>
              <div className="space-y-3">
                {leaderboard?.topPerformers?.map((p: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-sm">{p.name}</span>
                    <span className="text-amber-500 font-bold text-sm">{p.credits} pts</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Longest Streak</h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-bold">{leaderboard?.longestStreak?.name || 'N/A'}</span>
                  <span className="bg-amber-500/20 text-amber-500 px-2 py-1 rounded-md text-xs font-bold">
                    {leaderboard?.longestStreak?.streak || 0} 🔥
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Most Wins</h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-bold">{leaderboard?.mostWins?.name || 'N/A'}</span>
                  <span className="bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded-md text-xs font-bold">
                    {leaderboard?.mostWins?.wins || 0} 🏆
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Report Generator */}
        <ReportGenerator />
      </div>
    </div>
  );
}
