import Link from "next/link"
import { ArrowLeft, User, Shield, GraduationCap } from "lucide-react"

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden px-4">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full" />
      </div>

      <div className="z-10 w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="glass-card rounded-2xl p-8 border-t-4 border-t-primary shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Select your demo persona to enter STREAKATHON.</p>
          </div>
          
          <div className="space-y-4">
            <Link href="/dashboard/student" className="flex items-center p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-primary/10 hover:border-primary/50 transition-all group">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-foreground">Student Hacker</h3>
                <p className="text-xs text-muted-foreground">Access live hackathon & leaderboards</p>
              </div>
            </Link>

            <Link href="/dashboard/ambassador" className="flex items-center p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all group">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <User className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-foreground">Ambassador</h3>
                <p className="text-xs text-muted-foreground">Manage attendance & monitor teams</p>
              </div>
            </Link>

            <Link href="/dashboard/admin" className="flex items-center p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all group">
              <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Shield className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-foreground">Admin / Faculty</h3>
                <p className="text-xs text-muted-foreground">Manage events, credits & certificates</p>
              </div>
            </Link>
          </div>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            Sona College of Technology • Dept of Information Technology
          </div>
        </div>
      </div>
    </div>
  )
}
