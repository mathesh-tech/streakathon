"use client";

import { Award, Download, QrCode, Search, ShieldCheck } from "lucide-react";

export default function CertificatesPage() {
  const certificates = [
    {
      id: "CERT-9982-A",
      hackathon: "Streakathon #15: AI & Automation",
      type: "First Place Winner",
      date: "Oct 16, 2026",
      color: "from-yellow-500/20 to-yellow-600/20",
      borderColor: "border-yellow-500/30",
      iconColor: "text-yellow-500",
      verified: true
    },
    {
      id: "CERT-8821-B",
      hackathon: "Streakathon #14: Cloud Computing",
      type: "Top 10 Performer",
      date: "Sep 30, 2026",
      color: "from-emerald-500/20 to-emerald-600/20",
      borderColor: "border-emerald-500/30",
      iconColor: "text-emerald-500",
      verified: true
    },
    {
      id: "CERT-7734-C",
      hackathon: "Streakathon #13: Web3 Horizons",
      type: "Participation",
      date: "Aug 20, 2026",
      color: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-500",
      verified: true
    }
  ];

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Certificate Vault</h1>
          <p className="text-muted-foreground">Download and verify your hackathon achievements.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search certificates..." 
            className="w-full md:w-64 h-10 bg-background/50 border border-white/10 rounded-xl px-10 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="group glass-card rounded-3xl overflow-hidden border-white/5 hover:border-white/20 transition-all hover:-translate-y-1">
            {/* Certificate Preview (Visual representation) */}
            <div className={`h-48 w-full bg-gradient-to-br ${cert.color} p-6 relative flex flex-col items-center justify-center text-center border-b ${cert.borderColor}`}>
              <div className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm rounded-full p-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <Award className={`w-12 h-12 ${cert.iconColor} mb-4`} />
              <div className="text-white font-bold text-lg leading-tight mb-1">STREAKATHON</div>
              <div className="text-white/80 text-xs font-medium uppercase tracking-widest">{cert.type}</div>
            </div>
            
            <div className="p-6">
              <h3 className="font-bold text-lg mb-1 truncate">{cert.hackathon}</h3>
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-muted-foreground">Issued: {cert.date}</span>
                <span className="text-xs font-mono text-muted-foreground">{cert.id}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary h-10 rounded-xl text-sm font-semibold transition-colors">
                  <Download className="w-4 h-4" /> Download
                </button>
                <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white h-10 rounded-xl text-sm font-semibold transition-colors">
                  <QrCode className="w-4 h-4" /> Verify
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
