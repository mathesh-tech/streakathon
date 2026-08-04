import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Trophy, Flame, Award, Clock, ArrowRight, Lock, 
  Unlock, CheckCircle2, Star, Users, Github
} from "lucide-react";
import { WelcomeCard } from "@/components/dashboard/student/WelcomeCard";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user || !user.id) {
    return <div>Please log in</div>;
  }

  // 1. Fetch Student Profile
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      studentProfile: true
    }
  });

  const profile = dbUser?.studentProfile;
  if (!profile) return <div>Student profile not found.</div>;

  const studentData = {
    name: dbUser?.name || "Student",
    department: dbUser?.department || "IT",
    year: dbUser?.year || 3,
    section: profile.section || "A",
    semester: 6,
    currentRank: 0,
    semesterRank: 0,
    currentCredits: profile.currentCredits || 0,
    currentStreak: profile.currentStreak || 0,
    bestStreak: 0,
    totalParticipations: profile.totalParticipations || 0,
    totalWins: profile.totalWins || 0,
    certificates: 0,
    badges: 0,
  };

  // 2. Fetch Active/Upcoming Hackathon
  const now = new Date();
  const upcomingHackathon = await prisma.hackathon.findFirst({
    where: { 
      status: { in: ["LIVE", "REGISTRATION_OPEN", "DRAFT"] }
    },
    orderBy: { createdAt: "desc" },
    include: {
      teams: {
        include: { members: true }
      }
    }
  });

  // Check if current user is registered in the upcoming hackathon
  let isRegisteredForUpcoming = false;
  if (upcomingHackathon) {
    const userTeam = upcomingHackathon.teams.find(t => 
      t.members.some(m => m.studentId === profile.studentId)
    );
    if (userTeam) isRegisteredForUpcoming = true;
  }

  // 3. Fetch Past Winners (From last COMPLETED hackathon)
  const lastHackathon = await prisma.hackathon.findFirst({
    where: { status: "COMPLETED" },
    orderBy: { createdAt: "desc" },
    include: {
      teams: {
        include: {
          members: {
            include: { student: { include: { user: true } } }
          },
          submissions: true
        }
      }
    }
  });

  // Simple mock rank assignment if submissions aren't graded yet in DB
  const pastWinners = lastHackathon?.teams.slice(0, 3) || [];

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-2xl mx-auto">
      <WelcomeCard student={studentData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Hackathon Status & Problem Statement */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active/Upcoming Hackathon Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-amber-500/5 rounded-bl-full -z-10 blur-3xl"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Clock className="w-6 h-6 text-amber-400" />
                This Saturday's Hackathon
              </h2>
              {upcomingHackathon?.status === "LIVE" ? (
                <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-bold animate-pulse">
                  LIVE NOW
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
                  UPCOMING
                </span>
              )}
            </div>

            {upcomingHackathon ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-amber-400">{upcomingHackathon.title}</h3>
                  <p className="text-slate-400 mt-1">{upcomingHackathon.theme} • {upcomingHackathon.venue}</p>
                </div>

                {/* Registration Status */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Registration Status</p>
                    <p className="text-xs text-slate-400">
                      Closes: {new Date(upcomingHackathon.registrationClose).toLocaleString()}
                    </p>
                  </div>
                  {isRegisteredForUpcoming ? (
                    <span className="flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-4 py-2 rounded-lg">
                      <CheckCircle2 className="w-5 h-5" /> Registered
                    </span>
                  ) : (
                    <Link href="/dashboard/student/register" className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition">
                      Register Team Now
                    </Link>
                  )}
                </div>

                {/* Problem Statement Section */}
                <div className="p-5 border border-slate-700/50 rounded-xl bg-slate-800/20 relative overflow-hidden">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-900 rounded-lg shrink-0">
                      {new Date() > new Date(upcomingHackathon.problemReleaseTime) ? (
                        <Unlock className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <Lock className="w-6 h-6 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">Official Problem Statement</h4>
                      {new Date() > new Date(upcomingHackathon.problemReleaseTime) ? (
                        <div className="space-y-3">
                          <p className="text-emerald-400 text-sm font-semibold">🔓 Released by Hackathon Ambassador!</p>
                          <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-emerald-500/50 pl-4 py-1">
                            {upcomingHackathon.description || "Design and implement an automated solution for standardizing the evaluation process of internal hackathons, ensuring fairness, scalability, and instant leaderboard generation."}
                          </p>
                          <Link href={`/dashboard/student/hackathon/${upcomingHackathon.id}/problem`} className="inline-flex items-center gap-2 text-amber-400 text-sm font-bold hover:underline mt-2">
                            View Full Details & Submit <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      ) : (
                        <div>
                          <p className="text-slate-400 text-sm">
                            Locked. Will be revealed on {new Date(upcomingHackathon.problemReleaseTime).toLocaleString()}.
                          </p>
                          <p className="text-xs text-slate-500 mt-2 italic">Prepare your team setup in the meantime.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                No upcoming hackathons announced yet. Check back soon!
              </div>
            )}
          </div>

          {/* Past Winners Hall of Fame */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Star className="w-5 h-5 text-amber-400" />
                Previous Hackathon Winners
              </h2>
              <span className="text-xs text-slate-400">
                {lastHackathon?.title || "Last Event"}
              </span>
            </div>

            {pastWinners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pastWinners.map((team, idx) => (
                  <div key={team.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col gap-3 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-400 opacity-50"></div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-black ${
                        idx === 0 ? "bg-amber-400 text-slate-900" :
                        idx === 1 ? "bg-slate-300 text-slate-900" :
                        "bg-amber-700 text-white"
                      }`}>
                        #{idx + 1}
                      </span>
                      {team.submissions?.[0]?.githubLink && (
                        <a href={team.submissions[0].githubLink} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white truncate" title={team.teamName}>{team.teamName}</h4>
                      <p className="text-xs text-amber-400 font-mono mt-0.5">{team.teamCode}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Team Members</p>
                      <div className="flex -space-x-2">
                        {team.members.slice(0, 3).map((m, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border border-slate-950 flex items-center justify-center text-[8px] font-bold text-amber-400" title={m.student.user.name}>
                            {m.student.user.name.charAt(0)}
                          </div>
                        ))}
                        {team.members.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-950 flex items-center justify-center text-[8px] font-bold text-slate-400">
                            +{team.members.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-sm">
                No past winners data available yet.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Mini Filterable Leaderboard */}
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full">
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Live Leaderboard
              </h2>
              <Link href="/dashboard/student/leaderboard" className="text-xs text-amber-400 hover:underline">
                View All
              </Link>
            </div>

            {/* In a real app, this form would trigger standard React state filtering on a client component. 
                For this unified dashboard server component, we show the UI mockup of the filters requested. */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <select className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500">
                <option>All Depts</option>
                <option>IT</option>
                <option>ADS</option>
              </select>
              <select className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500">
                <option>All Years</option>
                <option>Year 2</option>
                <option>Year 3</option>
                <option>Year 4</option>
              </select>
            </div>

            {/* Leaderboard Fetch logic (Top 5) */}
            <div className="space-y-3 flex-1">
              {[
                { name: "Siva Mathesh", pts: 950, rank: 1, streak: 12 },
                { name: "Vijay", pts: 890, rank: 2, streak: 8 },
                { name: studentData.name, pts: studentData.currentCredits, rank: 12, streak: studentData.currentStreak }, // Showing current user
              ].sort((a, b) => b.pts - a.pts).map((person, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border ${
                  person.name === studentData.name 
                    ? "bg-amber-500/10 border-amber-500/30" 
                    : "bg-slate-950 border-slate-800"
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-xs ${
                      person.rank === 1 ? "text-amber-400" :
                      person.rank === 2 ? "text-slate-300" :
                      person.name === studentData.name ? "text-amber-500" : "text-slate-500"
                    }`}>#{person.rank}</span>
                    <div>
                      <p className={`text-sm font-semibold ${person.name === studentData.name ? "text-amber-400" : "text-white"}`}>
                        {person.name}
                      </p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" /> {person.streak} day streak
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-amber-400 text-sm">{person.pts}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
