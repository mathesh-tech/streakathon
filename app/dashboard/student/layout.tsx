import { Sidebar } from "@/components/layout/Sidebar";
import { GamificationSystem } from "@/components/dashboard/student/GamificationSystem";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      <GamificationSystem />
      <Sidebar role="student" />
      <div className="flex-1 min-h-[calc(100vh-4rem)] bg-background">
        {children}
      </div>
    </div>
  );
}
