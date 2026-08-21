import Link from "next/link";
import { Clock, History, Wallet, UserCircle } from "lucide-react";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Customer Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <div className="bg-card rounded-3xl border border-border/40 p-6 shadow-sm mb-4 text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-bold text-foreground">Naman Rathore</h2>
            <p className="text-sm text-muted-foreground">Customer</p>
          </div>

          <nav className="bg-card rounded-3xl border border-border/40 p-4 shadow-sm flex flex-col gap-1">
            <Link href="/customer" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold transition-colors">
              <Clock className="h-5 w-5" />
              Active Booking
            </Link>
            <Link href="/customer/history" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors">
              <History className="h-5 w-5" />
              History
            </Link>
            <Link href="/customer/wallet" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors">
              <Wallet className="h-5 w-5" />
              Wallet & Refunds
            </Link>
          </nav>
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1">
          {children}
        </main>

      </div>
    </div>
  );
}
