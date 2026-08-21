import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, TrendingUp, IndianRupee } from "lucide-react";
import { createClient } from "../../../utils/supabase/server";
import { cookies } from "next/headers";

export const metadata = {
  title: "Admin Dashboard - QuickDidi",
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Fetch Total Revenue
  const { data: revenueData } = await supabase
    .from("transactions")
    .select("amount")
    .eq("status", "paid");
  
  const totalRevenue = (revenueData as { amount: number }[] | null)?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;

  // 2. Fetch Active Bookings (Not completed or cancelled)
  const { count: activeBookingsCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .neq("status", "completed")
    .neq("status", "cancelled");

  // 3. Fetch Total Customers
  const { count: totalCustomersCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "customer");

  // 4. Fetch Verified Providers
  const { count: verifiedProvidersCount } = await supabase
    .from("providers")
    .select("*", { count: "exact", head: true })
    .eq("is_verified", true);

  // 5. Fetch Recent Bookings
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select(`
      id,
      status,
      created_at,
      services ( name, price ),
      users ( name )
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: "+0%", // Will be dynamic when we add historical tracking
      trend: "up",
      icon: IndianRupee,
    },
    {
      title: "Active Bookings",
      value: activeBookingsCount || 0,
      change: "+0%",
      trend: "up",
      icon: CalendarCheck,
    },
    {
      title: "Total Customers",
      value: totalCustomersCount || 0,
      change: "+0%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Verified Providers",
      value: verifiedProvidersCount || 0,
      change: "+0%",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back, Admin. Real-time platform metrics.</p>
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

      {/* Charts & Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="rounded-2xl border border-border/40 bg-card shadow-sm lg:col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[250px] text-muted-foreground border-t border-border/40 bg-muted/20">
            <TrendingUp className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p>Not enough transaction data to generate chart.</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border border-border/40 bg-card shadow-sm lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="p-0 border-t border-border/40">
            <div className="divide-y divide-border/40">
              {!(recentBookings as any[]) || (recentBookings as any[]).length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No bookings have been made yet.
                </div>
              ) : (
                (recentBookings as any[]).map((booking) => {
                  // Type casting for joined tables
                  const service = booking.services as any;
                  const customer = booking.users as any;
                  
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-foreground">{service?.name || "Unknown Service"}</p>
                        <p className="text-xs text-muted-foreground">Customer: {customer?.name || "Unknown"}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <p className="text-sm font-bold text-foreground">₹{service?.price || 0}</p>
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-500 uppercase tracking-wider">
                          {booking.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
