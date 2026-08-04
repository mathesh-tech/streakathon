import { QrCode, Users, CheckCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AmbassadorAnalyticsSection } from "@/components/dashboard/ambassador/AmbassadorAnalyticsSection";

export default function AmbassadorDashboard() {
  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-2xl mx-auto text-slate-100">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-400">Ambassador Portal</h1>
          <p className="text-slate-400 text-sm">Monitor Department & Class Participation, Verify Teams & Lab Attendance</p>
        </div>
        <div className="flex items-center px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
          <ShieldCheck className="h-5 w-5 mr-2" />
          <span className="font-bold">Active Ambassador</span>
        </div>
      </header>

      {/* Analytics Module: IT & ADS Department Pie Chart + Class Breakdown */}
      <AmbassadorAnalyticsSection />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 border-t-4 border-t-emerald-500">
            <h2 className="text-xl font-bold mb-4 flex items-center text-white"><Users className="h-5 w-5 mr-2 text-emerald-400"/> Live Team Verification</h2>
            <p className="text-slate-400 text-sm mb-6">Verify attendance for teams in Lab 3 (IT Block).</p>
            
            <div className="space-y-4">
              {[
                { name: "Sona Innovators", code: "SONA-01", members: 4, status: "verified" },
                { name: "Team Horizon", code: "HX-92LA", members: 3, status: "pending" },
                { name: "Null Pointers", code: "NP-11XB", members: 4, status: "pending" },
              ].map((team, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 gap-4">
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                      <Users className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-white">{team.name}</div>
                      <div className="text-xs text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded mt-1 inline-block">Code: {team.code} • {team.members} Members</div>
                    </div>
                  </div>
                  
                  {team.status === "verified" ? (
                    <div className="flex items-center text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-lg font-medium w-full sm:w-auto justify-center">
                      <CheckCircle className="h-5 w-5 mr-2" /> Verified
                    </div>
                  ) : (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-emerald-600 hover:bg-emerald-500 text-slate-950 h-9 px-4 py-2">
                        Verify
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
          
          <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
            <div className="bg-white p-4 rounded-xl mb-6 shadow-lg">
              <QrCode className="h-32 w-32 text-black" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-white">Check-in Scanner</h3>
            <p className="text-slate-400 text-sm mb-6">Students scan QR code or scan team codes to verify attendance instantly.</p>
            <Link href="/dashboard/ambassador/attendance" className="w-full inline-flex items-center justify-center rounded-md text-sm font-bold transition-colors bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow h-10 px-4 py-2">
              Open Camera Scanner
            </Link>
          </section>

        </div>
      </div>
    </div>
  );
}
