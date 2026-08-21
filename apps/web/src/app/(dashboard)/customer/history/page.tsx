export const metadata = {
  title: "Booking History - QuickDidi",
};

export default function CustomerHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Booking History</h1>
        <p className="text-muted-foreground mt-2">View all your past services and download invoices.</p>
      </div>

      <div className="bg-card rounded-3xl border border-border/40 p-8 shadow-sm text-center">
        <p className="text-muted-foreground">You have no past bookings yet.</p>
      </div>
    </div>
  );
}
