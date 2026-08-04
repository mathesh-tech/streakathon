import { Sidebar } from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      <Sidebar role="admin" />
      <div className="flex-1 min-h-[calc(100vh-4rem)] bg-background">
        {children}
      </div>
    </div>
  );
}
