import { Sidebar } from "@/components/layout/Sidebar";

export default function AmbassadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full">
      <Sidebar role="ambassador" />
      <div className="flex-1 min-h-[calc(100vh-4rem)] bg-background">
        {children}
      </div>
    </div>
  );
}
