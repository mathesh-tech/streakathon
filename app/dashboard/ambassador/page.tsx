import { QrCode, Users, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function AmbassadorDashboard() {
  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-2xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-500">Ambassador Portal</h1>
          <p className="text-muted-foreground">Manage Saturday Labs & Team Verification</p>
        </div>
        <div className="flex items-center px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20">
          <ShieldCheck className="h-5 w-5 mr-2" />
          <span className="font-bold">Active Duty</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          <section className="glass p-6 rounded-2xl border-t-4 border-t-emerald-500">
            <h2 className="text-xl font-bold mb-4 flex items-center"><Users className="h-5 w-5 mr-2 text-emerald-500"/> Live Team Verification</h2>
            <p className="text-muted-foreground mb-6">Verify attendance for teams in Lab 3 (IT Block).</p>
            
            <div className="space-y-4">
              {[
                { name: "Team Horizon", code: "HX-92LA", members: 3, status: "pending" },
                { name: "Null Pointers", code: "NP-11XB", members: 4, status: "verified" },
                { name: "Runtime Terror", code: "RT-44ZZ", members: 2, status: "pending" },
              ].map((team, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-background/40 rounded-xl border border-border/40 gap-4">
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                      <Users className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{team.name}</div>
                      <div className="text-xs text-muted-foreground font-mono bg-background px-2 py-0.5 rounded mt-1 inline-block">Code: {team.code} • {team.members} Members</div>
                    </div>
                  </div>
                  
                  {team.status === "verified" ? (
                    <div className="flex items-center text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-lg font-medium w-full sm:w-auto justify-center">
                      <CheckCircle className="h-5 w-5 mr-2" /> Verified
                    </div>
                  ) : (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-emerald-500 hover:text-foreground h-9 px-4 py-2">
                        Verify
                      </button>
                      <button className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-destructive hover:text-destructive-foreground h-9 px-4 py-2">
                        Mark Absent
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Side Column */}
        <div className="space-y-8">
          
          <section className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="bg-white p-4 rounded-xl mb-6 shadow-lg">
              <QrCode className="h-32 w-32 text-black" />
            </div>
            <h3 className="font-bold text-xl mb-2">Check-in Scanner</h3>
            <p className="text-muted-foreground text-sm mb-6">Students can scan this QR code or you can scan their team code to verify attendance instantly.</p>
            <Link href="/dashboard/ambassador/attendance" className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-emerald-600 text-foreground shadow hover:bg-emerald-700 h-10 px-4 py-2">
              Open Camera Scanner
            </Link>
          </section>

          <section className="glass p-6 rounded-2xl">
            <h3 className="font-bold mb-4 flex items-center"><AlertTriangle className="h-5 w-5 mr-2 text-orange-500" /> Pending Actions</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-orange-500/10 text-orange-500 rounded-lg border border-orange-500/20">
                2 Teams missing from Lab 3.
              </div>
              <div className="p-3 bg-background/50 rounded-lg border border-border/50">
                1 Team requested hardware assistance.
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
