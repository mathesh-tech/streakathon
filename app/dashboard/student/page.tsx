import { WelcomeCard } from "@/components/dashboard/student/WelcomeCard";
import { QuickActions } from "@/components/dashboard/student/QuickActions";
import { OverviewGrid } from "@/components/dashboard/student/OverviewGrid";
import { CreditProgress } from "@/components/dashboard/student/CreditProgress";
import { StreakTimeline } from "@/components/dashboard/student/StreakTimeline";
import { RecentActivity } from "@/components/dashboard/student/RecentActivity";
import { UpcomingHackathonMini } from "@/components/dashboard/student/UpcomingHackathonMini";

import { AnalyticsPanel } from "@/components/dashboard/student/AnalyticsPanel";

export default function StudentDashboard() {
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
    avatar: null,
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
        <div className="lg:col-span-2">
          <AnalyticsPanel />
        </div>
        <div className="space-y-8">
          <UpcomingHackathonMini />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
