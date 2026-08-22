"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../../context/auth-context";
import { createBrowserClient } from "../../../../utils/supabase/client";

export default function ProviderOnboardingPage() {
  const router = useRouter();
  const supabase = createBrowserClient();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [services, setServices] = useState<{ bundle_name: string; custom_price: number }[]>([
    { bundle_name: "", custom_price: 0 }
  ]);

  const handleAddService = () => {
    setServices([...services, { bundle_name: "", custom_price: 0 }]);
  };

  const handleServiceChange = (index: number, field: "bundle_name" | "custom_price", value: string) => {
    const newServices = [...services];
    if (field === "custom_price") {
      newServices[index][field] = parseInt(value, 10) || 0;
    } else {
      newServices[index][field] = value;
    }
    setServices(newServices);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      
      const res = await fetch(`${API_URL}/providers/onboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          location,
          bio,
          services
        })
      });

      if (res.ok) {
        router.push("/dashboard/provider");
      } else {
        const err = await res.json();
        alert(err.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg bg-card border border-border/60 rounded-3xl p-8 shadow-sm">
        
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome! Where do you work?</h2>
              <p className="text-sm text-muted-foreground">Let customers know which areas you serve.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your City / Neighborhood</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. South Delhi, Vasant Kunj"
                className="w-full rounded-lg border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            
            <Button className="w-full" onClick={() => setStep(2)} disabled={!location.trim()}>
              Next Step
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Set Your Services & Prices</h2>
              <p className="text-sm text-muted-foreground">List individual tasks or create bundles (e.g. "Dusting + Sweeping").</p>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {services.map((service, index) => (
                <div key={index} className="p-4 border border-border/60 rounded-xl space-y-3 bg-muted/20">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Task or Bundle Name</label>
                    <input 
                      type="text" 
                      value={service.bundle_name}
                      onChange={(e) => handleServiceChange(index, "bundle_name", e.target.value)}
                      placeholder="e.g. 2BHK Deep Cleaning"
                      className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Your Price (₹)</label>
                    <input 
                      type="number" 
                      value={service.custom_price || ""}
                      onChange={(e) => handleServiceChange(index, "custom_price", e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <Button type="button" variant="outline" className="w-full" onClick={handleAddService}>
              + Add another service / bundle
            </Button>

            <div className="flex gap-3 pt-4">
              <Button variant="secondary" className="w-1/3" onClick={() => setStep(1)}>Back</Button>
              <Button className="w-2/3" onClick={() => setStep(3)} disabled={!services[0].bundle_name || !services[0].custom_price}>
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
              <p className="text-sm text-muted-foreground">Customers love knowing who they are hiring.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Bio</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="I have 5 years of experience in housekeeping..."
                rows={4}
                className="w-full rounded-lg border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" className="w-1/3" onClick={() => setStep(2)}>Back</Button>
              <Button className="w-2/3" onClick={handleSubmit} disabled={loading || !bio.trim()}>
                {loading ? "Saving..." : "Complete Profile"}
              </Button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
