"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

export function ParticipationChart({ data }: { data: { date: string, activeUsers: number }[] }) {
  if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-slate-500">No data available</div>;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
          <RechartsTooltip 
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
            itemStyle={{ color: '#fff' }}
          />
          <Area type="monotone" dataKey="activeUsers" name="Active Users" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const DEPT_COLORS = ['#3b82f6', '#f59e0b']; // IT: Blue, ADS: Amber

export function DepartmentPieChart({ data }: { data: { name: string; count: number; percentage: number; color?: string }[] }) {
  if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-slate-500">No department data available</div>;

  return (
    <div className="w-full space-y-4">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={5}
              dataKey="count"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={DEPT_COLORS[index % DEPT_COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              formatter={(value: any, name: any, item: any) => [
                `${value} Students (${item.payload.percentage}% of total)`,
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        {data.map((dept, index) => (
          <div key={dept.name} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: DEPT_COLORS[index % DEPT_COLORS.length] }}></span>
              <span className="text-xs font-bold text-white">{dept.name}</span>
            </div>
            <div className="text-lg font-extrabold text-white">
              {dept.count} <span className="text-xs font-normal text-slate-400">Students ({dept.percentage}%)</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${Math.min(dept.percentage, 100)}%`, backgroundColor: DEPT_COLORS[index % DEPT_COLORS.length] }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClassWiseBarChart({ data }: { data: { name: string; count: number; percentage: number }[] }) {
  if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-slate-500">No class breakdown available</div>;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={10} angle={-15} textAnchor="end" tickLine={false} />
          <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
          <RechartsTooltip 
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
            itemStyle={{ color: '#fff' }}
            formatter={(value: any, name: any) => [
              `${value} Students`,
              "Participated"
            ]}
          />
          <Bar dataKey="count" name="Class Participation" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
