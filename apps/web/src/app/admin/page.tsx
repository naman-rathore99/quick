import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, TrendingUp, IndianRupee } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "₹24,590",
    change: "+12.5%",
    trend: "up",
    icon: IndianRupee,
  },
  {
    title: "Active Bookings",
    value: "145",
    change: "+4.2%",
    trend: "up",
    icon: CalendarCheck,
  },
  {
    title: "Total Customers",
    value: "1,240",
    change: "+18.1%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Verified Providers",
    value: "84",
    change: "+2.4%",
    trend: "up",
    icon: TrendingUp,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="rounded-2xl border border-border/40 bg-card shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-emerald-500 font-medium mt-1">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Placeholder for future charts / recent activity */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="rounded-2xl border border-border/40 bg-card shadow-sm lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64 text-muted-foreground border-t border-border/40 bg-muted/20">
            [Chart Area Placeholder]
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border border-border/40 bg-card shadow-sm lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="p-0 border-t border-border/40">
            <div className="divide-y divide-border/40">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">Bathroom Deep Clean</p>
                    <p className="text-xs text-muted-foreground">Customer: Naman Rathore</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">₹499</p>
                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-500">
                      In Progress
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
