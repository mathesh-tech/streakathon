import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Download,
  Calendar,
  Activity,
  Trophy
} from "lucide-react";

export default function ReportsPage() {
  const kpis = [
    { label: "Daily Active Students", value: "342", trend: "+12%", icon: <Activity className="w-5 h-5 text-indigo-400" /> },
    { label: "Weekly Participation", value: "89%", trend: "+5%", icon: <Users className="w-5 h-5 text-emerald-400" /> },
    { label: "Semester Growth", value: "24%", trend: "+24%", icon: <TrendingUp className="w-5 h-5 text-emerald-400" /> },
    { label: "Certificates Generated", value: "1,204", trend: "All-time", icon: <Award className="w-5 h-5 text-yellow-400" /> }
  ];

  const secondaryKpis = [
    { label: "Average Team Size", value: "3.2" },
    { label: "Average Credits / Student", value: "450" },
    { label: "Overall Attendance", value: "94%" },
    { label: "Submission Rate", value: "88%" },
  ];

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-2xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-indigo-500">Analytics & Reports</h1>
          <p className="text-muted-foreground">Comprehensive insights into student engagement and platform health.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-4 py-2 bg-indigo-500 text-foreground rounded-lg hover:bg-indigo-600 transition-colors font-medium text-sm">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </button>
        </div>
      </header>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="glass p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden border border-black/5">
            <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <div className="flex items-center justify-between mb-2 relative z-10">
              <div className="text-muted-foreground text-sm font-medium">{kpi.label}</div>
              {kpi.icon}
            </div>
            <div className="flex items-end gap-3 relative z-10 mt-2">
              <div className="text-3xl font-bold text-foreground">{kpi.value}</div>
              <div className={`text-xs font-bold mb-1 ${kpi.trend.includes('+') ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                {kpi.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <div className="xl:col-span-2 space-y-8">
          {/* Main Chart Area */}
          <section className="glass rounded-2xl p-6 md:p-8 border-t-4 border-t-indigo-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Participation Trends</h2>
              <select className="bg-background/50 border border-border/50 rounded-lg text-sm px-3 py-1.5 focus:outline-none">
                <option>This Semester</option>
                <option>Last Semester</option>
                <option>All Time</option>
              </select>
            </div>
            
            <div className="h-[300px] w-full flex items-end justify-between gap-2 md:gap-4 mt-12 pb-4 border-b border-black/10 relative">
              {/* Mock Bar Chart */}
              {['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'].map((label, i) => {
                const mockHeights = [45, 60, 55, 70, 65, 85, 75, 95];
                const height = mockHeights[i];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                    <div 
                      className="w-full max-w-[40px] bg-indigo-500/20 group-hover:bg-indigo-500/40 rounded-t-md transition-all relative border border-indigo-500/30"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-background px-2 py-1 rounded shadow-lg border border-border">
                        {height}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{label}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center text-xs text-muted-foreground"><span className="w-3 h-3 rounded bg-indigo-500/30 border border-indigo-500/50 mr-2"></span> Registered</div>
              <div className="flex items-center text-xs text-muted-foreground"><span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50 mr-2"></span> Submitted</div>
            </div>
          </section>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {secondaryKpis.map((kpi, i) => (
              <div key={i} className="glass p-4 rounded-xl text-center">
                <div className="text-xs text-muted-foreground mb-1">{kpi.label}</div>
                <div className="text-xl font-bold">{kpi.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          <section className="glass p-6 rounded-2xl">
            <h3 className="font-bold mb-6 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Leaderboard Highlights</h3>
            
            <div className="space-y-6">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">Top Performing Class</div>
                <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="font-bold text-emerald-400">IT - C Section (3rd Yr)</div>
                  <div className="text-sm font-mono font-bold text-emerald-500">14.2k Pts</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">Most Active Student</div>
                <div className="flex items-center gap-3 p-3 bg-black/5 border border-black/10 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">SM</div>
                  <div>
                    <div className="font-bold text-sm">Siva Mathesh</div>
                    <div className="text-xs text-muted-foreground">8 Hackathons • 2150 Pts</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">Fastest Submission</div>
                <div className="flex items-center gap-3 p-3 bg-black/5 border border-black/10 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center font-bold text-orange-400">TN</div>
                  <div>
                    <div className="font-bold text-sm">Team Nexus</div>
                    <div className="text-xs text-muted-foreground">Submitted in 4h 12m</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="glass p-6 rounded-2xl border-t-4 border-t-blue-500">
            <h3 className="font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-500" /> Auto-Generated Reports</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 bg-black/5 hover:bg-black/10 border border-black/5 rounded-xl transition-colors text-sm">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /> End of Semester Report</span>
                <Download className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-black/5 hover:bg-black/10 border border-black/5 rounded-xl transition-colors text-sm">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> Attendance Master List</span>
                <Download className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-black/5 hover:bg-black/10 border border-black/5 rounded-xl transition-colors text-sm">
                <span className="flex items-center gap-2"><Award className="w-4 h-4 text-muted-foreground" /> Winners Archive</span>
                <Download className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
