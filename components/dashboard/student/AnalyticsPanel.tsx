"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, TrendingUp } from "lucide-react";

const participationData = [
  { month: 'Jan', participations: 1 },
  { month: 'Feb', participations: 2 },
  { month: 'Mar', participations: 3 },
  { month: 'Apr', participations: 2 },
  { month: 'May', participations: 4 },
  { month: 'Jun', participations: 0 },
];

const creditData = [
  { month: 'Jan', credits: 100 },
  { month: 'Feb', credits: 250 },
  { month: 'Mar', credits: 400 },
  { month: 'Apr', credits: 550 },
  { month: 'May', credits: 850 },
  { month: 'Jun', credits: 850 },
];

export function AnalyticsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      {/* Participation Chart */}
      <div className="glass-card rounded-3xl p-6 border-white/5 flex flex-col h-[400px]">
        <div className="mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Monthly Participation
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Hackathons registered per month</p>
        </div>
        <div className="flex-1 min-h-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={participationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="month" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: '#ffffff10' }}
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="participations" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Credit Growth Chart */}
      <div className="glass-card rounded-3xl p-6 border-white/5 flex flex-col h-[400px]">
        <div className="mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" /> Credit Point Growth
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Cumulative points earned this semester</p>
        </div>
        <div className="flex-1 min-h-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={creditData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="month" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Area type="monotone" dataKey="credits" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCredits)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
