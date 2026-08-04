"use client";

import { useEffect, useState } from "react";
import { getDepartmentBreakdown, getClassWiseBreakdown } from "@/actions/analytics";
import { DepartmentPieChart, ClassWiseBarChart } from "@/components/dashboard/admin/charts/AnalyticsCharts";
import { PieChart as PieIcon, BarChart3, Building2 } from "lucide-react";

export function AmbassadorAnalyticsSection() {
  const [departmentData, setDepartmentData] = useState<any>([]);
  const [classData, setClassData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [deptData, clsData] = await Promise.all([
          getDepartmentBreakdown(),
          getClassWiseBreakdown()
        ]);
        setDepartmentData(deptData);
        setClassData(clsData);
      } catch (err) {
        console.error("Failed to load ambassador analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Department Pie Chart */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-amber-400" />
              Department Participation Pie Chart
            </h3>
            <span className="text-xs text-slate-400">IT vs ADS Distribution</span>
          </div>
          <DepartmentPieChart data={departmentData} />
        </div>

        {/* Class-wise Breakdown */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Class-wise Breakdown
            </h3>
            <span className="text-xs text-slate-400">Class A, B, C</span>
          </div>
          <ClassWiseBarChart data={classData} />
        </div>

      </div>
    </div>
  );
}
