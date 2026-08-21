import { ActiveBookingTracker } from "@/features/customer/components/ActiveBookingTracker";

export const metadata = {
  title: "My Booking - QuickDidi",
};

export default function CustomerActiveBookingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Active Booking</h1>
        <p className="text-muted-foreground mt-2">Track your requested home service in real-time.</p>
      </div>

      {/* 
        In a real app, this would fetch from Supabase:
        const { data } = await supabase.from('bookings').select('*').eq('customer_id', user.id).eq('status', 'en_route').single();
      */}
      
      <ActiveBookingTracker 
        status="en_route" 
        estimatedWindow="20 - 30 mins" 
        providerName="Priya Sharma"
        serviceName="Bathroom Deep Clean"
      />

    </div>
  );
}
