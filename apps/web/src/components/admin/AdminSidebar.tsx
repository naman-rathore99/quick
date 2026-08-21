"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CalendarCheck,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { name: "Providers", href: "/admin/providers", icon: Briefcase },
  { name: "Customers", href: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border/40 bg-card hidden md:flex flex-col h-screen sticky top-0">
      {/* Brand / Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border/40">
        <Link href="/admin" className="font-extrabold text-xl tracking-tight text-primary">
          QuickDidi <span className="text-foreground">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border/40 space-y-1">
        <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200">
          <Settings className="h-5 w-5" />
          Settings
        </button>
        <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-red-500 hover:bg-red-500/10 transition-all duration-200">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
