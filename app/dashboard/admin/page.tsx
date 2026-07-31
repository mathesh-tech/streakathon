import { Settings, BarChart3, Edit, Plus, Users, Shield, ShieldAlert, Award } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-2xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-indigo-500">Admin Control Center</h1>
          <p className="text-muted-foreground">Manage events, credits, and platform settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors font-medium">
            <Plus className="h-4 w-4 mr-2" /> New Hackathon
          </button>
          <button className="flex items-center px-4 py-2 bg-background/50 rounded-lg border border-border/50 hover:bg-background transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass p-6 rounded-2xl flex flex-col justify-center">
          <div className="text-muted-foreground text-sm font-medium mb-1 flex items-center"><Users className="h-4 w-4 mr-2 text-indigo-400"/> Total Students</div>
          <div className="text-3xl font-bold text-foreground">642</div>
        </div>
        <div className="glass p-6 rounded-2xl flex flex-col justify-center">
          <div className="text-muted-foreground text-sm font-medium mb-1 flex items-center"><Award className="h-4 w-4 mr-2 text-indigo-400"/> Avg. Streak</div>
          <div className="text-3xl font-bold text-foreground">4.2</div>
        </div>
        <div className="glass p-6 rounded-2xl flex flex-col justify-center">
          <div className="text-muted-foreground text-sm font-medium mb-1 flex items-center"><ShieldAlert className="h-4 w-4 mr-2 text-indigo-400"/> Active Shields</div>
          <div className="text-3xl font-bold text-foreground">89</div>
        </div>
        <div className="glass p-6 rounded-2xl flex flex-col justify-center">
          <div className="text-muted-foreground text-sm font-medium mb-1 flex items-center"><BarChart3 className="h-4 w-4 mr-2 text-indigo-400"/> Avg Completion</div>
          <div className="text-3xl font-bold text-foreground">92%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Event Manager */}
        <div className="xl:col-span-2 space-y-8">
          
          <section className="glass-card rounded-2xl p-6 md:p-8 border-t-4 border-t-indigo-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Hackathon Manager</h2>
              <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Live System</span>
            </div>
            
            <div className="space-y-4">
              {/* Active Hackathon */}
              <div className="p-4 bg-background/50 rounded-xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                    <span className="font-bold">Sprint #12: FinTech & AI</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Status: LIVE • Submissions close in 5h 42m</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm bg-background border border-border/50 rounded flex items-center hover:bg-accent transition-colors">
                    <Edit className="h-4 w-4 mr-1" /> Edit Drop
                  </button>
                  <button className="px-3 py-1.5 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded flex items-center hover:bg-destructive/20 transition-colors">
                    Force Close
                  </button>
                </div>
              </div>

              {/* Draft Hackathon */}
              <div className="p-4 bg-background/40 rounded-xl border border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground mr-2"></span>
                    <span className="font-bold text-muted-foreground">Sprint #13: Open Source</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Status: DRAFT • Scheduled for Next Saturday</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm bg-background border border-border/50 rounded flex items-center hover:bg-accent transition-colors">
                    <Edit className="h-4 w-4 mr-1" /> Configure
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="glass p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Credit Engine Overrides</h2>
            <div className="bg-background/50 p-4 rounded-xl border border-border/50">
              <form className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Student Roll Number</label>
                  <input type="text" className="w-full bg-background border border-border/50 rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="e.g. 732921IT112" />
                </div>
                <div className="w-full md:w-32">
                  <label className="text-xs text-muted-foreground mb-1 block">Action</label>
                  <select className="w-full bg-background border border-border/50 rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option>Add Credits</option>
                    <option>Grant Shield</option>
                    <option>Fix Streak</option>
                  </select>
                </div>
                <div className="w-full md:w-24">
                  <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
                  <input type="number" className="w-full bg-background border border-border/50 rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="+100" />
                </div>
                <div className="flex items-end">
                  <button type="button" className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-foreground rounded-md text-sm font-medium transition-colors w-full md:w-auto">
                    Apply
                  </button>
                </div>
              </form>
            </div>
          </section>

        </div>

        {/* Side Column */}
        <div className="space-y-8">
          
          <section className="glass p-6 rounded-2xl">
            <h3 className="font-bold mb-4 flex items-center"><Shield className="h-5 w-5 mr-2 text-indigo-400" /> System Audit Logs</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start border-b border-border/40 pb-3">
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex-shrink-0 flex items-center justify-center text-xs">F1</div>
                <div>
                  <div className="text-sm"><span className="font-medium text-indigo-400">Prof. Ramesh</span> unlocked Sprint #12 early.</div>
                  <div className="text-xs text-muted-foreground mt-1">10 mins ago</div>
                </div>
              </div>
              <div className="flex gap-3 items-start border-b border-border/40 pb-3">
                <div className="h-8 w-8 rounded-full bg-orange-500/20 flex-shrink-0 flex items-center justify-center text-xs">SYS</div>
                <div>
                  <div className="text-sm"><span className="font-medium text-orange-400">System</span> applied 1.5x streak multiplier to Team Null Pointers.</div>
                  <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                </div>
              </div>
              <div className="flex gap-3 items-start pb-1">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex-shrink-0 flex items-center justify-center text-xs">AM</div>
                <div>
                  <div className="text-sm"><span className="font-medium text-emerald-400">Ambassador (IT-C)</span> manually verified 4 teams.</div>
                  <div className="text-xs text-muted-foreground mt-1">3 hours ago</div>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
              View Full Logs →
            </button>
          </section>

          <section className="glass p-6 rounded-2xl border-t-4 border-t-purple-500">
            <h3 className="font-bold mb-4">Certificate Generator</h3>
            <p className="text-sm text-muted-foreground mb-4">Sprint #11 evaluation is complete. Certificates are ready for bulk issuance.</p>
            <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-purple-600 text-foreground shadow hover:bg-purple-700 h-10 px-4 py-2">
              Generate & Publish Certificates
            </button>
          </section>

        </div>
      </div>
    </div>
  )
}
