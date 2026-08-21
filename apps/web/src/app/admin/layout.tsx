import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard - QuickDidi",
  description: "Manage QuickDidi platform operations.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 flex flex-col">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden h-16 border-b border-border/40 bg-card flex items-center px-4 shrink-0">
          <span className="font-extrabold text-lg text-primary">QuickDidi Admin</span>
        </header>
        
        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
