import { Sidebar } from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full">
      <Sidebar role="admin" />
      <div className="flex-1 min-h-[calc(100vh-4rem)] bg-background">
        {children}
      </div>
    </div>
  );
}
