import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PartnerLandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
          Become a QuickDidi Partner
        </h1>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto">
          Take control of your cleaning business. Set your own working location, choose the services you want to offer (or create custom bundles), and set your own prices.
        </p>

        <div className="grid gap-6 sm:grid-cols-3 mb-12 text-left">
          <div className="p-6 rounded-2xl border border-border/60 bg-card">
            <h3 className="font-semibold text-lg mb-2">📍 Work Locally</h3>
            <p className="text-sm text-muted-foreground">Select the neighborhoods you want to serve. No more long commutes.</p>
          </div>
          <div className="p-6 rounded-2xl border border-border/60 bg-card">
            <h3 className="font-semibold text-lg mb-2">💰 Your Prices</h3>
            <p className="text-sm text-muted-foreground">Charge per task or bundle services together (e.g. Dusting + Sweeping for ₹150).</p>
          </div>
          <div className="p-6 rounded-2xl border border-border/60 bg-card">
            <h3 className="font-semibold text-lg mb-2">📅 Flexible Hours</h3>
            <p className="text-sm text-muted-foreground">Accept only the bookings that fit your schedule.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/onboarding/provider">
            <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8">
              Apply Now
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4 sm:mt-0 sm:ml-4">
            Already a partner? <Link href="/login" className="text-primary hover:underline font-medium">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
