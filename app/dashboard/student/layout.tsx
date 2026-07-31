import { Sidebar } from "@/components/layout/Sidebar";

import { GamificationSystem } from "@/components/dashboard/student/GamificationSystem";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full">
      <GamificationSystem />
      <Sidebar role="student" />
      <div className="flex-1 min-h-[calc(100vh-4rem)] bg-background">
        {children}
      </div>
    </div>
  );
}
