import { WelcomeCard } from "@/components/dashboard/student/WelcomeCard";
import { QuickActions } from "@/components/dashboard/student/QuickActions";
import { OverviewGrid } from "@/components/dashboard/student/OverviewGrid";
import { CreditProgress } from "@/components/dashboard/student/CreditProgress";
import { StreakTimeline } from "@/components/dashboard/student/StreakTimeline";
import { RecentActivity } from "@/components/dashboard/student/RecentActivity";
import { UpcomingHackathonMini } from "@/components/dashboard/student/UpcomingHackathonMini";

import { AnalyticsPanel } from "@/components/dashboard/student/AnalyticsPanel";
import { QRTicketGenerator } from "@/components/dashboard/student/QRTicketGenerator";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  let hackathons: { id: string, title: string }[] = [];
  if (user && user.id) {
    try {
      const student = await prisma.student.findUnique({
        where: { userId: user.id },
        include: {
          registrations: {
            include: {
              hackathon: true
            }
          }
        }
      });
      
      if (student) {
        hackathons = student.registrations.map(r => ({
          id: r.hackathon.id,
          title: r.hackathon.title
        }));
      }
    } catch (error) {
      console.warn("Database unreachable, using mock hackathons data.");
      hackathons = [
        { id: "mock-1", title: "Streakathon #15 - AI & Automation" },
        { id: "mock-2", title: "Streakathon #14 - Web3 & Blockchain" }
      ];
    }
  }

  // Mock Data (will be replaced by Prisma backend later)
  const student = {
    name: "Siva Mathesh",
    department: "IT",
    year: 3,
    section: "A",
    semester: 6,
    currentRank: 12,
    semesterRank: 5,
    currentCredits: 850,
    currentStreak: 5,
    bestStreak: 7,
    totalParticipations: 12,
    totalWins: 3,
    certificates: 15,
    badges: 8,
    avatar: undefined,
  };

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-2xl mx-auto">
      <WelcomeCard student={student} />
      
      <QuickActions />

      <OverviewGrid student={student} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CreditProgress current={student.currentCredits} goal={1000} />
        <StreakTimeline currentStreak={student.currentStreak} bestStreak={student.bestStreak} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AnalyticsPanel />
          <RecentActivity />
        </div>
        <div className="space-y-8">
          <QRTicketGenerator hackathons={hackathons} />
          <UpcomingHackathonMini />
        </div>
      </div>
    </div>
  );
}
